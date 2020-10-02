---
title: Pixelated Art Algorithm
description: Creating a pixelated art piece with an algorithm
created: '2020-01-11T19:45:28.107Z'
tags: art
---

Recently, I have been taking to the habit of saving various art pieces I come across on various websites and social media postings. One of my discoveries was a very unique (at least to me) urban artwork. Its dominate-color-based pixelization and large, abrasive typography really fed into the classic feel of a modern, urban landscape.

This style seemed like a very fun project to replicate algorithmically (you will understand why when you see), so I took a couple of weekends to hash out a long-winded program to replicate the style as close as I possible could.
<!-- more -->

## Table of Contents
- [Introduction](#introduction)
- [Algorithmic Process](#algorithmic-process)
  - [Style Breakdown](#style-breakdown)
  - [Pixelation Method](#pixelation-method)
  - [Text](#text)
- [Results](#results)

# Introduction
I think the best place to start this piece off would be to fully explain the aforementioned art piece I had stumbled upon. Originally, I found this piece on an Instagram account that aggregated brand concepts and designs. Doing a quick five minute Google search to find the actual source of the concept, I discovered that the piece belonged to a "transmedia" visual design team based in Guangzhou, China called Another-Lab. It was also part of a bigger brand identity that focused on "Urban Interaction" (also the name of the whole collection).

Another-Lab discusses the reasoning behind the promotional collection's style; stating that "the city has constructed a massive and complex interactive system for the people within". Displaying data, whether that be text, symbols, or graphics, via different styles of typography is important because it and the people who produce and create this data permeate throughout this system. Furthermore, the pixelization shows the breakdown of the components of a city system and feeds back into how data is distributed throughout.

<figure>
<img src="./post-res/pixel_art/another-design-example-2.jpg" alt="Another-Design Example #1"/>
<figcaption>Fig. 1 - This is an overview of the collection from Another-Lab</figcaption>
</figure>

Very deep stuff, but unfortunately I am not an art critic, so I will leave the rest of this art analysis for someone else to finish. Let's discuss what I was able to create and how it works.

# Algorithmic Process
## Style Breakdown
Before I ever started coding, I wanted to truly understand what the style I was duplicating was actually about. It is obvious that a major component is pixelization, but this pixelization is irregular. Different parts of the image are pixelated at different radiuses, and the colors assigned to those areas often reflected the dominate color of the corresponding area in the original picture. Additionally, text is placed within each of the pixelated areas, with its content usually related to some kind of statistic or fact about the urban environment being presented.

<figure>
<img src="./post-res/pixel_art/another-design-example-1.jpg" alt="Another-Lab Example #2"/>
<figcaption>Fig. 2 - This is a singular example of Another-Lab collection</figcaption>
</figure>

## Pixelation Method
In order to reproduce this style, I broke the process down into major visual milestones:
1. Normal Pixelization
2. Irregular Pixelization
3. Text Application

For the first objective, it was the standard process of taking a `nxn` group of pixels, averaging out the RGB values among that group, and applying that averaged value back to all the pixels within that group. Although there are numerous ways to approach the grouping, I decided I wanted the maximum amount of flexibility in terms of grouping manipulation of pixels. Because of this, I used a [disjoint set](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) data structure to help me organize the groupings.

Producing irregular pixelization was a far more trickier goal. What exactly is irregular pixelization? How do you use the grouping concept from normal pixelization in irregular pixelization? Finally, how do you organize the groupings in an accessible way for later text processing?

The usage of disjoint sets from normal pixelization helps answer most of those previous questions. By creating a system of disjointed layers, I was able to apply different iterations of pixelations to the base image.

The customization of each pixelization layer are determined by **anchors**. In the context of this project, "anchors" are basically points within the disjoint set structure that can then be used to generate degradations. In my case, degradations were in the form of randomized rectangles and anchors were the center coordinates for each random rectangle.

**Interactive diagram of anchor concept (three views: one with finished image; one with the anchor layout & rectangles generated; one with a 3d prespective of the layers being stacked)**

<link rel="stylesheet" href="./post-res/pixel_art/layer_viewer_style.css">
<div id="layer_viewer">
  <div id="slide-color-picker"></div>
</div>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="./post-res/pixel_art/layer_viewer.js"></script>

## Text

The final processing that happens is related to typography. Like I mentioned before, a major component of Another-Lab's design was related to the text interlaced into many of the pixelated regions. Utiltzing the disjoint set, I applied the text with  functionality within OpenCV

``` python
# code of cv2 text application goes here
```

# Results

Here are some examples of the algorithm in action:

![Example of algorithm output]()

![Another example of algorithm output]()

![Final example of algorithm output]()

The source code of this project can be found via the [GitHub Link]()