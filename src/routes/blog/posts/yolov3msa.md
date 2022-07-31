---
title: Effects of Multiheaded Self-Attention on YOLOv3
description: (Still a WIP) I tried to apply Multiheaded Self-Attention (MSA) to a generic object detector (YOLOv3). Here are some of my results.
created: '2022-04-25T19:45:28.107Z'
tags: machine learning | wip
art_credit: DALL-E
---

<link rel='stylesheet' href='post-res/yolov3msa/style.css'>

For my graduate Deep Learning (DL) class, we had a final project assignment that tasked us to conduct novel experiments on a DL area. I decided to implement a MSA module to a common, generic, fast object detector called YOLOv3. We see improvements in classification but significant decrease in localization performance for most network configurations.

<!-- more -->

# Introduction

With the introduction of Transformers into deep learning, tasks related to natural language processing (NLP) have im-proved tremendously compared to previous types of networks and architecture. Transformers calculate ”self-attention” in order to contextualize the sequence of input data they are given. The Transformer architecture is now being utilized in computer vision (CV) tasks, such as classification and object detection. With the introduction of ViT for image classification [9], Transformers seem to comparable or even better performance compared to convolutional neural networks (CNNs). Naturally, there has also been work done on combining the Transformer’s self attention mechanism with convolutional layers. Particularly, the work done by Park et al. ([9]) has shown a significant improvement in classification accuracy of a blend of convolutional layers and multi-headed self attention (MSA) modules.

For residual-based network, [9] empirically established that replacing a residual block with MSA modules at the end of each stage in an alternating fashion helped those networks improve classification accuracy. In this paper, we extended the work done in [9] to object detection and attempted to apply the same MSA modules toward object detection networks. More specifically, we modified a real-time, single stage object detector called YOLOv3 with differing layouts of MSA modules and observe the detection performance. 

Through our analysis, we conclude that MSAs could increase mAP performance, but directly applying them to any object detection network is not a straight-forward pro- cess. Our experiments show that **the majority of the YOLOv3 MSA configurations decrease performance.** We attribute that to non-optimal augmentations, non-optimal hyperparameters within the MSA modules, and non-convex loss surfaces for localization-based functions that are present in YOLOv3.

# Architectures

<figure>
<img src="./post-res/yolov3msa/diagrams/yolov3_structure.svg" width="300"  alt="A diagram describing the general structure of YOLOv3"/>
<figcaption><b>Fig. 1</b> - <b>General structure of YOLOv3.</b> The network is composed of a feature extractor called Darknet53. The feature map output from the feature extractor is actually composed of three different feature maps. Each feature maps are from different parts of the feature extractor and are supposed to represent objects at different ”scales”. Each feature map scale is processed in parallel in the YOLO head. The output of the network is three different sets of predictions.</figcaption>
</figure>

<figure>
<img src="./post-res/yolov3msa/diagrams/yolov3_structure_all_msas.svg" width="300"  alt="A diagram describing the different structures of YOLOv3 MSA"/>
<figcaption><b>Fig. 2</b> - <b>Structure of Darknet53 as a classifier.</b> The classifier reduces the feature map output from the Residual structure into a vector of class probabilities with Global Average Pooling (GAP). This allows the CNN to have flexible input sizes while maintaining the consistent class-based probability output.</figcaption>
</figure>

# Methodology

## Classification Training Procedures

For classification training, we utilized Adam as our primary optimization method because of established literature showing quicker loss convergence compared to SGD. We trained for 350 epochs with a learning rate of 0.0005 and a Cosine Annealing learning rate scheduler. Both networks were trained with a batchsize of 1024, and the input size was 32 by 32.

Both networks used Categorical Cross Entropy (CCE) for their loss function. We take the model with the best validation performance and display the test results.

## Object Detection Training Procedures

For object detection training, we kept in-line with the default training procedures. YOLOv3 loss function is a multi-task loss function composed of three different losses. Each of the losses and their descriptions are as follows:

