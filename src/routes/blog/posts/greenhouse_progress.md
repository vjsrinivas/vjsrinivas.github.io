---
title: Building a Mini-Greenhouse
description: This is a post about the lessons I learned from helping build a small in-door greenhouse
created: '2026-05-10T11:20:28.107Z'
tags: hardware | open-source
---

For the past year, I've been developing a small indoor greenhouse for a school that I volunteer at. We wanted to explore topics related to food insecurity and food deserts, and the goal was to let the students learn engineering, design, and agricultural concepts by extending the greenhouse design. Below I’ll walk through how we built it, what we managed to achieve, and (most importantly) the lessons I walked away with.

<!-- more -->

# Background

Since 2023, I've been trying to get involved in neighborhood volunteering. It's a great way to meet new people, leverage your STEM skillsets, and actually make a difference. Over those 3 years, I worked with a public school to do a lot of different things, including FIRST robotics, STEM festivals, and show-and-tells. I’ll be honest; I’m not the best at juggling everything. I tend to bite off more than I can chew, especially when it comes to time management. But in early 2025 a small discussion regarding a set of existing school greenhouses made something in my mind click.

What if you could make a cheap, semi-automated greenhouse system?

The greenhouse would be able to automatically turn on a grow light, water itself, and ventilate itself. There could be multiple different sensors to help it become a "smart" greenhouse (e.g light sensors, temperature/humidity sensors, and small cameras). It could help with the school's STEAM certification process - employing a lot of engineering design work, agriculture knowledge, and even artistic opportunities. So, over the summer, I set off to design and construct an initial version of the greenhouse.

# Designing the Greenhouse

My first instinct was to buy a ready‑made unit on Amazon and modify it a little bit. I found a few interesting options, including vertical‑shelf designs, small countertop kits, but two deal‑breakers quickly surfaced:

| Issue          | Reasoning                                                                 |
|----------------|---------------------------------------------------------------------------------|
| **Price**      | Even the cheapest “ready‑made” greenhouse cost $80–$100 and offered barely enough space for anything beyond seedlings. Larger units were prohibitively expensive and would have required extensive modification to add sensors, pumps, and fans. |
| **Reproducibility** | Relying on a commercial chassis ties you to that product’s lifespan. If the model disappears from the market, you’re forced into a costly redesign. I wanted something anyone could rebuild with common parts. |

