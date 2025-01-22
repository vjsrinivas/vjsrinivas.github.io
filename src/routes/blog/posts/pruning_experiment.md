---
title: DeepSparse vs OpenVINO Benchmarking
description: Benchmarking of DeepSparse against OpenVINO on sparse classification networks
created: '2025-01-11T19:45:28.107Z'
tags: machine learning
---
To support low-latency applications, there has been extensive work in the Deep Learning space to accelerate neural networks.
<!-- more -->

In general, these works break down into 3 camps:
- **Hardware-Assisted Acceleration:** Hardware that targets the acceleration of common neural network operations; think TensorCores, TPUs, and NPUs.
- **Architecture-based Optimizations:** Neural network architectures that focus on reduced operations or extracting more features from less parameters. Think architectures such as MobileNet and EfficientNet.
- **Runtime Optimizations:** Any inference-time or inference-level optimization, such as layer fusion, quantization (PTQ or QAT), and pruning

This post will benchmark an aspect of that last camp. Previous research has shown that sparse weight matrices introduced by unstructured pruning can be used to accelerate network inferencing by [packing more data into CPU cache](https://neuralmagic.com/blog/how-neural-magics-deep-sparse-technology-works/) and taking advantage of GEMM instructions (ex: AVX2, AVX512-VNNI, and etc.). The main comparison is **not** between different networks or pruning techniques. Rather, we are comparing OpenVINO and DeepSparse - two popular CPU-based inference engines with support for pruned networks.

**TLDR:** DeepSparse outperformed OpenVINO in throughput (img/s) by an average of 12%. It also excelled in all the lower-end compute scenarios tested and with most network architectures. However, on the m7i.xlarge instance (Intel Platinum 8488C), OpenVINO outperformed DeepSparse by an average of 17%. Does this mean I will use DeepSparse? Probably not. 

<figure>

![](post-res/pruning_experiment/overview_line_graph.png)

<figcaption></figcaption>
</figure>


## Methodology

I collected common “real-time” convolution-based classification networks and a transformer-based network called MobileViT in their base and pruned versions. Of the pruned models, MobileViT-xs, EfficientNet-B0, and EfficientNet-B2 were pruned by me, and the rest were collected from NeuralMagic's model zoo. All models were pruned using SparseML with the default Gradient Magnitude Pruning (GMP) method applied to convolutional and linear layers. Since hyperparameters for pruning are architecture-specific, there is no strict paradigm followed for the models I pruned. The top 10 layers of those models were analyzed for sensitivity by randomly masking the weights and calculating the validation accuracy on Imagenet-1k.

Sparsity values for each layer were subjectively chosen based on the sensitivity analysis. Following NeuralMagic's recommendation, the pruning process goes through a stabilization, pruning, and finetuning period with an initial learning rate of 0.01. I applied a gamma-based learning rate scheduler and reduced the LR during different parts of the pruning and finetuning stages. The pruning process I implemented requires additional work, as the pruned networks show notable decreases in accuracy on Imagenet-1k, but they serve as reasonable models for benchmarking.

<figure>

<img src="post-res/pruning_experiment/efficientnet_b0_sensitivity_graph_labeled.png" style="width: 75% !important"/>

<figcaption></figcaption>
</figure>

<figure>

<img src="post-res/pruning_experiment/efficientnet_b2_sensitivity_graph_labeled.png" style="width: 75% !important"/>

<figcaption></figcaption>
</figure>

<figure>

<img src="post-res/pruning_experiment/mobilenet_xs_sensitivity_graph_labeled.png" style="width: 75% !important"/>

<figcaption></figcaption>
</figure>

<figure>

| Network Name       | Sparsity   | ImageNet-1k Validation Accuracy |
| ---------------------- | ----- | ----- |
| MobileViT-xs | 54% | 65.09% <b style="color: red;">(-9.52%)</b> |      
| EfficientNet-B0 | 61% | 71.75% <b style="color: red;">(-5.15%)</b> |
| EfficientNet-B2 | 62% | 77.37% <b style="color: red;">(-1.83%)</b> |

<figcaption>Table 1. Table shows all models that were pruned by me, their sparsity, the ImageNet-1k validation accuracy, and the baseline delta.</figcaption>
</figure>

For each model, we export an ONNX version and run dummy inputs at the models' respective input size on ONNXRuntime, OpenVINO, and DeepStream (on the provided benchmarking tool as well as a separate Python that uses the API) inference engines. While testing, I saw that both DeepSparse methods yielded essentially the same results, but both were kept for the sake of completeness. Timing is measured with a simple `time.time()` before and after each inference call. Each inference engine was ran for 60 seconds (excluding the DeepSparse benchmark tool) and repeated 5 times to account for any noise. These runs were conducted on the following AWS EC2 instances:

- [t3.xlarge](https://instances.vantage.sh/aws/ec2/t3.xlarge)
- [c4.xlarge](https://instances.vantage.sh/aws/ec2/c4.xlarge)
- [m6a.xlarge](https://instances.vantage.sh/aws/ec2/m6a.xlarge)
- [m5.xlarge](https://instances.vantage.sh/aws/ec2/m5.xlarge)
- [m5n.xlarge](https://instances.vantage.sh/aws/ec2/m5n.xlarge)
- [m7i.xlarge](https://instances.vantage.sh/aws/ec2/m7i.xlarge)

## Results

Across all CPUs except the m7i.large, DeepSparse outperforms OpenVINO by an average of 12% in terms of throughput. On m7i.xlarge, OpenVINO sees a 28% jump in throughput compared to its 2nd best performing AWS instance (m6a.xlarge). On a per model basis, EfficientNet-b0, EfficientNet-b2, and MobileViT did not see significant speed-up when comparing the baseline model and pruned models. These models were ones that I had pruned, so it could be down to the sparisification recipe as well as the sparsity target not hitting an optimization threshold for any of the inference engine. In terms of performance across AWS instances, the increase in throughput was only seen on the higher-cost instances, which typically have stronger CPUs.

As an aside, the compressive affects of pruning can be seen in Table 2. I use gzip with the compression ratio set to 9 (highest available compression ratio) on all base and pruned models. Excluding ResNet50, which has a higher reduction ratio due to the INT8 datatype affecting filesize, the average reduction ratio is 2.99.


<figure>

| Network Name       | Original Size (MB)   | Optimized Size (MB) | Reduction Ratio |
| ---------------------- | ----- | ----- | ----- |
| MobileViT-xs | 8.62 | 4.24 | 2.03x |      
| EfficientNet-B0 | 19.59 | 8.60 | 2.28x |
| EfficientNet-B2 | 33.76 | 17.82 | 1.89x |
| ResNet50 <b style="color: red;">*</b> | 95.16 | 10.48 | 9.08x | 
| MobileNetv1 | 16.26 | 4.70 | 3.45x |  
| VGG19 | 533.10 | 110.34 | 4.83x |
| InceptionV3 | 88.63 | 25.37 | 3.49x |  

<figcaption>Table 2. Table shows the different sparsity levels and their affect on file size after gzip compression with the compression ratio set to 9 (the highest).</figcaption>
<figcaption><b style="color: red;">*</b> - INT8 quantization was also applied. </figcaption>
</figure>

<figure>

![](post-res/pruning_experiment/overview_graph_intel_xeon_e5-2666_v3_cpu.png)

![](post-res/pruning_experiment/overview_graph_amd_epyc_7r13_cpu.png)

![](post-res/pruning_experiment/overview_graph_intel_xeon_platinum_8175m_cpu.png)

![](post-res/pruning_experiment/overview_graph_intel_xeon_platinum_8175m_cpu_2.png)

![](post-res/pruning_experiment/overview_graph_intel_xeon_platinum_8259cl_cpu.png)

![](post-res/pruning_experiment/overview_graph_intel_xeon_platinum_8488c_cpu.png)

<figcaption></figcaption>
</figure>

# Discussion

**1. Which inference engine was faster?**

From the results, it's **typically** DeepSparse. While there is a lot of naunce in terms of hardware and model architecutre, all but one AWS instance type consistently showed higher throughput for models on DeepSparse.

**2. What is the reason for the advantage?**

Since both inference engines are closed source, I can't tell you. But I would not be surprised if certain kernels in DeepSparse's arsenal were more optimized for these kinds of networks.

**3. Why didn't the EfficientNet and MobileViT networks see any throughput improvements after pruning?**

In the "Results" section, I alluded to the sparsity level not being high enough for any engine to take advantage of. I went back and did a pruning session on all three networks at 85% and 99% sparsity. This pruning attempt only focused on sparsity and not the model performance:

<figure>

<img src="post-res/pruning_experiment/fake_prune_throughput.svg" style="width:75% !important"/>

<figcaption>N.B. CPU used was an AMD Ryzen 7 2700X</figcaption>
</figure>

Sparsity had little effect on the throughput speed for these networks. EfficientNet-b0 was the only network that saw an increase in throughput, but it was on ONNXRuntime. I don't fully understand why.

**4. How come OpenVINO was faster on m7i.xlarge?**

Similar to the points made in #2, I can't provide a definitive answer, but I believe it comes down to the CPU. After retrieving some public specifications for each CPU, I saw that the Intel Xeon Platinum 8488C is the newest CPU with VNNI support and a large L2 & L3 cache. It also had the highest maximum clock frequency amongst all the listed CPUs. These factors are likely the main reason why OpenVINO was faster.

| Instance Type | CPU Type                   | CPU Family              | AVX2 Support | AVX512 Support | VNNI Support | L1 Cache (Data) | L1 Cache (Instruct) | L2 Cache | L3 Cache | Maximum Frequency | Cores | Sources                                                                                                                                 |
|---------------|----------------------------|-------------------------|--------------|-----------------|---------------|-----------------|---------------------|----------|----------|-------------------|-------|-----------------------------------------------------------------------------------------------------------------------------------------|
| m7i.xlarge    | Intel Xeon Platinum 8488C  | Sapphire Rapids-SP      | Yes          | Yes             | Yes           | 48KB            | 32KB                | 2MB      | 105MB    | 3.8 GHz           |    56 | [Link](https://www.intel.com/content/www/us/en/products/sku/231730/intel-xeon-platinum-8480c-processor-105m-cache-2-00-GHz/specifications.html) |
| t3.xlarge     | Intel Xeon Platinum 8175M  | Skylake                 | Yes          | Yes             | No            | 24KB            | 24KB                | 1MB      | 33MB     | 2.5 GHz           |    24 | [Link](https://www.cpu-world.com/CPUs/Xeon/Intel-Xeon%208175M.html)                                                                             |
| m5.xlarge     | Intel Xeon Platinum 8175M  | Skylake                 | Yes          | Yes             | No            | 24KB            | 24KB                | 1MB      | 33MB     | 2.5 GHz           |    24 | [Link](https://www.cpu-world.com/CPUs/Xeon/Intel-Xeon%208175M.html)                                                                             |
| m5n.xlarge    | Intel Xeon Platinum 8259CL | Cascade Lake            | Yes          | Yes             | Yes           | 24KB            | 24KB                | 2MB      | 33MB     | 2.5 GHz           |    32 | [Link](https://www.cpu-world.com/CPUs/Xeon/Intel-Xeon%208259CL.html)                                                                            |
| m6a.xlarge    | AMD EPYC 7R13              | Zen3 (EPYC 7003 series) | Yes          | No              | No            | 32KB            | 32KB                | 512KB(?) | 33MB(?)  | 3.5 GHz           |    48 | [Link](https://ldbcouncil.org/benchmarks/snb/LDBC_SNB_BI_20230406_SF10000_tigergraph.pdf)                                                       |
| c4.xlarge     | Intel Xeon E5-2666V3       | Haswell-EP (?)          | Yes          | No              | No            | 32KB            | 32KB                | 1MB      | 45MB     | 3.5 GHz           |    10 | [Link](https://www.techpowerup.com/cpu-specs/xeon-e5-2666-v3.c2876)                                                                             |

**5. Does this mean I'll actually use DeepSparse?**

Since entering the industry, my prespective has changed from using tools that will give me the best performance (speed, task performance, etc.) to tools that give me flexiblity. Currently, DeepSparse lacks the level of integration that OpenVINO has - particularly, an integration with ONNXRuntime and deployment stacks like Triton. DeepSparse does have its own server program, but that - again - limits your flexbility. Why have a deployment stack only geared towards CPU? Finally, based on OpenVINO's performance on the 8488C, we might see that 12% advantage dwindle with newer Intel CPUs.   

**6. Anything else, Vijay?**

I have a nagging feeling that there's some bias being introduced when utilizing SparseML for network pruning, since it is a tool developed by NeuralMagic. I guess a proper follow up would be to reimplement GMP with pure PyTorch and re-run all the experiments, but PyTorch's pruning API is much more complicated compared to SparseML.