- **Classification** - Applying CCE with the prediction and ground truth labels for corresponding boxes
- **Coordinate Localization** - The L2 distance between a  matched prediction box coordinates and its corresponding ground truth box's coordinates 
- **Objectness** - A logistic regression using BCE to determine if a given area of an image contains an object or not

For Oxford IIT Pet dataset, we trained each network for 350 epochs at a learning rate of 0.0001 with a batchsize of 16. For VOC, we trained each network for 56 epochs at a learning rate of 0.0001. Both training sets are using the same learning rate scheduler for all three loss functions. Both networks had an input size of 416 by 416.

# Datasets

For this work, we utilize two main object detection datasets and one classification dataset. For the object detection task, we trained YOLOv3 on Oxford IIT Pet dataset and Visual Objects Challenge (VOC) dataset.

## Oxford IIT Pet Dataset
The Oxford IIT Pet dataset is composed of "37 [pet categories] with roughly 200 images for each class" [10]. The annotation style is visualized in Figure 3, and a given method should output either the localization of the head or segmentation of the whole pet and the classification of the specific pet breed.

<figure>
<img src="./post-res/yolov3msa/diagrams/pet_annotations.jpg" width="300"  alt="Oxford IIT Pet annotation examples."/>
<figcaption><b>Fig. 3</b> - <b>Illustration of annotations provided in the Oxford IIT Pet dataset.</b>
Each image is of one pet, and for our purposes, we focused on localizing the head of the animal and classifying the animal by breed. This annotation diagram was taken directly from [10].
</figcaption>
</figure>

## Visual Object Challenge Dataset

The VOC datasets are a set of multiple datasets based on various years of the challenges. In terms of literature importance, VOC2007 and VOC2012 were the most utilized datasets among the VOC family, which is why we are using them in our work. VOC2007 is composed of 20 classes with a total of 4,952 training images and 2,501 testing images. 

Similarly, VOC2012 contains the same 20 classes but contains a total of 5,171 training images and 5,823 validation images. From Figure 4, the annotation style is similar to the Oxford IIT Pet dataset, where the objects are labeled with a bounding box and each box is assigned one of the 20 classes. In this work, we combine VOC2007 and VOC2012 training set and test on the VOC2007 test set.

<figure>
<img src="./post-res/yolov3msa/diagrams/voc2007_annotation_example.png" width="300"  alt="VOC (Visual Object Context) annotation example"/>
<figcaption><b>Fig. 4</b> - <b>Illustration of annotations provided in VOC2007 dataset.</b> The dataset is composed of bounding boxes and segmentation masks. For our purposes, we are focusing on the bounding box. The image is taken from [3].
</figcaption>
</figure>

## CIFAR-10
CIFAR-10 is a popular and very simple dataset that contains 10 classes. Each class is a generic object or subject, and the dataset is composed of 60,000 32x32 images [5].

# Results

## Classification Results

As mentioned in the Implementation section, we implement Darknet53 as a classifier and add MSA modifications seen in Figure 4. We trained on CIFAR-10 and see a notable improvement of 1.23% on Darknet53 with MSA compared to the original Darknet53 network.

| **Model Type** | **Top-1 Accuracy on CIFAR-10** |
|---------------------------------------|-------------------------------|
|              Darknet53                | 0.8803                        |
|              Darknet53 with MSA       | **0.8926 (+0.0123)**             |

<br>

## Object Detection Results

<figure>
<img src="./post-res/yolov3msa/diagrams/all_dog_maps.png" width="300"  alt="Graph showing mAP scores of all the networks trained on the Oxford IIT Pet dataset."/>
<figcaption><b>Fig. 5</b> - <b>The mAP trend during training for Oxford IIT Pet testset and
VOC2007 testset.</b>
</figcaption>
</figure>