Because of those issues, I decided to construct the greenhouse structure by myself. Taking inspiration from [FrostyGarden's seeding greenhouse](https://frostygarden.com/topics/building-a-diy-small-seedling-greenhouse-with-pvc/), I constructed the structure with PVC piping and greenhouse tarps. I know that PLA isn't the best for this kind of work, but I created 3D prints of some of the PVC connectors and support structures to save on costs.

### The “semi‑automatic” subsystems

| Subsystem | Purpose |
|-----------|--------------|
| **Watering** | Drip‑irrigation line driven by a small peristaltic pump. |
| **Lighting** | Full‑spectrum LED strip controlled via a relay. |
| **Ventilation** | Two 120 mm fans (intake + exhaust) switched on when temperature or humidity rise above thresholds. |
| **Sensing & Control** | A Raspberry Pi 5 talks to an I²C multiplexer that reads light, temperature, and humidity sensors. The Pi also drives a relay board for the pump, lights, and fans. |

# Growing Plants

<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 400px;">
<video style="max-width: 360px !important;" autoplay muted loop>
<source src="post-res/greenhouse_progress/camera_1_5_24_2026.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

<video style="max-width: 360px !important;" height="360" autoplay muted loop>
<source src="post-res/greenhouse_progress/camera_2_5_24_2026.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
</div>

I created the structure and the electronics as a 'base", and the school had the students do a couple of activities:

1. **Understand the electronics** – a high‑level overview of how the Pi talks to sensors and relays.  
2. **Read the Python code** – walk through the main script, discuss what each function does.  
3. **Brainstorm improvements** – ideas ranged from new camera angles to better ventilation, heating, or cooling strategies.

We also tackled two practical questions:

* How do we build a soil bed that fits inside the PVC frame?  
* What crops should we try first?

For the last point, the students decided to initially plant carrots and cabbages. We let the greenhouse do its thing for around 3 months and... got nothing. Nothing sprouted, and it was RCA'ed to some irregular watering cycles that happened due to a programming bug early in the deployment (my bad!). The kids pivoted and decided to plant kentucky beans and basil, and this time, it worked. We had to adjust the watering cycle as well as the grow light duration, but things quickly grew. What you saw in the vidoes above are of the kentucky beans growing.

Unforunately, for reasons I'm still unsure of, the bean sprouts haven't produced any flowers yet, so there are no actual beans to harvest. It might be due to not enough lighting, lack of lighting strength, or the lack of trellises for the plant to climb. The basil continues to grow very slowly, and we'll have to see where it ultimately ends up.

# Lessons Learned

### 1. Document **everything** as you go

I've known this for many years, but I am horrible at writing. I think I remember one time where my faculty advisor in grad school asked me if English was a second language to me (which is funny because both of us are immigrants). This blog has been an attempt to get better at that, but working on the documentation for this greenhouse showed how little progress I actually made.

I was not very cognizant of taking photos while I was building and wrapping the greenhouse, so when it came time to write the instructions out, I only had my vague memory. This forced me to recreate the process visually through Blender. On top of that, describing and creating instructions was far too slow. I think since there were physical, electrical, and programming aspects to this project, there was a lot of information that had to be contextualized and reiterated to an audience that I hadn't written for before (e.g., kids).

Although I received generally positive remarks regarding the current state of the [documentation](https://github.com/vjsrinivas/greenhouse/tree/master/docs), I see a lot of areas where it falls short. Especially amongst the physical construction and electrical wiring sections.

### 2. Refactor, even when the code looks “simple”

When I was coding the main program for the greenhouse, I was already aware that I might have to explain this code to a student that, in the best case, might have taken AP Computer Science. I think that course can set you up well for more in-depth computer science concepts in college, but the translation isn't always equal across different students. This meant that I needed to keep the Python code as structured and easy-to-read and easy-to-understand as possible. I made sure to abstract away the initialization, I/O, and data retrieval from sensors and instruments. But when custom scheduling and timing became a requirement, I dropped the ball on making sure that `main.py` showed the simplest approach to solve the requirement. I wanted the flexibility of specifying a duration, frequency, time-based execution, and a "budget" (which would let the sensor influence the duration of the instrument). This caused the main loop for the whole program to be a little too complicated to explain to a 10th grader.

The big take away from this is to frequently review the codebase and make sure it's aligned with our ultimate outcome - passing some kind of education to students.

### 3. Plan lessons *before* the activity

Speaking of passing something along to the students, I think both the school and I dropped the ball on properly building out lesson plans. Since this was technically an after-school activity, student participation was variable and optional. My availability fluctuated based on my workload and responsibilities, but I do wish I had written down a solid plan rather than winging it in some areas. I also wish I had the time to fully test out a plan before trying it out with the students. In many instances, we ran into silly Python package issues on the Raspberry Pi, which meant that I had to diagnose the issue all by myself while the students waited for me to figure it out.

# Closing Thoughts

Honestly, I think my expectations at the beginning of the project reflect poorly on our actual progress. We had a hard time setting up the structure and dealing with issues like drainage. I didn't feel like the students were being challenged enough, and in the end, we didn't even get any beans. That said, I have plans to improve the electronics, code, and documentation. The students have also expressed high interest in overhauling the appearance and structure of the greenhouse in the fall. This gives me hope that future iterations will be far more successful than this first attempt.

If you’re interested in reproducing this setup or just want to peek at the code—check out the full repository: <https://github.com/vjsrinivas/greenhouse>. Feel free to open an issue or submit a pull request.