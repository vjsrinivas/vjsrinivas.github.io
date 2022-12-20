---
title: Revisiting EmojiCam
description: Earlier this year, I created an image filter that replaced blocks of an image with emojis. In this post, I revisit some of the weakness of that code.
created: '2022-12-20T20:50:28.107Z'
tags: image processing | wip
art_credit: Stable Diffusion (Huggingface)
---
In this blog post, I revisit my EmojiCam project and try to rectify some of the major pitfalls the original algorithm had. This rectified version of EmojiCam includes multiscale emojis and better emoji color calibration.
<!-- more -->

## Table of Contents
- [Old Processing Pipeline](#old-processing-pipeline)
- [Issues](#issues)
- [Rectifications](#rectify)
- [Results](#results)

## Old Processing Pipeline

The original processing pipeline for EmojiCam consisted of an algorithm that calibrated all emojis to a given color in 8-bit RGB space. This algorithm took the non-transparent areas of a given emoji and calculated the most significant colors.

The significance of a color was computed by doing supervised kMeans clustering with a k value of 3. Then, an RGB matrix with a shape of 256 x 256 x 256 is created and indexed with each of the significant colors being indices into the matrix. Each element in the matrix is an index representing an emoji.

This matrix is useful for determining the emoji to use in a given area. It is also very fast since the matrix is a giant look up table.

After this step, EmojiCam creates a blank canvas that will have the emojis applied onto. During the main execution, a given image or video frame are pixelated, where width and height are divided by 24. This means that each emoji is going to be 24x24 pixels in size. Then, we look at each pixel value in the pixelated image, access the emoji index from the RGB matrix, and reproject the location of the pixel in the pixelated image back to the full-sized image. After the location is calculated, the emoji data is applied onto the canvas.

To improve the aesthetic, I apply a weighted overlay of the pixelated image (resized to original image size) on to the canvas. I call this alpha-blending (very fancy). You can check the previous post to see how impactful alpha-blending was to the ultimate output. The overall process is also visualized in Figure 1.

<figure>
<img src="post-res/emojicamv2/emojicamprocesspipeline.png", alt=""/>
<figcaption><b>Fig. 1</b> - Overall diagram of the old EmojiCam processing pipeline. The emojis are processed with kMeans to calculate predominant colors and store them into the RGB matrix. Afterwards, we can cache the matrix and use it for a O(1) lookup and apply an emoji onto a certain area of the image.</figcaption>
</figure>

## Issues

With the old processing pipeline from EmojiCam laid out, this section will discuss the pitfalls of this method.

The first notable issue is the poor color calibration between emojis to a given color in the source image. The old method used the full 256, 8-bit RGB color space. This means there are 16,777,216 colors to map all the Twitter Emojis to. This results in a **huge** matrix file (~1 GB) and a very sparse matrix as well.

Additionally, using the kMeans algorithm caused unexpected results since initial location of the mean points are randomized and group colors together in an improper way. The clustering algorithm also fails to consider the consolidation of minor color swatches in complex emojis into a cluster that is a misrepresentation of the emoji's true color distribution.

An example of this calibration error is the video below. The emojis are assigned to other colors in a nonsensical nature. In turn, the output looks really bad. The only thing holding EmojiCam together aesthetically is the alpha-blending.

<video autoplay muted loop>
  <source src="post-res/emojicamv2/test_out.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


## Rectifications

### New Calibration
So, how do we fix/improve the issues from the previous section? For the RGB matrix issue, I downsample the possible number of colors from 256 to 128.

I approach emoji calibration from a simpler perspective. Firstly, I will not use all the available emojis since some of them are incredibly complex in terms of color distribution and canvas composition. In order to narrow the number of useful emojis, I removed KMeans and simply calculated the number of unique colors (excluding the transparent areas).

For a given emoji, I filter out the unique values with a percentile threshold. Additionally, I also filter emojis with a transparent ratio that is less than 30%. Finally, I classify emojis as "simple" if the most frequent unique color value has a percentage over 85%. All of this filter ensured that the emojis used were simple and have enough color expression to match almost all typical color swatches.

### Multiscale Emojis

Another improvement I implement is the ability for emojis to be different sizes. This can enable the output to look more artistic rather than just a slightly more interesting version of standard pixelization. But how do we algorithmically implement multiscale emojis and how do we decide to use which emoji scale?

In terms of multiscale, I just work with two scales - 24x24 and 48x48. A third 96x96 scale emoji was tried but the results did not look aesthetically pleasing. In terms of where to put the 48x48 scaled emojis, I utilize Discrete Cosine Transform (DCT). DCT generates information regarding an image's "frequency" and is typically used in image compression algorithms like JPEG and WebP. These algorithms take advantage of the fact that human eyes cannot distinguish high frequency components very well (example in the figure below). By removing high frequency components via quantization, the compression algorithms can reduce file size while preserving image quality.

I use DCT in order to determine where the low frequency components were. Technically, I convert the RGB image into a YCrCb format, and I apply an 8x8 DCT across the Luminance (Y) channel only. Filtering out only low frequencies was done by taking only the top-left triangle of a given DCT block. Then I sum up the absolute value of each DCT block into a single scalar value in a separate DCT matrix. Then I determine the viable positions by calculating the 80th percentile of all DCT values.

<figure>
<img src="post-res/emojicamv2/example_forest.png", alt=""/>
<img src="post-res/emojicamv2/dct_high_freq_example.png", alt=""/>
<img src="post-res/emojicamv2/dct_low_freq_example.png", alt=""/>
<figcaption><b>Fig. 2</b> - An example of high frequency and low frequency components generated by DCT. Each DCT block (in this case a 8x8 pixel block) contains a matrix that represent frequencies. <a href="https://www.researchgate.net/figure/DCT-blocks-Where-FL-Low-frequencies-FM-mid-frequencies-FH-High-frequencies_fig3_259763663">Here is a good diagram of how the frequencies are aligned in each block</a>.</figcaption>
</figure>

<figure>
<img src="post-res/emojicamv2/example_percentile_mask.png", alt=""/>
<figcaption><b>Fig. 3</b> - Example of a position mask of DCT by computing a certain percentile. Using low frequency components means we can increase the scale of emojis only in less detailed parts of the image.</figcaption>
</figure>

## Results

Did those rectifications do any good? Well, let's see the following comparison:

<figure>
<img src="post-res/emojicamv2/out_forest.jpg", alt="", style="margin-bottom:5px"/>
<img src="post-res/emojicamv2/out_forest.jpg.png", alt="", style="margin-bottom:5px"/>
<img src="post-res/emojicamv2/forest.jpg", alt=""/>
<figcaption><b>Fig. 4</b> - An example of a woodland scene is used. The first image is the original method's output. The image below it is the new method's output. It is clear that the color and emoji selection is much better on the new method. Additionally, the multiscale method works fairly well by choosing relatively non-intrusive areas to upscale to 48x48.</figcaption>
</figure>

<figure>
<video autoplay muted loop>
  <source src="post-res/emojicamv2/test_out-converted.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video autoplay muted loop>
  <source src="post-res/emojicamv2/out_test.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video autoplay muted loop>
  <source src="post-res/emojicamv2/test.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<figcaption><b>Fig. 5</b> - Another example applied to a video. We see very similar results to the image-based example. The newer method produces better results and utilizes the larger scaled emojis effectively.</figcaption>
</figure>

So what is next? Unfortunately, the addition of DCT and multiscale emojis make this method slow. It runs less than 1 FPS on a mid-range CPU (AMD Ryzen 2700X). I want to optimize the DCT method I'm using and find a better way of rendering the final output. Also, I need to clean up the code. Maybe by 2024.
