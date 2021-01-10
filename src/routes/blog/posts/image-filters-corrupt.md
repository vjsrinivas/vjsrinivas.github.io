---
title: Video Corruption Filter
description: This article is the 2nd article that is part of a larger thread (refer to image-filters.md)
created: '1999-02-28T19:45:28.107Z'
tags: art|topic
---
<link rel='stylesheet' href='post-res/image-filters-corrupt/style.css'>

## Table of Contents
- [Introduction](#introduction)
  - [What is Glitch Art](#what-is-glitch-art)
- [Corruption Method](#corruption-method)
  - [Utilizing Class Activation Map](#utilizing-class-activation-map)
  - [Utilizing Reinforcement Learning](#utilizing-reinforcement-learning)
    - [Overview of Q-Learning](#overview-of-q-learning)
    - [Implementing Q-Learning](#implementing-q-learning)
  - [Image Manipulation](#image-manipulation)
- [Results](#results)
- [Caveats](#caveats)
- [Notes](#notes)

# Introduction

## What is Glitch Art
With transferring, encoding, and processing electronic data, there has always been the issue of contending with data degradation. There are many methodologies in place to prevent and/or recover said corrupted data, but what is far more interesting to me is the intentional use of corruption on different kinds of mediums to produce something completely new. With corrupting visual mediums, this is usually referred to as **glitch art**.

Referring to a great article written by [Daniel Temkin in The Journal of Objectless Art](https://nooart.org/post/73353953758/temkin-glitchhumancomputerinteraction), glitch art "mythologizes computer errors as its ultimate muse and tool". It utilizes the fact that the representation of data is neither "good" nor "bad" to the computer. Rather, Temkin asserts that "the data is 'bad' only to us [when] we have an expectation of representational imagery". With this divide between algorithmic data-processing and human abstraction, there lies the central components of glitch art aesthetic. Another important point that Temkin makes is that glitch art exists in a space between an unpredictable glitchable "method" (take for example traditional [datamoshing](http://datamoshing.com/2016/06/26/how-to-datamosh-videos/)) and a highly-controlled image processing technique (for example the Sepia Instagram filter).

With the semantics of glitch art laid out for us, this post attempts to create a new method of corrupting images based on Temkin's aforementioned glitch art "space".

<figure>
<img src="post-res/image-filters-corrupt/bill_gates_example1.jpeg" width="500" alt="Image shown"/>
<figcaption><b>Fig. 1</b> - This is an example of glitch art applied to a single image. Credit to <a href="https://twitter.com/GlitchArtBot/status/1296534754494484486">"Glitch Art Bot"</a> on Twitter</figcaption>
</figure>

<figure>
<video style="display:block; margin: 0 auto;" autoplay muted loop height="500">
    <source src="post-res/image-filters-corrupt/corrupt_1_video.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<figcaption><b>Fig. 2</b> - This is an example of glitch art (or specifically datamoshing) applied progressively to a video. Credit to JYP Entertainment's music video of <a href="https://www.youtube.com/watch?v=kOHB85vDuow">FANCY</a> by TWICE.</figcaption>
</figure>

# Corruption Method

To create this new corruption method, the method must first be controllable to an extent by the end-user whilst retaining a recognizable glitch art "aesthetic" by being unpredictable in the corruption techniques and localization.

In the case of predictability for the end-user, the method that was ultimately created allows for "layering" corruption methods on top of each other, as well as adjusting parameters related to the frequency of the corruption technique.

In terms of unpredictability, I utilize Convolutional Neural Networks (CNNs) to be able to take into account the composition of the image and generate an array of "agents", which conduct the actual degradation of certain parts of an image or frame. I associate CNNs with unpredictability because of the fact that they can, at times, utilize features from images that we do not necessarily identify or find useful. Because of this, the image composition projected by the CNN-related mechanism is not something always anticipated by humans. Additionally, the mechanism behind the "agents" feed from the output of the CNN in order to find their own "path" through an image.

<figure>
<img src="post-res/image-filters-corrupt/corruption_diagram_1.png" width="700" alt="Image shown"/>
<img src="post-res/image-filters-corrupt/corruption_diagram_2.png" width="700" alt="Image shown"/>
<figcaption><b>Fig. 3</b> - Generalized structure of the method is split into two main section - "training" and "application". The training section consists of a Q-Learning algorithm to generate a state-action table. Q-Learning requires a reward space, action space, and environment. The environment was limited to a simple grid, and the action space was created by combining directional actions with a set of image manipulation techniques. The reward space was created by utilizing Class Activation Map (CAM) on ResNet18 to generate an activation map. With the activation map and post-processing noise for reward differentiation, I was able to run the Q-Learning algorithm to produce a state-action table. In the application section, I generate a random assortment of agents in different positions across an image and filtered them with a CAM-based mask. Then, the agents follow the policy and implement the image manipulation function. The agents are limited to a variable lifespan (initially set at 20).</figcaption>
</figure>

## Utilizing Class Activation Map

In this context, finding the composition of a given picture or frame was defined as the main subjects and object within an image. Based on this, the composition of an image is generated from a method called _Class Activation Map_ (CAM). This method was first defined by ["Learning Deep Features for Discriminative Localization"](http://cnnlocalization.csail.mit.edu/Zhou_Learning_Deep_Features_CVPR_2016_paper.pdf) by Zhou et. al and aims to visualize the activations of a given network in order to do tasks such as weakly-supervised object localization (or detection). In summary, the activations can be generated by taking the feature maps from the last convolutional layer within the original network. The weighted sum of these feature maps are used to generate a final activation map output. Additionally, these weights are computed based on the parameter values of a softmax layer.

<figure>
<img src="post-res/image-filters-corrupt/class_map_activation_diagram.png" width="700" alt="Image shown"/>
<figcaption><b>Fig. 4</b> - This is a diagram that represents the overall process regarding class activation mapping. Credit to the <a href="http://cnnlocalization.csail.mit.edu/Zhou_Learning_Deep_Features_CVPR_2016_paper.pdf">original paper</a> for this diagram.</figcaption>
</figure>

I implemented CAM with **ResNet18**, the slimmer sibling of a popular CNN feature extractor called ResNet50, because I wanted a coarser output for my activation map. The implementation details will be in the `CAM.py` python file, but I closely followed the original paper's code. Although, there are some exceptions to this as I changed the preprocessing to include "padding" of the input image in order to preserve the aspect ratio as well as other small modifications to streamline and update the code to PyTorch 1.17. The end result was an activation map that showed the areas that the neural network used to identify a given class or category. The method defined in Figure 3 ultimately used this activation map to help implement a reinforcement learning method for the actual degradation.

## Utilizing Reinforcement Learning

### Overview of Q-Learning

Referring back Temkin, there must be a level of randomness and unpredictability when it comes to glitch art. Another important type of unpredictability in this context would be the "self-autonomy" of the computer in deciding what occurs within certain areas of the image. Although computers do not possess true "self-autonomy", I can use the activation map output from the CAM section in order to provide a type of input disconnect between the computer and the end-user. That is to say, even though we have some control over how the computer will conduct itself on the image, it will be "figuring out" the actual degradation.

This idea is implemented with reinforcement learning, which is a method of training an agent in a given environment in order to maximize and increase the efficiency for some type of goal. The agent can be described as an entity that can take an action and store its current state(s) from the environment. The training method can occur via many different types of methods, but the main cycle of interaction occurs as the following:

- The agent takes an acceptable action within the environment
- The environment sets a new state for the agent and hands a form of a reward to the agent
- The agent updates its internal method of determining its actions with the environment feedback

With this cycle, the hope is to have the agent converge to the optimal action given the state it is in. In terms of this project, the reinforcement learning problem is a simple [Grid World](https://towardsdatascience.com/reinforcement-learning-implement-grid-world-from-scratch-c5963765ebff) problem where the agent needs to find the optimal path out of the image and/or maximize its reward while in the environment.

With a general idea behind reinforcement learning established, let's discuss the method that I used to help the agents in my reinforcement learning problem determine its set of optimal actions. The algorithm used is vanilla Q-Learning, which consists of the agent taking the maximum value of all of the possible actions within a given state. In theory, the values associated to each action within a state should correlate with their relative positive or negative impact on the agent's returns.

This aforementioned "value" assigned to each state-action pair is determined during the "training" portion of Q-Learning, where an agent runs through multiple episodes (which are series of action, reward, new state tuples created by the agent-environment interaction until the agent reaches a terminal state). During each step of the episode, the Q-Learning algorithm updates the value of a given state-action pair based on the reward given by being in that state. With the state-action table being updated at every episode iteration, there will be a convergence to where the action with the largest value at a given state will yield the highest reward.

<figure>
<img src="post-res/image-filters-corrupt/q-learning.png" width="800px" alt="Image shows the algorithm behind the training portion of Q-Learning."/>
<figcaption><b>Fig. 5</b> - This is the algorithm for generating a state-action table (denoted as $Q(s,a)$) with Q-learning. $\alpha$ and $\gamma$ can be considered hyperparameters, with the former representing the learning rate and the latter representing the <a href="https://stats.stackexchange.com/a/221472">discount factor</a></figcaption>
</figure>

### Implementing Q-Learning

For my environment, using a tabular Q-learning method will require creating a state-action table that is $m \times n \times a$, where $m$ is the height of the grid, $n$ is the width of the grid, and $a$ is the number of actions in the action space. The action space was created by taking the standard movement actions (up, down, etc.) and enumerating it with a list of image manipulation methods (pixel averaging, desaturation, inverted colors, etc.). For the reward space, I took the activation map generated in the CAM section, invert the values (sometimes), and create an array that is the length of $a$ to correspond with the action space. Additionally, each element in the reward space was summed with a gaussian noise matrix and processed with a median filter to differentiate themselves from the other reward elements. This also allowed the end-user to control the importance of an image-manipulation action by decreasing and increasing the noise distribution parameters on a given method. Finally, the policy derived from the initial "training" portion of Q-learning was a simple $\epsilon$-greedy policy, where there was an $\epsilon$ percent chance of a random action happening and $1-\epsilon$ percent chance of the current optimal action happening. This is done to promote exploration, which is **key** for the first set of iterations. If the policy was only greedy (aka just taking the action associated with maximum value within a given state), it would, in most cases, not yield a true optimal convergence.

<figure>
<img src="post-res/image-filters-corrupt/q_learn_chart_example1.png" width="800" alt="Image shows the algorithm behind the training portion of Q-Learning."/>
<figcaption><b>Fig. 6</b> - To illustrate how well a certain configuration of the Q-Learning algorithm is faring, I graphed the "raw" returns per iteration and the running average of returns per iteration. In this example, you can see there's an initial, sharp learning period followed by a plateau, which can indicate that the state-action table has reached near optimality.</figcaption>
</figure>

As for the grid itself, it does not have to correspond directly with the height and width of the input image or frame. Rather, the grid must maintain a dimension that's ratio is equal to or greater than the image's ratio. The reasoning is based on the fact that image ratios vary widely and having to match a grid ratio with the image ratio would severely limit the level of artistic control. Additionally, if the grid's ratio was larger than the image's ratio, the reward space elements could simply be resized with the image ratio and padded with a prohibitory reward value to later fit the grid dimensions. With this prohibitory value, the agents can simply ignore the areas in the grid that do not correspond with the image.

<figure>
<img src="post-res/image-filters-corrupt/reward_space_example.png" width="800" alt="quick illustration of the reward space containing padding that is filled with 'prohibitory' reward values"/>
<figcaption><b>Fig. 7</b> - This is a quick illustration of the reward space containing padding that is filled with "prohibitory" reward values (in other words, making sure the padding values are the absolute minima in the matrices)</figcaption>
</figure>

## Image Manipulation

In the previous section, I discussed image manipulation methods as a factor in the creation of the action space. This section will discuss the details of the image manipulation methods.

The most basic type of image-based corrupt is the "artifact", which is where image format algorithms (JPEG, PNG, etc.) force the reduction of an image's size by simplifying the range of color values within a **block** of the image. As the quality decreases, these blocking artifacts become more and more noticable as the average color range in a given block removes enough visual features from that block.

In a similar vein, I adopted a simple pixelization method (color averaging in a given block of an image corresponding to a space in the grid) as my first image manipulation method. Although, I realized quickly that pixelization can really only be applied effectively in situations where the grid is quite big (i.e. when the block size is quite small). This is because larger pixelizations do not aesthetically match the type of glitch art presented in the introduction.

Another type of image manipulation used was desaturation. There are many types of desaturation methods, but the one I used was based on the luminance ( $0.3(r) + 0.59(g) + 0.11(b)$ ). Similar to pixelization, desaturation was reserved for specific grid block sizes, but unlike pixelization, desaturation was mostly unnoticable in smaller grid blocks unless the image had high saturation. Because of this, desaturation was used more frequently in grids with larger blocks. 

Finally, there are two more image manipulation methods called "invert" and "random". The former is simply the inverted color of a grid block after it has been run through pixelization. The inversion is done via $|\text{COLOR_CHANNEL}-255|$. "Random" is simply a randomized color assigned to the grid block after pixelization. Both of these methods are utilized in the same way pixelization is used (i.e. in grids with small block sizes).

# Results

Here are some results utilizing the method described in Figure 4.

<figure>
<video style="display:block; margin: 0 auto;" autoplay muted loop width="260px">
  <source src="post-res/image-filters-corrupt/example1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<figcaption>
  <table class="layer-setup" style="margin: 0 auto; width: 260px">
    <tr>
      <th>Layer</th>
      <th>Size</th>
      <th>Iterations</th>
    </tr>
    <tr class="tbody"><td>1</td><td>(20,10)</td><td>10,000</td></tr>
    <tr class="tbody"><td>2</td><td>(40,20)</td><td>100,000</td></tr>
    <tr class="tbody"><td>3</td><td>(200,100)</td><td>10,000</td></tr>
    <tr>
      <th>Agents</th>
      <th>Preserve</th>
      <th>Repeat Agents</th>
    </tr>
    <tr class="tbody"><td>200</td><td>False</td><td>True</td></tr>
    <tr class="tbody"><td>800</td><td>True</td><td>False</td></tr>
    <tr class="tbody"><td>20,000</td><td>True</td><td>False</td></tr>
  </table>
  </figcaption>
</figure>

<figure>
<img style="display:block; margin: 0 auto;" src="post-res/image-filters-corrupt/test2_output.png" width="260px"/>
<figcaption>
    <table class="layer-setup" style="margin: 0 auto; width: 260px">
      <tr>
        <th>Layer</th>
        <th>Size</th>
        <th>Iterations</th>
      </tr>
      <tr class="tbody"><td>1</td><td>(200,100)</td><td>10,000</td></tr>
      <tr>
        <th>Agents</th>
        <th>Preserve</th>
        <th>Repeat Agents</th>
      </tr>
      <tr class="tbody"><td>10000</td><td>N/A</td><td>False</td></tr>
    </table>
  </figcaption>
</figure>

<figure>
<video autoplay muted loop width="260px" style="display:block; margin: 0 auto;" >
        <source src="post-res/image-filters-corrupt/example2.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
<figcaption>
<table class="layer-setup" style="margin: 0 auto; width: 260px">
        <tr>
          <th>Layer</th>
          <th>Size</th>
          <th>Iterations</th>
        </tr>
          <tr class="tbody"><td>1</td><td>(200,100)</td><td>10,000</td></tr>
          <tr class="tbody"><td>2</td><td>(40,20)</td><td>100,000</td></tr>
          <tr class="tbody"><td>3</td><td>(200,100)</td><td>10,000</td></tr>
        <tr>
          <th>Agents</th>
          <th>Preserve</th>
          <th>Repeat Agents</th>
        </tr>
        <tr class="tbody"><td>20,000</td><td>False</td><td>False</td></tr>
        <tr class="tbody"><td>800</td><td>True</td><td>False</td></tr>
        <tr class="tbody"><td>20,000</td><td>True</td><td>False</td></tr>
      </table>
</figcaption>
</figure>

<figure>
<img src="post-res/image-filters-corrupt/test3_output.png" width="260px" style="display:block; margin: 0 auto;"/> 
<figcaption>
  <table class="layer-setup" style="margin: 0 auto; width: 260px">
    <tr>
      <th>Layer</th>
      <th>Size</th>
      <th>Iterations</th>
    </tr>
    <tr class="tbody"><td>1</td><td>(40,20)</td><td>100,000</td></tr>
    <tr class="tbody"><td>2</td><td>(200,100)</td><td>10,000</td></tr>
    <tr>
      <th>Agents</th>
      <th>Preserve</th>
      <th>Repeat Agents</th>
    </tr>
    <tr class="tbody"><td>800</td><td>N/A</td><td>False</td></tr>
    <tr class="tbody"><td>22,730</td><td>N/A</td><td>False</td></tr>
  </table>
</figcaption>
</figure> 

# Caveats
- There is still some issues related to Q-Learning not learning the true optimal path, but it does not seem to effect over aesthetic matching.
- The stochastic nature of the reward space and $\epsilon$-greedy policy of the "training" portion of Q-Learning will lead to slight changes between runs of the same parameters and image.

# Notes

**[1]** - Performance is currently dependent on the number of iterations for the Q-learning, the number of agents, and the lifetime of the agents.

**[2]** - Some performance increases can be increased by storing the Q-tables for that given image/video for quicker editing of the layers.

**[3]** - Source code will be published soon. I still need to clean up the code.

**[4]** - **Sources for images shown in Results section:**
  - [[1st](https://www.pexels.com/video/4903224/) and [3rd](https://www.pexels.com/video/5645774/)] - cottonbro
  - [[2nd](https://www.pexels.com/photo/semi-opened-laptop-computer-turned-on-on-table-2047905/)] - Junior Teixeria 
  - [[4th](https://www.pexels.com/photo/woman-sitting-on-a-sofa-chair-in-a-room-2774197/)] - CREATIVE HUSSAIN