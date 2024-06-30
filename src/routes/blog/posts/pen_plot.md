---
title: Pen Plotting
description: Description goes here
created: '2024-06-30T19:45:28.107Z'
tags: art|other
---

Pen plotting is an artform that allows people to use machines to do the physical drawing actions. Typically, pen plotted art is very methodical and full of very percise patterns. The most common kind of pen plotting machine is the XY pen plotter, which draws onto a piece of paper with some kind of pen/marker/brush. Gcode instructions are used to guide the plotter to the proper positions on the paper. 3D extruder-based printers also operate in a similar way but in an additional (Z) dimension. Could you convert one to a XY pen plotter? 
<!-- more -->

This isn't a new question. There have been multiple posts [[1]](https://urish.medium.com/how-to-turn-your-3d-printer-into-a-plotter-in-one-hour-d6fe14559f1a) [[2]](https://github.com/johnathantran/Pen-Plotter) and projects that took popular 3D printers and converted them into XY pen plotters. The general idea is to construct some kind of mechanism that holds the pen and figure out a pipeline to convert an image into gcode.

For the former, I constructed a simple PLA holder [[download link]](https://drive.google.com/file/d/12XBc1dm8MU3V2Ip31h1jqYUUveD-SpJA/view?usp=sharing) that replaced the existing filament head for the Ender 3 Pro. It was also constructed in a way that it could use all the existing screws that held the extruder head in place, which removed the need to buy additional screws. Two of the screws were also used to fasten the pen to the holder. 

<div style="max-width: 650px; margin-right:auto; margin-left:auto">
    <img style="max-width: 300px;" src="post-res/pen_plot/holder_example.png" alt="Screenshot of simple PLA holder"/>
</div>


Creating the gcode was pretty straight forward. Typically, digital art is created with bitmaps (i.e. canvas's width and height is defined by pixels), but to translate an image to a series of physical movements, we need a canvas defined by real-world units (cm, inches, etc.). To accomplish that, the image needs to be defined as a series of vectors, and the easiest representation is SVG. From the converted SVG artwork, we can use [existing tools](https://sameer.github.io/svg2gcode/) to get our gcode.

The artwork I wanted to pen plot was a giant New Jersey transit ticket. I went to New Jersey for vacation and got the chance to ride the different lightrails, and the trip was so fun that I wanted to memorialize it through this ticket. The ticket was recreated in Inkscape and was broken into three different layers - the background (pink dots), black text, and blue text.


<div style="max-width: 650px; margin-right:auto; margin-left:auto">
    <img style="max-width: 300px; display: inline;" src="post-res/pen_plot/artwork.png" alt="Giant NJ Transit ticket"/>
    <img style="max-width: 300px; display: inline;" src="post-res/pen_plot/artwork_svg.png" alt="Giant NJ Transit ticket in Inkscape"/>
</div>

I performed a calibration sequence for each layer during the printing process:

1. Set head position to home and manually lift the Z-bar such that the pen is off the plate 
2. Replace the main canvas paper with another piece of paper (preferably a cheaper paper)
3. Removing the existing pen from the holder
4. Insert the new pen with minimal pressure from the screw
5. Set the position to home and readjust the pen's position in the holder until it is making contact with the plate with standard pressure of a person holding a pen to a piece of paper
6. Tighten pen to holder until the pen does not move to any horizontal motion 
7. Run current layer gcode on new piece of paper and ensure that the output is drawn correctly
8. If this run is successful, replace the cheaper paper with the canvas paper and execute the real drawing

<div style="max-width: 300px; margin-right:auto; margin-left:auto">
<video autoplay muted loop style="max-width: 300px;">
  <source src="post-res/pen_plot/pen_plot_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

Some important notes about this system:
* A major shortcoming is how the holder affixes the pen with two points of contact. This causes some pens or markers to be tilted at an angle when pushed to the PLA 
* Likewise, this holder also doesn't support pens that __should__ be at an angle (think fountain pens)
* Two screws also makes the adjustment process longer and more tedious
* The calibration process worked well, but one thing not mentioned was the initial calibration of the plate to the first pen. This was a very tedious process on the Ender 3 Pro because of its manual adjustment wheels. Follow the standard calibration procedure for PLA printing to get the plate in proper position
* Calibration process could use some improvements in terms of making sure that the pen pressure was consistent across all points on the plate
* There are limitations to the svg2gcode tool - mainly that it only supports certain types of vector paths. It also doesn't support infill options, so I had to fill in things like "1" and the arrows on the giant ticket by hand
* The original gcode output from svg2gcode did not elevate the pen before going to the next gcode instruction. This could cause the pen to drag along the paper during the transition points. I wrote a small Python script to add an elevation command before every `G0` or `M2` command:

```python
import os
import sys

if __name__ == '__main__':
    in_gcode_file = "INPUT_GCODE_NAME.gcode"
    out_gcode_file =  "OUTPUT_GCODE_NAME.gcode"
    safety_height = 3 #mm

    with open(in_gcode_file, "r") as f:
        contents = list(map(str.strip, f.readlines()))
    
    with open(out_gcode_file, "w") as f:
        for con in contents:
            if "G0" in con:
                f.write("G0 Z%i\n%s\nG0 Z%i\n"%(safety_height, con, 0))
            else:
                if "M2" in con:
                    f.write("G0 Z10\nG0 X0 Y0 Z10\nG0 Z0\n%s\n"%(con))
                else:
                    f.write("%s\n"%(con))
```
