---
title: Pseudo-LIDAR Projection via Depth Maps
description: Description goes here
created: '2024-04-18T19:45:28.107Z'
tags: image processing
---

In many navigation and layout applications, there is a need for spatial data. Historically, this meant that most hardware choices were radio frequency based - mainly LiDAR or RADAR.
<!-- more -->

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.plot.ly/plotly-2.31.0.min.js" charset="utf-8"></script>

<script>
    function unpack(rows, key) {
        return rows.map(function(row)
    { return row[key]; });}

    function generate_plot(url, html_element) {
        //const data = d3.csv("./post-res/pseudo_lidar/20240414_115355.csv");
        const data = d3.csv(url)
        data.then( (rows) => {
            var z_data = unpack(rows, 'z1');

            var trace1 = {
                x:unpack(rows, 'x1'),
                y: unpack(rows, 'y1'),
                z: z_data,
                mode: 'markers',
                colorscale: 'YlGnBu',
                marker: {
                    size: 2,
                    opacity: 1.0,
                    color: z_data,
                    colorscale: 'Viridis'
                },
                type: 'scatter3D',
            };

            var data = [trace1];
            var layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            },
            scene: {
                    camera: {
                        eye: {x:0, y:0, z:2.5},
                    },
                }
            };
            Plotly.newPlot(html_element, data, layout);
            console.log(`Generated plotly graph for ${html_element}`)

            /*
            var previewID = html_element+"_preview"
            const preview_img = document.getElementById(previewID)
            preview_img.remove()
            */
        } )
    }

    /*
    generate_plot("./post-res/pseudo_lidar/20240414_115355.csv", "gd")
    generate_plot("./post-res/pseudo_lidar/20240414_120609.csv", "gd1")
    generate_plot("./post-res/pseudo_lidar/20240414_120944.csv", "gd2")
    generate_plot("./post-res/pseudo_lidar/20240413_174803.csv", "gd3")
    generate_plot("./post-res/pseudo_lidar/20240414_123255.csv", "gd4")
    */
</script>
<style>
    .viz {
        width: 400px;
        height: 400px;
        display: inline
    }

    .preview {
        max-width: 400px;
        max-height: 400px;
    }
</style>

## Motivation

Both LiDAR and RADAR can produce a 3D point cloud but can also be composed into a depth map. Although both are still used extensively for spatial imaging, the biggest drawbacks have been the price, size, and processing power needed to get these methods working efficiently.

An alternative method has been to use stereosopic cameras - where a camera system has two lenses set a certain distance apart. Similar to how our eyes work, stereosopic cameras utilize the difference in the two images along with the distance between the two lenses to calculate spatial data. Typically this data is in the form of a depth map, but it can also be converted into a 3D point cloud if the intrinsics of the two lenses are known. The downside of stereosopic cameras is also hardware cost and the relatively large housing requirements for the two lenses. The quality of the depth map output can also decrease based on various environmental factors such as clutter.

So what could you do if you are limited by a tight budget or dimension requirement? In many computer vision applications, you’re usually stuck with a less-than-ideal, single lens camera, but a client could ask you to develop something that will require you to have spatial data. I was ruminating about this kind of situation and what my options could be.

One potential method of deriving good spatial data from a traditional single lens camera would be applying a neural network trained for monocular depth estimation. Then, if you have the cameras intrinsics (mainly focal length and sensor center coordinates), you can generate a rough 3D point 
cloud. Additionally, if you had a set of reliable reference points, you could also derive a metric 3D point cloud. 

In recent years, advancements in image encoding and segmentation methods have indirectly improved many monocular depth estimation networks. One of the best papers has been [Depth Anything](https://arxiv.org/pdf/2401.10891.pdf). The basic idea of the paper is to use a "data engine" with a massive amount of unlabeled data to generate a model with great generalization abilities (very similar to the approach taken by Segment Anything Method). Along with the data engine, the authors employ different training techniques related to augmentation and auxiliary supervision to develop a foundational model for monocular depth estimation. 

## Methodology

The general idea is to [generate or retrieve the intrinsics of the camera](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html) you are using - mainly the focal length (single value) and optical centers. After that, for each image taken, process it through Depth Anything. Finally, [based on this survey paper](https://arxiv.org/pdf/2302.10007.pdf), use the following equation to generate the 3D point cloud:

$$
x \leftarrow (z/F)(u-C_{u})
$$
$$
y \leftarrow (z/F)(v-C_{v})
$$
$$
z \leftarrow d_{u,v}
$$

$$
d_{u,v} \rightarrow \text{the depth value at a given image coordinate (u, v)}
$$
$$
C_{u,v} \rightarrow \text{the optical center tuple on the x and y coordinate }
$$
$$
F \rightarrow \text{the focal length of the camera}
$$

The results were okay... The model performed pretty well on all the sample images, but the point cloud was not as accurate as I hoped it to be. This is probably because of the camera intrinsics. I was using my phone camera and couldn't get the intrinsics from online specifications or the operating system so had to manually calibrate it, which could lead to incorrect values.

## Examples:
<figure>
<div>
<img src="./post-res/pseudo_lidar/20240414_115355_processed.jpg"/>
<div class="viz" id="gd">
    <img id="gd_preview" class="preview" src="./post-res/pseudo_lidar/gd.png"/>
</div>
</div>
<figcaption><b>Fig. 1</b> - Projection of a water bottle sitting on top of a laptop.</figcaption>
</figure>

<figure>
<img src="./post-res/pseudo_lidar/20240414_120609_processed.jpg"/>
<div class="viz" id="gd1">
    <img id="gd1_preview" class="preview" src="./post-res/pseudo_lidar/gd1.png"/>
</div>
<figcaption><b>Fig. 2</b> - Projection of a printer on the ground next to a cardboard box.</figcaption>
</figure>

<figure>
<img src="./post-res/pseudo_lidar/20240414_120944_processed.jpg"/>
<div class="viz" id="gd2">
    <img id="gd2_preview" class="preview" src="./post-res/pseudo_lidar/gd2.png"/>
</div>
<figcaption><b>Fig. 3</b> - Projection of a plush toy on top of a stack of pillows. I have pillowcases; I was just washing them. </figcaption>
</figure>

<figure>
<img src="./post-res/pseudo_lidar/20240413_174803_processed.jpg"/>
<div class="viz" id="gd3">
    <img id="gd3_preview" class="preview" src="./post-res/pseudo_lidar/gd3.png"/>
</div>
<figcaption><b>Fig. 4</b> - Two lamps with a TV stand in between them. The projection is pretty bad with this one.</figcaption>
</figure>

<figure>
<img src="./post-res/pseudo_lidar/20240414_123255_processed.jpg"/>
<div class="viz" id="gd4">
    <img id="gd4_preview" class="preview" src="./post-res/pseudo_lidar/gd4.png"/>
</div>
<figcaption><b>Fig. 5</b> - Crowded desk with a piece of foam sticking towards the camera.</figcaption>
</figure>