<figure>
<img src="./post-res/yolov3msa/diagrams/all_voc_maps.png" width="300"  alt=""/>
<figcaption><b>Fig. 6</b> - <b>The mAP trend during training for Oxford IIT Pet testset and VOC2007 testset.</b>
</figcaption>
</figure>

<figure>
<img src="./post-res/yolov3msa/diagrams/map_delta_dog.svg" style="width: 350px; display: inline"  alt=""/>
<img src="./post-res/yolov3msa/diagrams/map_delta_voc.svg" style="width: 350px; display: inline"  alt=""/>
<figcaption><b>Fig. 7</b> - <b>The mAP deltas for YOLOv3 MSAs on Oxford IIT Pet testset and VOC2007 testset.</b> The number of MSA modules is not always correlated with the loss or gain of performance in this particular network.
</figcaption>
</figure>

| **Model Type** | **Oxford IIT Pet testset mAP @ 0.5** |  **VOC2007 testset mAP @ 0.5** |
|---------------------------------------|-------------------------------|-------------------------------|
|YOLOv3 | 0.92 | 0.747 |
|YOLOv3 MSA 4| 0.909 (-0.011) | 0.739 (-0.008)|
|YOLOv3 MSA 3| 0.928 (+0.008) | 0.726 (-0.021)|
|YOLOv3 MSA 2| 0.905 (-0.015) | 0.732 (-0.015)|
|YOLOv3 MSA 1| 0.919 (-0.001) | 0.739 (-0.008)|

<br>


| **Model Type + Remove Augmentations** | **VOC2007 Testset mAP @ 0.5** |
|---------------------------------------|-------------------------------|
|       YOLOv3 (No Augmentations)       | 0.4564                        |
|    YOLOv3 MSA 4 (No Augmentations)    | **0.4871 (+0.0307)**          |
|           YOLOv3 (No Mosaic)          | **0.7105**                    |
|        YOLOv3 MSA 4 (No Mosaic)       | 0.6859 (-0.0246)              |
|      YOLOv3 (No Mosaic + No EMA)      | **0.7060**                    |
|   YOLOv3 MSA 4 (No Mosaic + No EMA)   | 0.6873 (-0.0187)              |

<br>

# Conclusions

From our experiments, we conclude the following:
* When applied to classifiers, MSA modules make a notable improvement in classification accuracy (reaffirming work done by [9])
* When applied to YOLOv3, MSA modules marginally decrease mAP performance
* In some cases, MSA modules can improve mAP performance, but these improvements are not in alignment with the number of MSAs present in the network and are marginal
* In terms of lost mAP, the number of MSA modules did not always correlate to how much mAP was lost.
* Training trends show that YOLOv3 MSAs with any number of MSA heads increase localization and objectness
loss
* The more MSA heads a network has, the greater the objectness loss

**1) Bad Localization:** From the experimental results, we can see that MSA modules had an outsized negative affect on the localization and objectness portions of the loss function. But why? From [9], MSAs improve network metric performance by ”smoothing” the loss surface of a convex function. If the function is non-convex, MSA does not perform as well as a Conv layer. Unfortunately, L2 distance and logistic regression even with a convex loss function) are not guaranteed to be convex [8]. From Figure 13, it seems that both loss surfaces for the tested datasets (particularly for VOC) were not convex.

**2) Training Procedures Matter:** As stated in the list above, we did not see any notable improvements with MSA, and so we decided to investigate further into why. It is well-established that augmentations can drastically help with mAP performance, so we decided to investigate if a set of augmentations were holding back the MSA network rather than helping. Firstly, we removed ALL augmentations and trained YOLOv3 and YOLOv3 MSA 4. In this case, YOLOv3 MSA 4 outperformed YOLOv3 by 3% mAP.

