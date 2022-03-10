import matplotlib.pyplot as plt
from math import sin,cos
with open(r'./message.txt','r',encoding='utf-8') as txt:
    ofile=open(r'./output.txt','w',encoding='utf-8')
    ofile.write(txt.read())
plt.figure(figsize=(16,7),dpi=100)
sinx=[x/100 for x in range(1000)]
siny=[sin(v) for v in sinx]
plt.plot(sinx,siny,label='sin(x)')
cosx=[x/100 for x in range(1000)]
cosy=[cos(v) for v in cosx]
plt.plot(cosx,cosy,label='tan(x)')
plt.legend()
plt.yticks([x-2 for x in range(5)][::1])
plt.savefig(r'.\public\admin\update\image.png')