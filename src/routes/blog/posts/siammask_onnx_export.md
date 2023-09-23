---
title: SiamMask ONNX Export Journey
description: Blog post going over exporting one kind of SiamMask model into ONNX
created: '2023-09-11T10:20:28.107Z'
tags: machine learning
---
During my masters thesis, I worked on different multiple object tracking (MOT) methods. There is another type of tracking method, single object tracking (SOT), that I always interested in but never got the chance to try. One such SOT method is called SiamMask, and this blog post will go over how I exported this network to ONNX.

<!-- more -->


# Single Object Tracking Overview


Single Object Tracking (SOT) is a pretty straight-forward task. A defined ROI is given to the SOT method, and the method attempts to propogate the location of the object within the defined ROI for the next __n__ frames. Typically, SOT ROIs are bounding boxes (similar to MOT), but SOT can be extended to other localization types, such as segmentation masks or poses. With the advances in Deep Learning, SOT methods have increasingly relied on deep neural networks in order to derive useful features and information from task-aligned frames.


<figure>
<img src="./post-res/siammask_onnx_export/sot_example.png", alt="Example of different Single Object Tracking tasks - Taken from Do Different Tracking Tasks Require Different Appearance Models? by Wang et. al", style="margin-right:auto; margin-left:auto; max-width:400px"/>
<figcaption><b>Fig. 1</b> - An example of different Single Object Tracking sub-tasks. Taken from <a href="https://arxiv.org/pdf/2107.02156.pdf">here</a> </figcaption>
</figure>


# SiamMask Paper Overview


SiamMask mainly follows in the footsteps of two different Siamese-based SOT methods: SiamFC and SiamRPN. SiamFC was one of the first real-time Siamese-based SOT methods and follows a very simple system for generating bounding boxes. A feature extraction network (ex: ResNet, MobileNet, etc.) takes in the user-defined RoI (typically called the "exemplar" input) and generates a feature map that can be used in the preceding frames (typically called "search" inputs). **The exemplar input is also often smaller than the search inputs** as to conserve speed and reduce features to their most important aspects. When SiamFC ingests a search input, it takes a cross-correlation between the search and the exemplar input. This cross-correlation generates a feature map that can be used to generate bounding boxes at each spatial location. **The output of the cross-correlation operation is also referred to as the "Response of a Candidate Window" (RoW).** SiamFC's main loss objective was logistic regression.


<figure>
<img src="./post-res/siammask_onnx_export/siamfc_diagram.png", alt="Diagram of general network flow from original SiamFC paper", style="margin-right:auto; margin-left:auto; max-width:700px"/>
<figcaption><b>Fig. 2</b> - Network flow of SiamFC showing how the subject in the search input can be correlated in the final feature map. Taken from <a href="https://arxiv.org/pdf/1606.09549.pdf">here</a> </figcaption>
</figure>


SiamRPN extends SiamFC by incorporating a traditional **Regional Proposal Network (RPN) to help guide the RoW and generate more descriptive features.** In implementation, the RPN actually generates two different RoWs for their respective prediction branches (bounding box regression prediction and classification prediction). Each channel within the bounding box-related RoW encodes RPN data (anchors and bounding box confidence score). This robustifies not only the bounding boxes but also the implicit similarity matching. SiamRPN trains with L1 smooth loss (bounding box) and cross-entropy loss (classification score).


<figure>
<img src="./post-res/siammask_onnx_export/siamrpn_diagram.png", alt="Diagram of general network flow from original SiamRPN paper", style="margin-right:auto; margin-left:auto; max-width:900px"/>
<figcaption><b>Fig. 3</b> - Network flow of SiamRPN showing the RPN and two branch approach to assist with bounding box prediction. Taken from <a href="https://openaccess.thecvf.com/content_cvpr_2018/papers/Li_High_Performance_Visual_CVPR_2018_paper.pdf">here</a> </figcaption>
</figure>


