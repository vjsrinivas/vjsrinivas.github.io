---
title: Bling Filter
description: This article is part of a larger thread (refer to image-filters.md)
created: '1999-02-28T19:45:28.107Z'
tags: art|topic
---
<link rel='stylesheet' href='post-res/image-filters-bling/style.css'>

## Table of Contents
- [Style Introduction](#style-introduction)
- [Implementing Specular Detection](#implementing-specular-detection)
  - [Pre-processing](#pre-processing)
  - [Thresholding](#thresholding)
  - [Post-processing](#post-processing)
  - [Caveats](#caveats)
- [Adding "Lens Flares"](#adding-lens-flares)
- [Bloom Effect](#bloom-effect)
- [Results](#results)
- [Notes](#notes)

# Style Introduction

This filter, which I will be referring to as the "bling filter", is a filter I happened to see a lot on TikTok as of recently. Mainly used to stylize a person's face or a scenic view as something out of a late-2000s movie, the bling filter applies cartoonized lens flares and adds a bloom shader to an image.

Although, it is important to note that some TikToks use a custom bling effect that is created with software suites such as Adobe After Effects. These types of TikToks have lens flares that are far more realistic, with the prism color effect on the fringes of each lens flare. For the sake of simplicity, I did not spend my time trying to achieve these kinds of results.

<figure>
<img src="./post-res/image-filters-bling/example1.png" width="300"  alt="Example of simple bling filter"/>
<figcaption><b>Fig. 1</b> - This is an example of the bling filter that can be used in the TikTok app</figcaption>
</figure>

In order to even start an attempt at recreating this filter, I had to first determine the location of where hypothetical lens flares would go. How would I go about doing that? From briefly analyzing some of video clips with this filter, I came to the conclusion that computing regions where there were specularities could be a fair way of determining lens flare positions. 

To go about detecting specularity algorithmically, accurately, and consistently was a daunting task for me at first. But by searching on Google and arxiv, I eventually found a paper by the name of ["Generic and real-time detection of specular reflections in images"](https://ieeexplore.ieee.org/document/7294821). This paper was written by Alexandre Morgand and Mohamed Tamaazousti from the Vision & Content Engineering Laboratory and CEA LIST, respectively.

# Implementing Specular Detection

Morgan and Tamaazousti's paper discusses a method of dynamically creating a threshold for specular detection as well as some pre and post-processing functions that help remove false positives.

## Pre-processing

The pre-processing of an image is intended to reduce noise and equalize any highly-saturated images, which could cause false specular detections or malformed specular masks. With according to the paper, I implemented the following contrast equalization algorithm but inverted the inequalities in both conditionals (`>` instead of `≤`):

```
contrast = 1
if Brightness ≤ Tb then
  while Brightness ≤ Tb do
    contrast <- contrast - 0.01
    Image_pixels = contrast * Image_pixels
    Compute(Brightness)
  end while
end if
```

For reference, the brightness of an image can be computed with the following calculation:

\\[ Brightness =  \sqrt(0.241*(C_R^2)+0.691*(C_G^2) + 0.068*(C_B^2))/(Width * Height)\\]

```
def calculateBrightness(img,w,h):
    # cr, cg, cb = red channel, green channel, blue channel
    # normalizes luminance to 0-1 (Y/width*height)
    rcoef, gcoef, bcoef = 0.241,0.691,0.068
    r,g,b = img[:,:,2], img[:,:,1], img[:,:,0]

    # need to square:
    r = rcoef*(r**2)
    g = gcoef*(g**2)
    b = bcoef*(b**2)
    _out = np.sqrt(r+g+b)/(w*h)
    return np.sum(_out)
```

After this pre-processing is complete, we need to switch from RGB to HSV color space in order to utilize the value and saturation details of the image.

## Thresholding

Thresholding can be basically be described as a process of assigning 0 or 1 (or (0,0,0) and (255,255,255) in RGB space) to each pixel of an image based on a given conditional. For our conditional, it will be determined by the following defined variables:

\\[ T_v = Brightness * k_v \\]
\\[
T_s  = 170
\text{ (estimated by trial and error ) }
\\]

$T_v$ is a threshold based on the intensity with the value channel of the image in HSV color space. The paper defines $T_v$ as the product of Brightness (of the image) and a coefficient called $k_v$, but in reality, to compute $T_v$, we need to use the following linear equation:

\\[ y = 2x \\]

With y being equal to $T_v$ and $x$ being the calculated $Brightness$ of an image. 

After calculating both threshold values, we have to take into account the circumstances when a certain ratio of the image is white and adjust both our threshold values:

\\[ 
\text{ if }
Histogram_{Value}(255) > (Image_{size} / 3)
\\]

\\[
\text{ then }
T_s = 30
\text{ and }
T_v = 245
\\]

Finally, we can apply the following conditionals in our actual thresholding function:

\\[
\text{ if }
S(x) < T_s
\text{ and }
V(x) > T_v
\\]

**Note:** S(x) and V(x) are the saturation and value of **each pixel.**

<figure>
<img src="post-res/image-filters-bling/mask_example.png" alt="Example of thresholding with specular mask on righthand side and original image on the lefthand side"/>
<figcaption><b>Fig. 2</b> - This is an example of an image being processed and producing a specular mask</figcaption>
</figure>

## Post-processing

After the thresholding portion of the code has created a "specular" mask, we must create a method that extracts regions that could be candidates for a lens flare and then find a way of pruning excess candidates.

To create the regions, I utilized the `cv2.findContours` function to find contours within the mask. The function returns a grouping of contours with a hierarchy, but my concern is just the groupings themselves.

The majority of the contours are very small (1x1 or 2x2) in size, so I prune the contour candidates will less than an area of four out. After filtering, I sorted the contours from largest to smallest area and employed the following function to determine a rough estimate of usable contour candidates:

\\[ y = sqrt(2*(x+10))/2 \\]

<figure>
<img width=400 height=400 src="post-res/image-filters-bling/chart.png" alt="Visualization of the equation with x-axis being the amount of contour candidates, y is the pruned candidates"/>
<figcaption><b>Fig. 3</b> - This is a simple visualization of the equation. The x-axis is the amount of contour candidates (the input) and y is the pruned candidates. This equation is simply a sideways parabola with an x-offset</figcaption>
</figure>

Obviously, there is an edge case where the amount of candidates is smaller than the number of pruned candidates, so I simply set the pruned to the original amount.

<figure>
<img src="post-res/image-filters-bling/mask_example_2.png" alt="Visualization of the entire pipeline"/>
<figcaption><b>Fig. 4</b> - This visualization of the entire pipeline of finding the specular regions and computing bounding boxes from these regions</figcaption>
</figure>

This pruning method is incredibly important because too many lens flares can result in an very unaesthetically pleasing result.

<figure>

<video autoplay muted loop>
  <source src="post-res/image-filters-bling/airplane_final_without_gaussian_blur.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video autoplay muted loop>
  <source src="post-res/image-filters-bling/airplane_try_1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<figcaption><b>Fig. 5</b> - The top video clip is with the aforementioned pruning equation, while the bottom clip is simply a linear cutoff (example: take top 30 candidates).</figcaption>
</figure>

## Caveats

There is one major issue with my implementation of Morgan and Tammazoousti's paper. I did not fully implement the k-region based segementation with (Suziki and Satoshi, 1985) algorithm. This piece of post-processing would reduce the overall specular false positives (refer to the figure below for an example), but there are two main reasons as to why this post-processing function was not implemented.

The first, and more important reason, was that the results produced without post-processing functioned well-enough and created a level of "aesthetically-satisfying" results that it was deemed unnecessary to continue refining specular detection. The other reason is that the re-implementation of the segmentation algorithm would not have fit the timeline for this project.

<figure>
<img src="post-res/image-filters-bling/example_gradient.png" alt="Visualization of the gradient fix"/>
<figcaption><b>Fig. 6</b> - The image on the left is the specular mask without the segmentation that was detailed in the paper; the image in the center is with the method; the image to the right is the original input image. These images were taken from the original paper.</figcaption>
</figure>

There is another caveat that is not directly related to Morgan and Tammazoousti's algorithm. It is the fact that the utilization of this algorithm (in whatever form) makes this bling filter far more "strict" in applying lens flare to an image than the TikTok bling filter. You will be in environments where there is not necessarily any specular areas, but the TikTok bling filter will pick an object's edge and apply a lens flare. I believe this kind of scenario is much harder to replicate in my filter program.

# Adding "Lens Flares"

After generating the specular bounding boxes, the next step is to generate lens flares that are blended into the image and vary in terms of size.

<figure>
<img src="post-res/image-filters-bling/flare_template.png" alt="Example of lens filter"/>
<figcaption><b>Fig. 7</b> - This is an example of the lens flare template used in the algorithm. It is broken into its RGB channels to be in used in a 1-D mask</figcaption>
</figure>

We can calculate the center position of the list of bounding boxes which will be used to generate a larger region of interest (RoI). This RoI is what will be used to determine the sizing of a lens flare. The lens flare template is used as a mask. Its complexity must be reduced from three dimensions to one, but if you already have a separable image format based on color channels, you can simply craft three unique lens flares on each channel. This is the reason why the image in the figure above has a color tinge on the border.

A lens flare mask is randomly chosen, resized to fit inside a given RoI, and then, with a color selected, the mask itself is used in a manual blending of the RoI and the chosen color. The blending is very similar to `cv2.addWeighted`'s formula (`dst = src1*alpha + src2*beta + gamma`). 

Additionally, I computed the average hue in the given RoI and set the value very high to get a whited-out version of the average hue. Substituting that color for the aforementioned initial color can give the lens flares some tinged edges, but I have learned through testing that this effect is almost unnoticeable in video format due to compression.  

# Bloom Effect

The last post-processing method for the bling filter is the bloom shader effect. This shader effect can be described as adding "haze" to an image, but not in a way that is uniform, like straight Gaussian Blur can to an image. I borrowed the bloom shader code from this article by [ProgrammerSought](https://programmersought.com/article/20244091636/). The algorithm applies a simple Gaussian Blur on a copy instance of the image. Afterwards, it loops through the original image and applies this equation $(x+y)-(x*y/255)$, where $x$ is the pixel value from the **original** image and $y$ is the pixel value from the **gaussian blur** image. This formula will increase the image's brightness and blends the smoothness of the gaussian blur with the edges of the original image.

```
gauss_img = cv2.GaussianBlur(img.copy(), (5,5), sigmaX=5, sigmaY=5).astype(np.float64)
for x in range(len(gauss_img)):
  for y in range(len(gauss_img[x])):
    gauss_img[x][y][0] = img[x][y][0]+gauss_img[x][y][0]-img[x][y][0]*gauss_img[x][y][0]/255
    gauss_img[x][y][1] = img[x][y][1]+gauss_img[x][y][1]-img[x][y][1]*gauss_img[x][y][1]/255
    gauss_img[x][y][2] = img[x][y][2]+gauss_img[x][y][2]-img[x][y][2]*gauss_img[x][y][2]/255
return gauss_img.astype(np.uint8)
```

# Results

<table>
  <tr>
    <th>Composite Video</th>
    <th>Specular Mask</th>
  </tr>
  <tr>
    <td>
      <video autoplay muted loop>
        <source src="post-res/image-filters-bling/airplane_final.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </td>
    <td>
      <video autoplay muted loop>
        <source src="post-res/image-filters-bling/airplane_final_mask.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </td>
  </tr>
  <tr>
    <td>
      <video autoplay muted loop>
        <source src="post-res/image-filters-bling/truck.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </td>
    <td>
      <video autoplay muted loop>
        <source src="post-res/image-filters-bling/truck_mask.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </td>
  </tr>
    <tr>
    <td>
      <img src="post-res/image-filters-bling/airplane2_out.png"/>
    </td>
    <td>
      <img src="post-res/image-filters-bling/airplane2_mask.png" />
    </td>
  </tr>
</table>


# Notes

**[1]** - Figure 1's image source taken from thumbnail of this video: https://www.youtube.com/watch?v=0GFSppL1CRQ

**[2]** - GitHub link: https://github.com/vjsrinivas/image-filter 


**[3]** - The lens flares do not rotate due to project time constraint, but the rotated versions of lens flares do exist. The code just does not take into account these images.

**[4]** - Currently, the code is written in pure Python, and runs slow on any input due to the nature of Python `for` loops. Later on, I hope to port to Cython or pure C++ to get realtime speeds. 

**[5]** - The video clips and images were taken from [Pexels](https://www.pexels.com/), and I give my thanks to the creators of the videos I used, who put their work out for free use.
