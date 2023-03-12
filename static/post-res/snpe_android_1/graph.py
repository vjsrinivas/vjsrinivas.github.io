import os
import numpy as np
import matplotlib.pyplot as plt

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

fig, ax = plt.subplots(figsize=(9,6),layout='constrained')

species = HARDWARE_TYPE_CLEAN
x = np.arange(len(species))  # the label locations
width = 0.1  # the width of the bars
multiplier = 0

penguin_means = {}
for network in STATS_CLEAN:
    for wt in STATS_TYPE_CLEAN:
        if wt: filename = "%s %s"%(network, wt)
        else: filename = "%s"%(network)
        penguin_means[filename] = []
print(penguin_means)

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
                penguin_means[_key].append(_avg)
                
print(penguin_means)

offsets = []
labels = []
for attribute, measurement in penguin_means.items():
    offset = width * multiplier
    rects = ax.bar(x + offset, measurement, width, label=attribute)
    ax.bar_label(rects, padding=3, fmt="%0.1f")
    multiplier += 1.5
    offsets.append(offset)
    labels.append(attribute)

ax.set_ylabel('FPS')
ax.set_title('Network Performance Based on Hardware Platform')
ax.set_xticks(offsets, labels)
#ax.legend(loc='upper left')
#ax.set_ylim(0, 60)

plt.savefig("performance_infer.png")