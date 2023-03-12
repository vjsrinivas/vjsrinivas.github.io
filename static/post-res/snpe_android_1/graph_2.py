# around 30 seconds data
import os
import numpy as np
import matplotlib.pyplot as plt

with open('/home/vijay/Documents/devmk4/vjsrinivas.github.io/static/post-res/snpe_android_1/end2end_timing', 'r') as f:
    contents = list(map(str.strip, f.readlines()))
contents = [float(contents[c].split()[-1]) for c in range(len(contents)-1)]

top95 = np.percentile(contents, 5)
top99 = np.percentile(contents, 99)
avg = np.average(contents)

print("5th percentile (worse): ", top95)
print("99th percentile (best): ", top99)
print("Average: ", avg)

plt.figure()
plt.plot(contents)
plt.title("End-to-End Performance Run")
plt.ylabel("FPS")
plt.xlabel("Timestep")
plt.savefig("performance.png")