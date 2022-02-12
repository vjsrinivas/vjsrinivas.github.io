---
title: EmojiCam 😒🤫🥳
description: This project was done for fun and was completed within 24-hours. EmojiCam takes in a RGB frame and creates a frame with emojis replacing pixels. It runs in real-time and has a very simple image processing pipeline.
created: '2022-02-12T12:15:49.437Z'
tags: image processing
---
This project was done for fun and was done within 24-hours. EmojiCam takes in a RGB frame and creates a frame with emojis replacing pixels. It runs in real-time and has a very simple image processing pipeline.

<!-- more -->

## Table of Contents
- [Processing Pipeline](#processing-pipeline)
- [Quick Notes About Implementation](#quick-notes-about-implementation)
- [Results](#results)
- [Future](#future)
- [Source](#source)

## Processing Pipeline

<figure>
<img src="post-res/emojicam/emojicamprocesspipeline.png", alt="Image of cache processing for Emojicam"/>
<figcaption><b>Fig. 1</b> - Shows the general process of generating the "emoji mapping", where each color combination is assgined an emoji. To determine the best color-to-emoji match, I find the major colors within each emoji, do a ranking system, match them to the 256x256x256 matrix. Unresolved spaces are filled in with a simple distance calculation. The mapping is saved to file when the camera portion (Fig. 2) is started.</figcaption>
</figure>

<figure>
<img src="post-res/emojicam/emojicamprocesspipeline2.png", alt="Image of pipeline processing for Emojicam"/>
<figcaption><b>Fig. 2</b> - Shows the general process of the actual mapping of emojis to a group of pixels. First, the incoming frame is pixelized to where the pixel box area is equal to the final size of the emoji that will overlay it. A black canvas with equal dimensions to the frame is created. We reference the emoji mapping from Figure 1, load the emoji, and place it in the same location as the given pixelized block (but within the black canvas). "Alpha blending" from the pixelized frame is done to tint the emojis. Refer to the Results section to see the difference between "Alpha blending" and the absence of it. </figcaption>
</figure>

The processing pipeline of EmojiCam consists of a pre-launch process that computes a color-to-emoji mapping and caches this large table for the launch process. The launch process simply consists of pixelizing the image with a filter that represented the predefined size of an emoji. Each block from the pixelization is matched with an emoji from the cached table. The emoji is then masked onto an equally sized black canvas to the same location as the chunk. An alpha blend of the pixelated block is bled into this black canvas for better results.

## Quick Notes About Implementation

**kMeans** - So kMeans is a basic unsupervised clustering algorithm. More simlpy, given a number of cluster points to converge to, the algorithm can independelty sort samples into assignment to one of the clusters. I used the `sklearn` implementation of kMeans, which will not guarentee to return a point for every cluster.

I forced a three cluster ranking per emoji, which means each emoji has three color coordinates (R,G,B) with an associated percentage term that represents how many pixels out of the total pixels went to that cluster. This three-element list is ordered by this percentage term for the ranking system. 

**Ranking System** - You can probably figure out that a 256x256x256 color matrix gets you a color space of **16777216 unique colors**. Unforunately, there are only around 4000 emojis within the Twitter Emoji set. So every emoji will own multiple colors within the matrix. The ranking system starts by scrolling through every emoji, looking at its top-1 color and looking up this color in the matrix.

If the matrix element is empty, then that emoji will be assigned to that element. If there is already another emoji in the element, we compare the percentages between the two, and the larger ratio wins. The losing emoji is placed in the nearest matrix element that isn't occupied (this is non-optimal since neighbors of the conflicting space can have a smaller ratio than the losing emoji). For the leftover spaces, we loop through these spaces and compute the distance from it to all the originally occupied areas. The closest emoji is assigned to the leftover spaces.

## Results

<video autoplay muted loop>
  <source src="post-res/emojicam/test_out-converted.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

**With Alpha-blending**

<video autoplay muted loop>
  <source src="post-res/emojicam/test_out_no_weights-converted.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

**Without Alpha-blending**

<video autoplay muted loop>
  <source src="post-res/emojicam/test_out_stream-converted.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

**Live camera feed with Alpha-blending**

<video autoplay muted loop>
  <source src="post-res/emojicam/test_out_stream_wo_weight-converted.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

**Live camera feed without Alpha-blending**

<br>
<br>

## Future

As mentioned previously, there are areas of improvements. This is mainly for the emoji-mapping algorithm. The main pitfall is how we deal with losing emojis within the ranking system. Having the losing emoji fight other emojis around the initial location for their location would probably yield in better color matching. Alpha blending, in my opinion, is kind of cheating even though the only main metric is visual appeal. I would actually mask the blending to just the opaque areas of the emoji matrix. For clarification, the emojis are in PNG format and have 4 channels (blue, green, red, alpha). This would give a fairer blending to just the emoji, rather than the black canvas.

Finally, this could easily be a filter in an application like Snapchat or Instagram (if it already isn't). I would like to investigate implementing this algorithm on Android and seeing the performance difference, and if it retains its real-time speeds.

## Source

You can find the project here: https://github.com/vjsrinivas/emojicam
