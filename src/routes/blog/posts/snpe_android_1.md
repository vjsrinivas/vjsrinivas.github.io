---
title: Journey with Qualcomm SNPE on Android
description: Description goes here
created: '2023-01-11T19:45:28.107Z'
tags: machine learning
---

For the past couple of weeks, I've been working on a project that would mimic the behavior of Apple's "CenterStage". As a part of that project, I wanted to explore how neural networks were deployed, accelerated, and utilized on smartphone devices.

<!-- more -->

<style>
  .video_override {
    height: 610px !important;
  }
</style>


<video autoplay muted class="video_override">
  <source src="./post-res/snpe_android_1/demo1.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

More specifically, what was the best method that produced the fastest neural networks on an Android smartphone? How could you connect this neural network with a live data feed (such as images from the phone's camera)? What were the limitations of neural networks on smartphones?

My Masters Thesis focused on deploying neural networks to low-powered, low-resource "edge" devices. The toolkits that exist for these edge devices allowed developers to optimize networks via layer optimization and quantization. A very similar environment exists for smartphones. Hardware-wise, these devices are almost exactly the same as the edge devices I've worked with before, but because of their general target user, they have large limitations in terms of application access to said hardware.

In terms of Android, neural network operations are abstracted and defined in terms of the **NNAPI**, which can do various I/O for data input as well as primitive operations. Many of the toolkits for neural network inferencing on Android smartphones utilize NNAPI methods, but only one of these toolkits has integration on a deeper hardware level - Qualcomm Snapdragon Neural Processing Engine (Qualcomm SNPE). At the time of this writing, Qualcomm produces the majority of smartphone hardware components (CPUs, GPUs, and DSPs), and Qualcomm SNPE offers optimizations aimed directly at a large swath of these components.

But why not toolkits such as Tensorflow Lite or MNN? Apart from wide smartphone support and less abstracted access to neural network I/O and inference operations, I have no clear basis for choosing Qualcomm SNPE. [Qualcomm might have you believe that their optimization process can have neural networks running faster than any other toolkit](https://developer.qualcomm.com/software/qualcomm-neural-processing-sdk/learning-resources/ai-ml-android-neural-processing/benchmarking-neural-processing-sdk-tensorflow). But, [Zhang et. al](https://dl.acm.org/doi/fullHtml/10.1145/3485447.3512148) show that the "fastest" toolkit is very dependent on network architecture and hardware availability. In terms of hardware availability, most toolkits have access to the CPU and GPU, and Tensorflow Lite *just* implemented a runtime option with Qualcomm DSP. That said, the concepts and procedures I've taken with Qualcomm SNPE would apply to almost any other mobile NN toolkit. 

## Processing a Neural Network

### Choosing Neural Network

Before a neural network can run on an smartphone, it must be processed through your toolkit of choice. This toolkit will regenerate your network's layer structure, operations, and weights into its own proprietary file format (in SNPE's case, we generate **dlc** files). This file is then read and intrepreted by the smartphone code **you** write. You also need to write code for preprocessing the input into your network as well as the output from the network. For my first baby steps, I utilized the following off-the-shelf CNNs for image classification - ResNet18, MobileNetv2, and MobileNetv3. These models were all from PyTorch's torchvision library and were trained on the traditional 1000-class ImageNet dataset. 

Choosing the proper network (or designing a network for mobile deployment) can be tricky. Here are some network attributes I look for:

- Total network parameter size
  - Each parameter is a number and each number takes up space in memory
- Total network operations
  - This can be measured in FLOPs or GFLOPs
  - Usually correlated with parameter size
  - Arguably more important than total network parameter size for real-time computation on edge or smartphone devices
- Layer Type/Layer Operation
  - Many toolkits for edge/smartphone platforms have a limited set of supported operations
  - Some operations (ex: deformable convolutions) can be computationally expensive and resource heavy
- Complexity of network connections
  - Many SOTA or popular networks utilize things like skip-connections, residual connections, etc.
  - This is typically not an issue in terms of computation or resources on our targeted hardware 
  - Architectures containing certain advanced connections can cause bad optimization (quantization or pruning)

### SNPE Network Integration

Qualcomm SNPE has integration with many of the popular deep learning frameworks. You would think that because the models I'm using were created and trained in PyTorch, I would use the SNPE PyTorch integration. But I found that there are many bugs and issues related to the PyTorch conversion process with the current SNPE build I am using (1.68.0.3932). Instead, I converted the model into **ONNX**, which is a open-source exchange standard for neural networks. This means that if your model is able to be exported as ONNX model, it can be exchanged into other frameworks, such as TensorFlow. So, the tricky part becomes properly exporting your ONNX model into the SNPE ONNX integration.

For ResNet-based networks, ONNX exporting is flawless, and in turn the SNPE conversion is also completed with no issues. It was similar for MobileNetv2, but MobileNetv3 is where stuff got a little hairy. The main issue is related to the "Layer Type/Layer Operation" point in the list above. The neural network would export from ONNX without issue but would error out in SNPE with a "layer not supported" error. What part of the network was not supported by Qualcomm SNPE? It was the activation functions! One of the advancements that MobileNetv3 had was the integration of two new activation functions - Hard Sigmoid and Hard Swish. Both activations were derivatives of older, more primitive activations function that SNPE **did** support, so I reworked those activation functions into simpler operations in PyTorch. This simplified network was re-exported to ONNX and SNPE successfully.

**Hard Sigmoid:**

It utilizes ReLU6 (which is ReLU but the value is capped between [-6,6] ). 

```
hard_sigmoid(x) = ReLU6(x+3)/6
```

**Hard Swish:**

It is just Hard Sigmoid with an extra coefficient:

```
hard_swish(x) = x(ReLU6(x+3)/6)
```

[Source for equivalents](https://patrick-llgc.github.io/Learning-Deep-Learning/paper_notes/mobilenets_v3.html)

**SNPE Exporting Command:**

```bash
./snpe-onnx-to-dlc --input_network [PATH_TO_ONNX_FILE] --out_node [OUTPUT_NAME] -o [NETWORK].dlc
```

*N.B. --out_node corresponds to the name of the layer that gives you the output(s). You can find the output(s) from an ONNX model by using Netron.  Multiple outputs are separated by a comma.*

### SNPE Optimization

One of the main optimizations that SNPE offers is quantization. Quantization reduces a neural network's parameters (or weights) from a higher precision datatype to a lower precision datatype. Typically, neural networks are trained in FLOAT32 (sometimes FLOAT64). Quantization can step the parameters down to FLOAT16 and INT8. For FLOAT16, it is a very straight forward recasting with little to no loss in task performance. For INT8, you are constrained to a [-128,128] integer range, which means you need to approximate the neural network parameter ranges. This approximation is accomplished with various algorithms, but the majority of them use a calibrating dataset.

Qualcomm SNPE offers this INT8 quantization, and it is probably the easiest quantization process I've used. You need to determine the images you want to use for calibration, and preprocess those images into a matrix that is arranged in a way that SNPE can accept it. The format is a single vector of `W*H*3`, where `W` and `H` are the width and height of the neural network input. The order is also in `R_0, G_0, B_0, R_1, G_1, B_1,...R_n, G_n, B_n`, where the subscripts are the pixels in Cartesian coordinates. **This is important later on when I'm coding in Android Studio!**

For preprocessing these images in Python, it is a breeze. You read in your images in OpenCV2 or PIL, preprocess it with the proper functions for that network, and save the output to a file with numpy's `tofile`. You also need a text file with the paths to those packaged images.

For reference, this was my code:

```python
with open(os.path.join(OUTPATH, "quant.txt"), 'w') as quant_file:
    # write ur custom output nodes here before for loop:
    for _f in f:
        _f2 = _f.replace("JPEG", "raw")
        _fi = os.path.join(IMAGENET_PATH, _f)
        _img = cv2.imread(_fi) # read image (h,w,3)
        _img = transform(_img) # transform is a preprocess function from torchvision.transforms.Compose
        _img = _img.unsqueeze(axis=0).numpy()
        _img.tofile(os.path.join(OUTPATH, _f2)) # write the numpy file to disk
        quant_file.write("%s\n"%os.path.join(os.getcwd(), OUTPATH, _f2)) # write path to text file
        
```

The SNPE quantization to INT8 is the following command:

```bash
snpe-dlc-quantize \
        --input_dlc [INPUT_DLC].dlc \
        --input_list [PATH TO TEXT FILE] \
        --output_dlc [OUTPUT_QUANT].dlc\
        --enable_htp \ # htp (hexagon tensor processor) made for general NN acceleration
        --enable_hta # hta (hexagon tensor acceclerator) is a type of convolution hardware accelerator

```

### SNPE Optimization Considerations

Typically, I would encourage INT8 quantization to almost all models, but this type of quantization can lead to catastrophic loss in task performance. Make sure you pick images that are representative of your training dataset, and consider the architecture of your network since some architecture lend themselves better for quantization than others. Another thing to consider, especially with smartphones, is the hardware support for INT8 operations

Typically, CPUs have components that allow for computations in all the major datatypes, but the overall speed (regardless of network quantization) is typically below real-time speeds. Most modern smartphones have GPUs, which enable things like 1080p to 4k video playback or videogames.  Desktop GPUs are known to have different components that enable FLOAT32, FLOAT16, or INT8 computation, **but it seems that Qualcomm's smartphone GPUs do not support INT8 computation.** This means that if you run neural networks on a smartphone with a Qualcomm GPU, it will be recasted as a FLOAT32 network. From my understanding, Qualcomm's DSP, HTP, and HTA components **only** support INT8 computations, and you would probably see faster speeds on those hardware components. 

Unfortunately, DSPs and Tensor-based Hardware are **very** new, and only high-end chipsets have it. My current smartphone does not support DSPs, so my networks are using FLOAT32 and run on the GPU.

## Android Project Setup

With my network converted to the DLC format, I can start integrating it into my android application. The application will be a simple camera passthrough that will display the most confident classification. I will use the Camera2 API to access the back-facing camera's preview data, which will feed into the inference function of the neural network. The Camera2 preview data can be interpreted as a Bitmap, and that Bitmap can be converted and preprocessed into a FloatArray, which can be read by SNPE's Android APK. 

Disclaimer: This is the first time I've used Android Studio. This is the first time I've done Android App development. This is the first time I've touched Kotlin, so many parts of this application might be unoptimized.

### Camera Access

Camera access can be tricky in Android with three main types of APIs: Camera, Camera2, and CameraX. Camera2 provides the lowest level access to things like Android image-processing pipelines. It is also one of the most verbose APIs for camera access. I utilized the "Camera2Extensions" project from [camera_samples](https://github.com/android/camera-samples) to help me get setup. The most important part for me is the `onSurfaceTextureUpdated` callback that provides an updated `SurfaceTexture`. To get a frame that we can actually use, I call the `getBitmap` function that is in the `TextureView` object. This `TextureView` object is what the `CameraManager` (from Camera2) will write to in order to display what the camera sees.

### Neural Network

Before working with our SNPE neural network, we need to load the provided SNPE APKs located in the "android" folder within your SNPE installation folder (example: `/home/snpe-1.68.0.3932/android`). Once SNPE is sucessfully loaded in Android Studio, we can load our DLC file and build our neural network on our smartphone:

```kotlin
// Load DLC file that I've put in the raw resource folder
val modelStream = resources.openRawResource(fileModelPath) //fileModelPath = R.resource.raw.mobilenetv3
val builder = SNPE.NeuralNetworkBuilder(context) // context is the MainActivity application (can be grabbed in various ways)
builder.setRuntimeOrder(NeuralNetwork.Runtime.GPU) // define which runtime you'll be using
builder.setModel(modelStream, modelStream.available())
network = builder.build(); // Build!

// Defining an input tensor that will get rewritten when a new camera frame is ready
val inputShape = network.inputTensorsShapes["input0"]
inputTensor = network.createFloatTensor(inputShape!![0], inputShape[1], inputShape[2], inputShape[3]);
```

### Preprocessing Method

The neural network's input format is going to be an input `Tensor`, which is nested into a `Map<String, FloatTensor>` object. This map object has a key, which is the input node of the network, and a value, which is the input tensor. You can write the contents of a native Kotlin `Array` object to a SNPE `Tensor` object by using the `write` function. Similarly, you can read contents of a SNPE `Tensor` object to a `FloatArray` by using the `Tensor.read` function.

So the main task becomes: how do we take the Bitmap object, preprocess it with things such as image resizing and standardization in real-time, and convert that preprocessed image into a `FloatArray` with the same RGB format as mentioned in the "SNPE Optimization" section. All in real-time.

I quickly found that the typical route of generating a FloatArray of pixels with Bitmap's `getPixel` function would mean I would have to manually split channels apart, standardized each pixel one at a time, and reorganize them into the proper format. All of this with Kotlin is **extremely** slow. So, the next best thing is to do this with OpenCV2 and utilize JNI C++ (Java Native Interface). 

With OpenCV2 on Android, I could convert the Bitmap to a `Mat` object in Kotlin and then feed it into my custom preprocessing C++ function.

Here is the code for that:

```kotlin
val _bitMap2: Bitmap = Bitmap.createScaledBitmap(_bitMap, 224, 224, true); // _bitMap is the bitmap created from the TextureView object
Utils.bitmapToMat(_bitMap2, bitMat) // bitMat is already predefined; we are filling in data
```

Here is the C++ preprocessing code:

```c++
extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_example_neuralexample2_fragments_CameraFragment_MatNormalization(JNIEnv *env, jobject thiz, jlong matAddr) {
    float mMean[3] = {0.485, 0.456, 0.406};
    float mStd[3] = {0.229, 0.224, 0.225}; 

    cv::Mat *mainMat  = (cv::Mat*)matAddr;
    int rows = mainMat->rows;
    int cols = mainMat->cols;
    cv::Mat floatImg;
    mainMat->convertTo(floatImg, CV_32FC1);
    std::vector<cv::Mat> floatChannels(4);
    cv::split(floatImg, floatChannels);
    floatChannels.pop_back();

    for(int i=0; i<3; i++) {
        int j, k;
        float *p;

        for (j = 0; j < rows; ++j) {
            p = floatChannels[i].ptr<float>(j);
            for (k = 0; k < cols; ++k) {
                p[k] = ((p[k]/255.0)-mMean[i])/(mStd[i]);
            }
        }
    }

    cv::merge(floatChannels, floatImg);
    floatImg = floatImg.reshape(1,1); // This puts it in [R0, G0, B0, R1, G1, B1, ..., Rn, Gn, Bn]
    float* FmatData = (float*)floatImg.data;

    int rgbLength = rows*cols*3;
    jfloatArray _jout = env->NewFloatArray(rgbLength);
 
    env->SetFloatArrayRegion(_jout, 0, rgbLength, FmatData);
    return _jout; // We are returning a FloatArray
}
```

The whole preprocessing function:

```kotlin
val _bitMap2: Bitmap = Bitmap.createScaledBitmap(_bitMap, 224, 224, true);
Utils.bitmapToMat(_bitMap2, bitMat)
var test: FloatArray = MatNormalization(bitMat.nativeObjAddr)
Utils.matToBitmap(bitMat, _bitMap2)
```

### Inference Method

To infer with the neural network, just package the `tensor` object into the aforementioned map and extract the output tensor. With the output tensor, post-processing can be applied and the output tensor can be freed.

```kotlin
// inputTensor is a class member so we don't recreate that tensor over and over again
// inputMat is the preprocessed FloatArray
inputTensor.write(inputMat, 0, inputMat.size);
val inputsMap = mapOf<String, FloatTensor>("input0" to inputTensor) // input Map object
/////////////////////////////////////////////
outputsMap = network.execute(inputsMap); // outputsMap is a lateinit class member
/////////////////////////////////////////////

// predictionProbs is a FloatArray that is already defined as a class member
outputsMap["output0"]?.read(predictionProbs,0,1000,0); // Write output tensor result's to float array

// Post-processing:
val probs = softmax(predictionProbs, predictionProbs.size);
val idx = probs.withIndex().maxByOrNull { it.value }?.index;
val displayOut = "Classified: %s (%.2f)".format(IMAGENET_CLASSES[idx!!], probs[idx!!])

// Clean up output tensor to avoid memory leaks
for (outtensor in outputsMap) {
    outtensor.value.release()
}
```

### Post-Processing Method

For my classification network, post-processing is very simple - apply softmax on the logits. It's a pretty easy math equation, so I just implemented it in Kotlin directly:

```kotlin
fun softmax(probs:FloatArray) {
    val expVector = probs.map { exp(it) }
    val expSum = expVector.sum()
    for (i in 0 until expVector.size) {
        probs[i] = expVector[i] / expSum
    }
}
```

Then I apply an `argmax` to get the most confident class, and we're done! The output is put into a nice string with a template of: `CLASS_NAME - CLASS_CONFIDENCE%`. I have a `TextView` object that is over the `TextureView` object, and I send a write update to the `TextView` object once I get my prediction. This enables the user to see the predictions themselves.

## Performance

Neural network performance and application was measured on a Samsung A71 5G UW, which has the following compute specs:

- CPU: Octa-core (1x2.4 GHz Kryo 475 Prime & 1x2.2 GHz Kryo 475 Gold & 6x1.8 GHz Kryo 475 Silver)
- GPU: Qualcomm Adreno 620
- DPS/HTA/HTP: None

### Neural Network Performance

I measured the inference speed of all the aforementioned neural networks and saw that the quantized models do not improve the speed. This is because, as mentioned before, the Adreno 620 does not support INT8 inferencing so the quantized models are upsampled to FLOAT32. Additionally, FLOAT16 mode is also **not** supported on the Adreno 620.

![](./post-res/snpe_android_1/performance_infer.png)

### End-to-End Application Performance

I also measured the FPS of the entire application from camera capture to classifier output for 30 seconds. The average end-to-end time for the application was ~53 FPS. With some sporadic drops in the 30-40 FPS range.

![](./post-res/snpe_android_1/performance.png)

| Statistical Type       | FPS   |
| ---------------------- | ----- |
| 5th percentile (worst) | 43.48 |
| 99th percentile (best) | 66.67 |
| Average                | 53.49 |

### Conclusions

Throughout my journey with Qualcomm SNPE, I realized that the difficulties with this toolkit are essentially the same as the ones I faced when working through TensorRT for NVIDIA Jetsons, Alibaba's MNN for the Raspberry Pi 4, or Tensorflow Lite for TinyML. One conceptual thing I've noticed is that these toolkits are going through the same feature flattening that major ML frameworks have and are still going through. They are all converging into a similar model conversion pipeline, with a growing set of core supported layer operations, and reliable methods for things like quantization. Many of these toolkits might boast speed-ups  over each other with benchmarks of certain networks, but, as stated before, they fail to capture the fact that network speeds can be erratic.

In terms of development, I learned a lot about Android development. I have experience in traditional media  pipelines, such as GStreamer or FFMPEG, so the Camera2 pipeline was pretty straight-forward for me. The callback function presented a very easy way to capture the preview data, but I never figured out how to edit an image and render it on the same `TextureView`. Apart from that, getting Qualcomm SNPE working on Android was also fairly easy since the APK integration worked flawlessly. Finally, accelerating various portions of my application, such as the preprocessing step, was incredibly gratifying because I finally got to use C++. I've used OpenCV2 in Python and C++, so this native code on Android made me feel at home. 

This probably isn't the end of my exploration of SNPE or mobile app development in general. I think I'll keep exploring other types of neural networks - such as object detectors.
