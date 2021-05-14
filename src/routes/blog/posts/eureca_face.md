---
title: Effects of Degradation on Face Detectors
description: This project was done to complete one of my breadth requirements for the Tickle Engineering Honors program. The contents of the project were presented at the 2021 EUReCA Symposium as a poster. To keep proper context, the project was completed within less than a month and is a continuation of adjacent, prior works regarding image degradation and Convolutional Neural Networks.
created: '2021-05-14T12:15:49.437Z'
tags: machine learning
---

This project was done to complete one of my breadth requirements for the Tickle Engineering Honors program. The contents of the project were presented at the 2021 EUReCA Symposium as a [poster](https://github.com/vjsrinivas/eureca_face/blob/master/post.pdf). To keep proper context, the project was completed within **less than a month** and is a continuation of adjacent, prior works regarding image degradation and Convolutional Neural Networks.

<!-- more -->

## Table of Contents
- [Description](#Description)
- [Abstract](#Abstract)
- [Face Detectors](#face-detectors)
- [Degradation](#Degradation)
- [Recovery](#Recovery)
- [Results](#Results)
- [Running Code](#running-code)

<figure>
<img src="post-res/eureca_face/anim_header_1.gif" width="800" alt="GIF showing animation of an unaltered image, its detection, a degrade image, and a corrected image"/>
</figure>

## Abstract

With the popularization of object detection via convolutional neural networks (CNN), major work has been done with specialized detection tasks, such as using CNNs for facial recognition and detection. Additionally, CNNs have now been deployed in practical settings, where the networks must work with sub-par equipment and operate in non-ideal environments.

In this research project, we look into some of the standard image-based obstacles faced by state-of-the-art face detectors in the real world, such as degraded camera quality and transmission interruptions. With these obstacles, we experiment and quantitatively describe how the CNNs react in these scenarios.

Additionally, we reconstruct the “degraded” image with various image processing methods in order to recover detection accuracy. Furthermore, we quantitatively establish connections between certain recovery methods, their intensity, as well as the intensity of the degradation with the ability to recover the detection accuracy.


## Face Detectors:

<figure>
<img src="post-res/eureca_face/11513D05.jpg" width="800" alt="Example of detection with RetinaFace from the RetinaFace authors"/>
</figure>


- TinaFace (part of VedaDetector)
	
	- **Description:** TinaFace is the SoTA (as of this writing) in terms of realtime face detection on the WIDERFACE testset. The model utilizes recent advancements in general object detection and frames the face detection task as a "small-object" detection task.  

- RetinaFace
	
	- **Description:** RetinaFace is a realtime face detector that was released in late-2019. It utilizes information summarized from a **multi-task objective loss function** in order to improve "small-face" detection. This object detector also was able to produce facial landmarks, and the authors themselves labeled the landmarks within the `train` and `validation` sets of WIDERFACE. The landmarks were also used in the multi-task objective loss function.

- DSFD (Dual-Shot Face Detector)
	
	- **Description:** DSFD was a model created by the Tencent Research Group and features a "Feature Enhancement Module", where feature maps are taken through a portion of the network as the "first shot". While going through each stage of the "first shot", the "Feature Enhancement Module" produces a "second shot". Together, they produce a network that can accurately detect small faces within dense crowds.

	- **Note:** The DSFD used in this project was a optimized version, which was ~9% off the original DSFD WIDERFACE validation score (81% vs 89% on the hard-set). The DSFD network utilizes "better feature learning, progressive loss design, and anchor assign based data augmentation."

### Degradation

<figure>
<img src="post-res/eureca_face/noise_matrix.png" width="800" alt="Diagram showing the effects of each degradation"/>
</figure>


- **Gaussian Noise**

	- **Description:** Commonly occurs in digital photography. For this project, the Gaussian Distribution was varied by adjusting the standard deviation. By adjusting standard deviation, the noise matrix values become higher in the [0-255] color scale. This in turn increases the visibility of noise on the image.

- **Salt & Pepper**

	- **Description:** This type of noise occurs in sharp pulses during image transmission. The variable for this noise is the percentage of the image "covered" with a white or black pixel. The ratio of white to black pixels within the noise distribution is fixed.

- **Poisson**

	- **Description:** This noise occurs within CT & X-Ray scans as a result of stray radiation bombardment. The noise distribution is controlled by the lambda parameter.

- **Gamma**

	- **Description:** This noise is similar to Poisson, but the noise distribution is varied by "gamma shape", and as the gamma shape increases, the image becomes more "white-washed". This is similar to increasing uniform gamma factor, where a higher gamma factor increases the brightness.

### Recovery

<figure>
<img src="post-res/eureca_face/median_demo.png" width="800" alt="Example of recovery methods"/>
</figure>


- **Median Filter:**

	- **Description:** Use a `nxn` kernel (where `n` is a non-zero integer) and slides through image. While sliding, it takes the median value of the pixel values within the kernel and assigns that value to those pixels. This method "smoothens" the image out, and the larger the kernel size, the smoother the image.

- **Histogram Equalization:**

	- **Description:** Plot the frequency of each pixel value (with a histogram) and equalizes those frequencies. This histogram plotting and equalization occurs channel-by-channel basis. In terms of channels, the histogram equalization is applied in the YCbCR color space(Luminance, Chroma Blue, Chroma Red).

**Note:** Both correction methods can have an optimized runtime of <10-20ms, which makes them suitable for real-time corrections.

## Results

The following are graphs showing the decreasing shape of mAP as a given noise's intensity rises.

### Gaussian Blur

<figure>
<img src="post-res/eureca_face/overview_gaussian_noise_graph.png" width="800" alt="mAP Graph of Gaussian Blur on all models"/>
</figure>

### Salt & Pepper

<figure>
<img src="post-res/eureca_face/overview_salt_pepper_graph.png" width="800" alt="mAP Graph of Salt & Pepper on all models"/>
</figure>

### Poisson

<figure>
<img src="post-res/eureca_face/overview_poisson_graph.png" width="800" alt="mAP Graph of Poisson on all models"/>
</figure>

### Gamma

<figure>
<img src="post-res/eureca_face/overview_gamma_graph.png" width="800" alt="mAP Graph of Gamma on all models"/>
</figure>

The following are graphs representing the trend of recovery for each noise intensity of a given noise at a certain level of a correction. Median filter was applied to Salt & Pepper, Gaussian Blur, and Poisson while Histogram Equalization was applied to Gamma alone.

### Retinaface

<figure>
<img src="post-res/eureca_face/overview_median_gaussian_noise_retinaface.png" width="800" alt="Graph showing correction improvements of gaussian noise with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_median_poisson_retinaface.png" width="800" alt="Graph showing correction improvements of poisson noise with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_median_salt_pepper_retinaface.png" width="800" alt="Graph showing correction improvements of salt & pepper with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_he_gamma_retinaface.png" width="800" alt="Graph showing correction improvements of gamma with histogram equalization"/>
</figure>

### DSFD

<figure>
<img src="post-res/eureca_face/overview_median_gaussian_noise_dsfd.png" width="800" alt="Graph showing correction improvements of gaussian noise with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_median_poisson_dsfd.png" width="800" alt="Graph showing correction improvements of poisson noise with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_median_salt_pepper_dsfd.png" width="800" alt="Graph showing correction improvements of salt & pepper with median filter"/>
</figure>

<figure>
<img src="post-res/eureca_face/overview_he_gamma_dsfd.png" width="800" alt="Graph showing correction improvements of gamma with histogram equalization"/>
</figure>

### Tinaface
``Incomplete``


## Conclusions

This project shows the degradation behavior that noises such as Gaussian Blur and Salt & Pepper have on highly-accurate face detectors. Salt & Pepper had an accuracy decrease "shape" resembling an inverted S-curve. I believe this is mainly due to the fact that sharp pixel-wise color changes, such as completely black or white, can have drastic effects on the feature extraction from the first set of convolution layers, which can have a cascading effect later on in the network.

For a similar reason, this is why you see tamer accuracy decrease "shapes" for Poisson and Gamma (although the later half of Gamma had a drastic decrease -- this is because at a certain point the white-washing had removed enough features to the point where the image is basically white to us).

Gaussian noise had a neutral accuracy decrease "shape". I believe the reason for this is because the noise is colored and the distribution of colors at most noise levels are not large enough to drastically affect the original pixel color. Only at higher noise intensities do the values become significant enough for the original color values to significantly shift from their original "domain" of color. With this significant shift, an object's features will be unrecognizable. 

<figure>
<img src="post-res/eureca_face/median_fix_demo.png" width="800" alt="Example of median filter recovering detections from a image at a higher salt & pepper intensity"/>
</figure>

<figure>
<img src="post-res/eureca_face/he_fix_demo.png" width="800" alt="Example of histogram equalization recovering a moderate amount of faces from a very white-washed image"/>
</figure>

**The source code and documentation on how to set up this project is located [here](https://github.com/vjsrinivas/eureca_face)**