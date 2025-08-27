---
title: Implementing a Blog in ESP32
description: A simple HTTP server and blogging pipeline implemented through ESP32
created: '2025-08-26T19:45:28.107Z'
tags: hardware
---

I spent some time developing a simple pipeline that serves a blog on a microcontroller. It's an excuse to learn and implement things I would never give myself a reason for. Moreover, doing it in a constrained environment like the one in a microcontroller was incredibly satisfying.

<!-- more -->

## Process

Because the ESP32 does not have a development pipeline, dependencies, or hardware capacity comparable to almost any post-2000 x86 computer, all of the parts for the blog had to be made from scratch. Hardware limitations also constrained the different kinds of web features available from the server-side, such as dynamic loading. This really only allows static websites to be considered.

<img  src="post-res/http_esp_32_server/diagram_flow.svg"/>

I also wanted the blog that was managed via Markdown files because of Markdown's simplicity and flexibility. This meant that I needed to translate each Markdown file into its respective HTML page and incorporate any website design that was needed, such as a navigation bar or website title. This meant I had to create a converter that took Markdown syntax and converted it into HTML syntax. This converter was implemented in Rust.

Why Rust? I'm dipping my toes into this language and wanted to see if I could create this simple parser with what I had learned so far. This converter is not very efficient or bug-free, but it is able to parse most of the core Markdown syntax rules, such as headers, images, bolding, italicization, underscoring, and URL linking. And, to be honest, how complex does your blog need to be? What are you showing your readers that you cannot do through normal text and images? This isn't an excuse for a badly implemented converter, I swear.

After the HTML files are generated, we need to transfer these files into the ESP32. We can utilize the SPIFFS file system, which uses the flash storage on the ESP to write persistent files. Because SPIFFS has a 32 byte limit on filenames and no folder hierarchy, all website assets had to be checked and restructured before they were flashed to the ESP32.

Once the website data was on the board, there needs to be instructions for the microcontroller to listen and respond for incoming internet requests. Using an existing implementation via Arduino's HTTPClient, I implement a very simple static HTTP server in ESP32. The program attempts to connect to my local WiFi, illuminates a red LED on successful connection, and starts a loop to listen for any incoming HTTP requests. When a request comes in, the destination info is parsed, and the data in the flash with the same name is loaded, packaged with proper HTML headers, and send back to the requester.

## Implementing Markdown2HTML
Truth be told, this is a terrible application. My first attempt at a full Rust application after reading and practicing through the [online Brown University Rust textbook](https://rust-book.cs.brown.edu). I guess I didn't really consider how other parsers work, and coded it in a way that resembled my mind's logical process as if it were tasked with parsing a file.

This included detecting each kind of major Markdown syntax (# for some kind of title, * for italics or bolding, etc.), and brute forcing a conversion to an equivalent HTML tag. It breaks under different edge cases and isn't even close to supporting the full Markdown syntax... but it was good enough. I'm hoping that, in the future, I'll be able to revisit this and rewritten the parser for my own sake and as a testament to my progress in Rust.

## Implementing HTTP Server on ESP32
Getting a HTTP server running on an ESP32 is surprisingly easy (don't ask me about HTTPS). We utilize an Arduino library base so we can utilize the `HTTPClient` class as well as the `WiFiClient` class, which will allow us to automatically connect to my WiFi router and setup a socket to listen to any incoming HTTP requests. The HTTPClient is in a loop and indefinitely blocks until a request comes in. The HTTP request will have the requested material, which can be parsed out, and we simply look up that asset from the SPIFFS and read into memory if it exists. We package that data into a HTTP response packet and send it back to the original requester.

## Results
The website works! I can write a post in Markdown, run a script to automatically convert it to a HTML file, and run another command to flash the file to the ESP32. Once the ESP32 connects to my local WiFi, I'm able to access it as normal:

<figure>
<img  src="post-res/http_esp_32_server/home_page.png",  alt="Image of ESP32 blog home page"/>
<figcaption><b>Fig. 1</b> - Example of the home page</figcaption>
</figure>

----

<figure>
<img  src="post-res/http_esp_32_server/post_example.png",  alt="Image of an ESP32 blog post"/>
<figcaption><b>Fig. 2</b> - Example of the home page</figcaption>
</figure>