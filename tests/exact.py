"""Independent rational reconstruction of the PDF model (standard library only)."""
from fractions import Fraction as F

A = [
    [2,4,1,-1,0,0,0,0,0,0,0,0],
    [3,3,0,0,1,-1,0,0,0,0,0,0],
    [1,0,0,0,0,0,1,-1,0,0,0,0],
    [0,1,0,0,0,0,0,0,1,-1,0,0],
    [30,40,0,0,0,0,0,0,0,0,1,-1],
]
b = [80,80,10,10,1200]
C = [[0,0,0,1,0,1,0,0,0,0,0,0],
     [0,0,0,0,0,0,30,0,40,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,1,0]]
t = [[F(v) for v in r+[b[i]]] for i,r in enumerate(A)]
base = [2,4,6,8,10]
expected = [(1,3),(0,2),(9,0),(7,1)]
k = 0
moves = []
while k < 3:
    z = [[sum(F(c[base[i]])*t[i][j] for i in range(5))-(c[j] if j<12 else 0)
          for j in range(13)] for c in C]
    candidates = [j for j in range(12) if z[k][j]>0 and all(z[h][j]>=0 for h in range(k))]
    if z[k][12] == 0 or not candidates:
        k += 1
        continue
    j = max(candidates,key=lambda j:z[k][j])
    i = min((i for i in range(5) if t[i][j]>0),key=lambda i:t[i][12]/t[i][j])
    moves.append((j,i))
    p = t[i][j]
    t[i] = [v/p for v in t[i]]
    for h in range(5):
        if h != i:
            m=t[h][j]
            t[h]=[v-m*w for v,w in zip(t[h],t[i])]
    base[i]=j
    assert all(r[12]>=0 for r in t)
assert moves == expected
x = [F(0)]*12
for i,j in enumerate(base):
    x[j]=t[i][12]
assert x[0] == x[1] == F(40,3)
assert x[7] == x[9] == F(10,3)
assert x[10] == F(800,3)
for row,rhs in zip(A,b):
    assert sum(v*w for v,w in zip(row,x)) == rhs
assert z[0][12] == z[1][12] == 0
assert z[2][12] == F(800,3)
print('PASS · aritmética racional exacta: 4 pivotes, 5 ecuaciones, x₁=x₂=40/3, P₃=800/3.')