This is the biggest change in mAP recorded in this work thus far. Although the overall mAP for both networks is drastically lower than with any augmentations, it gave credence to our hypothesis that MSA-based networks were being negatively affected by a non-optimal set of augmentations. We then tried training the same networks without the Mosaic augmentation, which has helped CNN performance but had no conclusive effect on Transformer-based networks.

Based on [7], EMA can negatively affect Transformer learning, so we also ran a training without Mosaic and EMA. All the results are located in Table III, but removal of these two augmentations still showed the MSA network lagging behind the CNN network. In this case, the mAP delta is greater than any of the deltas in Table II. Although, we affirm that EMA did have a negative effect on the MSA.

**3) MSA Head Dimensions:** From our Technical Approach section, we stated that each MSA module has a dimension length for a given head. We had set all the heads to a dimension of 64 to fit the models on the present hardware. From our literature review, networks such as ViT YOLO have their head dimensionality at 1024. A possible way of increasing performance would be to increase the head dimensions. It is clear that conventional CNN networks can benefit from the addition of MSAs. But from our experiments and conclusions, it comes with a bold asterisk. Regardless, we see the future of object detection incorporating a multitude of different layers to increase true scene interpretation.


# References

**[1]** Alexey Bochkovskiy, Chien-Yao Wang, and Hong-Yuan Mark Liao. Yolov4: Optimal speed and accuracy of object detection, 2020.

**[2]** Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai, Thomas Unterthiner, Mostafa Dehghani,Matthias Minderer, Georg Heigold, Sylvain Gelly, et al. An image is worth 16x16 words: Transformers for image recognition at scale. arXiv preprint arXiv:2010.11929, 2020.

**[3]** M. Everingham, L. Van Gool, C. K. I. Williams, J. Winn,and A. Zisserman. The PASCAL Visual Object ClassesChallenge 2007 (VOC2007) Results. http://www.pascal-network.org/challenges/VOC/voc2007/workshop/index.html.

**[4]** Gao Huang, Yu Sun, Zhuang Liu, Daniel Sedra, and Kilian Weinberger. Deep networks with stochastic depth, 2016.

**[5]** Alex Krizhevsky. Learning multiple layers of features from tiny images. 2009.

**[6]** Yawei Li, Kai Zhang, Jiezhang Cao, Radu Timofte, and Luc Van Gool. Localvit: Bringing locality to vision transformers. arXiv preprint arXiv:2104.05707, 2021.

**[7]** Ze Liu, Yutong Lin, Yue Cao, Han Hu, Yixuan Wei, Zheng Zhang, Stephen Lin, and Baining Guo. Swin transformer: Hierarchical vision transformer using shifted windows, 2021.

**[8]** Gabriele De Luca. Why does the cost function of logistic regression have a logarithmic expression?, Jul 2020.

**[9]** Namuk Park and Songkuk Kim. How do vision transformers work?
arXiv preprint arXiv:2202.06709, 2022.

**[10]** Omkar M. Parkhi, Andrea Vedaldi, Andrew Zisserman, and C. V. Jawahar. Cats and dogs. In IEEE Conference on Computer Vision and Pattern Recognition, 2012.

**[11]** Joseph Redmon and Ali Farhadi. Yolov3: An incremental improvement, 2018.

**[12]** Hugo Touvron, Matthieu Cord, Matthijs Douze, Francisco Massa, Alexandre Sablayrolles, and Herv ́e J ́egou. Training data-efficient image transformers & distillation through attention. In International Conference on Machine Learning, pages 10347–10357. PMLR, 2021.

**[13]** Zixiao Zhang, Xiaoqiang Lu, Guojin Cao, Yuting Yang, Licheng Jiao,and Fang Liu. Vit-yolo: Transformer-based yolo for object detection. InProceedings of the IEEE/CVF International Conference on ComputerVision, pages 2799–2808, 2021.

**[14]** Zhun Zhong, Liang Zheng, Guoliang Kang, Shaozi Li, and Yi Yang.Random erasing data augmentation, 2017.