Finally, SiamMask considers utilizing **segmentation as an additional method in increasing the descriptiveness of the RoW features** but without a computationally expensive RPN. RoW generation occurs similar to SiamFC, but instead of cross correlation, SiamMask utilizes depth-wise (channel-wise) correlation. Like SiamRPN, prediction outputs are separated into their respective branches. SiamMask has "bounding box", "segmentation", and "score" branches with their own shallow sub-networks. SiamMask trains with a multi-objective loss function that combines SiamRPN's L1 smooth (bounding box branch) and cross-entropy loss (score branch) with binary logistic regression (segmentation branch). Each part of the multi-objective loss function is weighted by a scalar lambda. The paper mentions that they just guessed some good numbers, where the mask lambda was 32 and the other lambdas were 1. SiamMask also comes in a two-branch variant, where the bounding box branch is removed.


<figure>
<img src="./post-res/siammask_onnx_export/siammask_diagram.jpeg", alt="Diagram showing the network flow of SiamMask (taken from original paper)", style="margin-right:auto; margin-left:auto; max-width:700px"/>
<figcaption><b>Fig. 4</b> - Network flow of SiamMask showing a three-branched approach with a focus on the segmentation output. Taken from <a href="https://arxiv.org/pdf/1812.05050.pdf">here</a> </figcaption>
</figure>


# ONNX Process

<mark>
Here is the isolated code for exporting SiamMask as an ONNX model: <a href=https://github.com/vjsrinivas/siammask_onnx>Link</a>
</mark>

**Please note that this only allows for the default VOT configuration with the Mask Refinement module.** You can probably adapt this process to work for other versions of SiamMask.

Here is the bullet point summary of my PyTorch to ONNX process:

* I utilize the PyTorch `torch.onnx.export` function but, because of the conditional nature of the network, have to recreate the PyTorch model with Torchscript
    * This means rewriting some of the code to remove most, if not all, Python primitives
    * With a Torchscript model, we are "scripting" (transcompiling into C) rather than the traditional "tracing" (JIT-based) method
* During the first frame (n = 0), there is an initialization function that takes in the downsampled input and processes it through the feature extractor
    * Some unnotable preprocessing specifically for the n=0 state (this is NOT included in the ONNX model and is assumed to be done outside of the model)
* For proceeding frames (n > 0), we forward through the entirety of the network (feature extractor, segmentation branch, bounding box branch, and refinement module) and produce a mask.
    * Some additional post-processing steps to reproject the mask from the input (254x254) to the original image
* Because of the conditional nature of the network, we need to take advantage of the `If` ONNX operator, which will allow us to switch between the n=0 and n>0 states within ONNX
    * To make this model more robust to other inference engines (ex: TensorRT), we need to ensure that the output and input shapes and datatypes are the same among both conditional branches
    * The above point comes into conflict with the original PyTorch implementation, where the n=0 state has a 127x127 input
    * I work around this by requiring both branches have an input of 254x254, but in n=0 pre-processing, I create a blank image and fill the upper quadrant with the 127x127 input. In the n=0 state, ONNX will trim that 254x254 image input into 127x127
* The return package of the model is counter-intuitive, but here is a rundown of them:
    * Feature maps from the n=0 state
        * It needs to be used repeatedly in n>0 states to satisfy the identical return requirement
    * Deltas
        * Not used in n=0 but used in n>0 for propogating the ROI for each frame in n>0 states
    * Center position of bounding box
        * Used in calculation of every new propagation
    * Size of Bounding Box
        * Used in calculation of every new propagation
    * Mask
        * Self explainatory (a zero matrix for n=0 state)

## Result Examples

<video controls muted loop autoplay>
  <source src="./post-res/siammask_onnx_export/car_example-converted.mp4" type="video/mp4">
</video>

<video controls muted loop autoplay>
  <source src="./post-res/siammask_onnx_export/tennis_example-converted.mp4" type="video/mp4">
</video>
