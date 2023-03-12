import os
import matplotlib.pyplot as plt
import numpy as np

STAT_FILES = [
    "mobilenetv2",
    "mobilenetv3",
    "resnet18"
]

STATS_CLEAN = [
    "MobileNetv2",
    "MobileNetv3",
    "ResNet18"
]

STATS_TYPE = [
    "quant",
    None
]

STATS_TYPE_CLEAN = [
    "Quantized",
    None
]

HARDWARE_TYPE = [
    "gpu",
    #"gpu_fp16",
    #"cpu"
]

HARDWARE_TYPE_CLEAN = [
    "GPU",
    #"GPU FLOAT16",
    #"CPU"
]

stats = []
for ht in HARDWARE_TYPE:
    for j, wt in enumerate(STATS_TYPE):
        for i, network in enumerate(STAT_FILES):
            if wt:
                filename = "%s_%s_%s.txt"%(network, wt, ht)
                _key = "%s %s"%(STATS_CLEAN[i], STATS_TYPE_CLEAN[j])
            else:
                filename = "%s_%s.txt"%(network, ht)
                _key = "%s"%(STATS_CLEAN[i])

            assert os.path.exists(filename), filename

            with open(filename, 'r') as f:
                contents = list(map(str.strip, f.readlines()))
                contents = [float(contents[c].split()[-1]) for c in range(len(contents)-1)]
                #print(contents, len(contents))
                _avg = np.mean(contents)
                stats.append(_avg)
                
fig, ax = plt.subplots(figsize=(15,10),layout='constrained')
x = np.arange(len(stats))
width = 0.1  # the width of the bars
multiplier = 0

for stat in stats:
    offset = width * multiplier
    rects = ax.bar(x + offset, stat, width, label=attribute)
    ax.bar_label(rects, padding=3, fmt="%0.1f")
    multiplier += 1