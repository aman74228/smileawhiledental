# Builds OKLCH ramps anchored on exact brand hexes, prints tokens + WCAG contrast.
import math, json, sys
def s2l(c): c/=255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def l2s(c): c=max(0,min(1,c)); v=12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055; return round(max(0,min(1,v))*255)
def hex2rgb(h): h=h.lstrip('#'); return [int(h[i:i+2],16) for i in (0,2,4)]
def rgb2hex(r): return '#%02X%02X%02X'%tuple(r)
def rgb2oklch(h):
    r,g,b=[s2l(x) for x in hex2rgb(h)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b; m=0.2119034982*r+0.6806995451*g+0.1073969566*b; s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s; a=1.9779984951*l-2.4285922050*m+0.4505937099*s; bb=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L, math.hypot(a,bb), math.degrees(math.atan2(bb,a))%360
def oklch2hex(L,C,H):
    a=C*math.cos(math.radians(H)); b=C*math.sin(math.radians(H))
    for _ in range(40):  # gamut-map by reducing chroma
        l=(L+0.3963377774*a+0.2158037573*b)**3; m=(L-0.1055613458*a-0.0638541728*b)**3; s=(L-0.0894841775*a-1.2914855480*b)**3
        r=4.0767416621*l-3.3077115913*m+0.2309699292*s; g=-1.2684380046*l+2.6097574011*m-0.3413193965*s; bl=-0.0041960863*l-0.7034186147*m+1.7076147010*s
        if all(-0.001<=x<=1.001 for x in (r,g,bl)): break
        a*=0.95; b*=0.95
    return rgb2hex([l2s(r),l2s(g),l2s(bl)])
def lum(h): r,g,b=[s2l(x) for x in hex2rgb(h)]; return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): x,y=sorted([lum(a),lum(b)],reverse=True); return (x+0.05)/(y+0.05)
STEPS=[50,100,200,300,400,500,600,700,800,900]
LADDER={50:.975,100:.945,200:.89,300:.82,400:.735,500:.64,600:.55,700:.47,800:.385,900:.30}
CHROMA={50:.18,100:.3,200:.5,300:.75,400:1,500:1,600:.95,700:.85,800:.75,900:.65}
def ramp(anchor, step, Lshift=0):
    L0,C0,H=rgb2oklch(anchor); off=L0-LADDER[step]
    out={}
    for s in STEPS:
        L=LADDER[s]+off*(1-abs(STEPS.index(s)-STEPS.index(step))/9)
        out[s]=oklch2hex(L,C0*CHROMA[s]/CHROMA[step],H)
    out[step]=anchor.upper(); return out
teal=ramp('#2AAFCC',400)
plum=ramp('#592C7B',700)
# Slate neutral: hue/chroma from #69737D; exact anchors at 100/500/900
L,C,H=rgb2oklch('#69737D')
NL={0:1,25:.988,50:.975,100:None,200:.87,300:.79,400:.68,500:None,600:.47,700:.40,800:.335,900:None,950:.21}
slate={}
for s,l in NL.items(): slate[s]=oklch2hex(l,C*(0.35 if l and l>.95 else 0.9),H) if l else None
slate[0]='#FFFFFF'; slate[100]='#E8EBEC'; slate[500]='#69737D'; slate[900]='#25313E'
slate[800]=oklch2hex((rgb2oklch('#25313E')[0]+rgb2oklch('#69737D')[0]*0.0+0.06),rgb2oklch('#25313E')[1],rgb2oklch('#25313E')[2])
slate[950]=oklch2hex(rgb2oklch('#25313E')[0]-0.07,rgb2oklch('#25313E')[1]*0.9,rgb2oklch('#25313E')[2])
print(json.dumps({'teal':teal,'plum':plum,'slate':dict(sorted(slate.items()))},indent=1))
if len(sys.argv)>1:
    for a,b in [x.split(':') for x in sys.argv[1:]]: print(a,b,round(cr(a,b),2))
