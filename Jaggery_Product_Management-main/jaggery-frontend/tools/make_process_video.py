import math, sys, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, K, FPS = 1280, 720, 2, 24
FD = "/usr/share/fonts/truetype/google-fonts/"
GOLD, GOLD4, GOLD1 = (217, 151, 72), (232, 176, 107), (251, 230, 200)
BROWN = (44, 24, 16)
clamp = lambda v, a=0.0, b=1.0: max(a, min(b, v))
lerp = lambda a, b, u: tuple(int(a[i] + (b[i] - a[i]) * u) for i in range(3))

_fonts = {}
def font(sz, bold=False):
    k = (sz, bold)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype(FD + ("Poppins-Bold.ttf" if bold else "Poppins-Regular.ttf"), int(sz * K))
    return _fonts[k]

_bg = {}
def grad(top, bot):
    k = (top, bot)
    if k not in _bg:
        a = np.linspace(0, 1, H * K)[:, None, None]
        arr = (np.array(top) * (1 - a) + np.array(bot) * a).astype("uint8")
        _bg[k] = Image.fromarray(np.repeat(arr, W * K, axis=1), "RGB")
    return _bg[k]

class C:
    def __init__(s, bg):
        s.im = bg.copy(); s.d = ImageDraw.Draw(s.im, "RGBA")
    def _p(s, pts): return [v * K for p in pts for v in p]
    def rect(s, b, r=0, fill=None, out=None, w=1): s.d.rounded_rectangle([v * K for v in b], radius=r * K, fill=fill, outline=out, width=int(w * K))
    def ell(s, b, fill=None, out=None, w=1): s.d.ellipse([v * K for v in b], fill=fill, outline=out, width=int(w * K))
    def circ(s, x, y, r, fill, out=None, w=1): s.ell((x - r, y - r, x + r, y + r), fill, out, w)
    def poly(s, pts, fill): s.d.polygon(s._p(pts), fill=fill)
    def line(s, pts, fill, w=2): s.d.line(s._p(pts), fill=fill, width=int(w * K), joint="curve")
    def pie(s, b, a0, a1, fill): s.d.pieslice([v * K for v in b], a0, a1, fill=fill)
    def text(s, xy, t, sz, fill, bold=False, anchor="la"): s.d.text((xy[0] * K, xy[1] * K), t, font=font(sz, bold), fill=fill, anchor=anchor)

def quad(cx, cy, w, h, ang):
    dx, dy, nx, ny = math.sin(ang), -math.cos(ang), math.cos(ang), math.sin(ang)
    return [(cx + dx * h / 2 * a + nx * w / 2 * b, cy + dy * h / 2 * a + ny * w / 2 * b) for a, b in ((1, 1), (1, -1), (-1, -1), (-1, 1))]

def block(c, x, y, w=100, h=70):
    c.rect((x - w / 2, y - h / 2 + 5, x + w / 2, y + h / 2 + 5), 12, (120, 70, 25))
    c.rect((x - w / 2, y - h / 2, x + w / 2, y + h / 2), 12, (205, 135, 50))
    c.rect((x - w / 2 + 8, y - h / 2 + 7, x + w / 2 - 22, y - h / 2 + 18), 5, (240, 190, 110, 160))

# ---------------- scenes ----------------
def intro(c, t, T):
    c.circ(640, 330, 230 + 14 * math.sin(t * 2), (255, 220, 150, 40))
    c.circ(640, 330, 150, (255, 220, 150, 60))
    for i in range(5):
        block(c, 250 + i * 195, 130 + 22 * math.sin(t * 2 + i) + (i % 2) * 380, 90, 62)
    a = int(255 * clamp(t / 0.8)); off = 30 * (1 - clamp(t / 0.8))
    c.text((640, 280 + off), "How Jaggery Is Made", 76, BROWN + (a,), True, "mm")
    c.text((640, 370 + off), "From the cane field to your kitchen", 32, (110, 80, 60, a), False, "mm")
    c.text((640, 470), "RILA GROUPS", 28, GOLD + (int(a * clamp((t - 0.8) / 0.6)),), True, "mm")

def harvest(c, t, T):
    GY = 470
    c.circ(1080, 150, 70, (255, 236, 170)); c.circ(1080, 150, 100, (255, 236, 170, 60))
    c.ell((-200, 380, 700, 700), (137, 170, 98)); c.ell((500, 360, 1500, 720), (112, 150, 80))
    c.rect((0, GY, 1280, 720), 0, (96, 70, 40))
    N, done, bladex = 12, 0, None
    for i in range(N):
        x = 100 + i * 62; ct = 0.4 + i * (T - 1.6) / N
        if t >= ct + 0.5: done += 1; continue
        ang = 0.04 * math.sin(t * 2.2 + i)
        if t >= ct:
            p = (t - ct) / 0.5; ang = p * 1.4; bladex = x
        L = 300; cx, cy = x + math.sin(ang) * L / 2, GY - math.cos(ang) * L / 2
        c.poly(quad(cx, cy, 16, L, ang), (150, 168, 62))
        for k in range(1, 6):
            px, py = x + math.sin(ang) * k * 50, GY - math.cos(ang) * k * 50
            c.line([(px - 8, py), (px + 8, py)], (110, 125, 45), 3)
        tx, ty = x + math.sin(ang) * 285, GY - math.cos(ang) * 285
        for s in (-1, 1): c.line([(tx, ty), (tx + s * 62, ty + 30 + 6 * math.sin(t * 3 + i))], (92, 140, 60), 6)
    for k in range(done):
        o = 12 * (k % 2); c.rect((950 + o, GY - 12 - k * 9, 1180 + o, GY - 4 - k * 9), 4, (150, 168, 62), (110, 125, 45), 2)
    if bladex is not None:
        a = -1.1 + 2.2 * ((t - 0.4) * 2 % 1)
        c.poly(quad(bladex - 50, GY - 40, 16, 110, a), (200, 205, 215)); c.poly(quad(bladex - 50 - 60 * math.sin(a), GY - 40 + 60 * math.cos(a), 12, 50, a), (110, 70, 40))

def crush(c, t, T):
    c.rect((560, 170, 590, 470), 4, (50, 36, 30)); c.rect((810, 170, 840, 470), 4, (50, 36, 30)); c.rect((520, 150, 880, 180), 6, (50, 36, 30))
    for k in range(4):
        xc = (t * 150 + k * 250) % 1100 - 100
        l, r = xc - 70, xc + 70
        if l < 650: c.rect((l, 296, min(r, 650), 318), 8, (150, 168, 62), (110, 125, 45), 2)
        if r > 750: c.rect((max(l, 750), 303, r, 311), 3, (210, 190, 130))
    for cy, d in ((255, 1), (359, -1)):
        c.circ(700, cy, 52, (110, 112, 120), (70, 72, 78), 4)
        for s in range(6):
            a = t * 2.2 * d + s * math.pi / 3
            c.line([(700 + 8 * math.cos(a), cy + 8 * math.sin(a)), (700 + 46 * math.cos(a), cy + 46 * math.sin(a))], (170, 172, 180), 4)
        c.circ(700, cy, 10, (60, 60, 66))
    c.rect((610, 470, 790, 560), 10, (80, 82, 90), (60, 60, 66), 3)
    lvl = 80 * clamp(t / T) * 0.85
    c.rect((616, 556 - lvl, 784, 556), 6, (214, 190, 90))
    for j in range(6):
        ph = (t * 1.4 + j / 6) % 1
        c.circ(700 + 6 * math.sin(j * 2), 411 + ph * 70, 5, (225, 200, 100))
    c.text((260, 230), "Sugarcane", 24, (255, 240, 220, 230), True, "mm"); c.text((920, 230), "Bagasse", 24, (255, 240, 220, 230), True, "mm"); c.text((700, 580 - 8), "", 1, BROWN)
    c.text((870, 510), "Fresh juice", 24, (255, 240, 220, 230), True, "lm")

def pan(c, t, cu):
    for i in range(9):
        x = 470 + i * 50; h = 60 + 25 * math.sin(t * 9 + i * 1.7) + 15 * math.sin(t * 13 + i)
        c.poly([(x - 24, 545), (x, 545 - h), (x + 24, 545)], (240, 110, 30, 220)); c.poly([(x - 12, 545), (x, 545 - h * 0.6), (x + 12, 545)], (255, 210, 80, 230))
    c.rect((420, 538, 860, 562), 6, (40, 28, 24))
    c.pie((390, 160, 890, 460), 0, 180, (62, 56, 54)); c.rect((365, 296, 400, 314), 5, (90, 80, 76)); c.rect((880, 296, 915, 314), 5, (90, 80, 76))
    c.ell((390, 285, 890, 335), (110, 108, 112)); c.ell((405, 292, 875, 328), lerp((205, 185, 80), (150, 80, 22), cu))

def bubbles_steam(c, t):
    for j in range(26):
        x = 470 + (j * 131) % 340; ph = (t * 0.8 + j * 0.173) % 1
        c.circ(x, 306 + (j * 53) % 21, 3 + 9 * ph, (255, 240, 190, int(200 * (1 - ph))))
    for j in range(7):
        ph = (t * 0.35 + j / 7) % 1
        c.circ(520 + j * 40 + math.sin(ph * 6 + j) * 18, 270 - ph * 190, 14 + 22 * ph, (255, 255, 255, int(70 * (1 - ph))))

def boil(c, t, T):
    pan(c, t, clamp(t / T) * 0.7); bubbles_steam(c, t)
    c.text((640, 100), "Simmering for hours…", 30, (255, 240, 220, 220), True, "mm")

def clarify(c, t, T):
    pan(c, t, 0.7 + 0.3 * clamp(t / T)); bubbles_steam(c, t)
    lx = lambda s: 640 + math.sin(s * 1.7) * 170
    for j in range(16):
        bx, by = 480 + (j * 97) % 320, 305 + (j * 41) % 28 - 8
        gone = next((s / FPS for s in range(int(t * FPS) + 1) if abs(lx(s / FPS) - bx) < 30 and s / FPS > 0.5), None)
        sc = 1 if gone is None else 1 - clamp((t - gone) / 0.35)
        if sc > 0.02: r = 14 * sc * (0.6 + ((j * 7) % 5) / 10); c.circ(bx, by, r, (240, 225, 190, 235)); c.circ(bx - r / 3, by - r / 3, r / 3, (255, 255, 255, 200))
    x = lx(t); c.line([(x, 300), (x + 260, 90)], (150, 110, 70), 9); c.ell((x - 30, 294, x + 30, 320), (180, 180, 186))
    c.text((640, 100), "Skimming off the impurities", 30, (255, 240, 220, 220), True, "mm")

def mould(c, t, T):
    c.rect((60, 470, 1220, 505), 8, (110, 74, 44)); seg = (T - 1.0) / 5
    cur = int(clamp((t - 0.4) / seg, 0, 4.99))
    for i in range(5):
        mx = 120 + i * 230; f = clamp((t - 0.4 - i * seg) / seg)
        c.rect((mx, 360, mx + 130, 470), 10, (40, 28, 22), (90, 64, 48), 4)
        if f > 0: c.rect((mx + 6, 464 - 98 * f, mx + 124, 464), 6, lerp((225, 160, 70), (190, 120, 40), clamp((t - T + 1.5) / 1.5)))
    mx = 120 + cur * 230; f = clamp((t - 0.4 - cur * seg) / seg)
    if t < T - 0.8:
        px = mx - 35 + 10 * math.sin(t * 3)
        c.rect((px - 90, 110, px + 70, 200), 22, (62, 56, 54)); c.poly([(px + 60, 130), (px + 118, 192), (px + 70, 180)], (62, 56, 54)); c.rect((px - 70, 118, px + 50, 134), 6, (225, 160, 70))
        c.line([(px + 112, 190), (mx + 65, 462 - 98 * f)], (225, 160, 70), 9)

def pack(c, t, T):
    c.rect((0, 400, 980, 440), 0, (70, 52, 44)); c.rect((0, 440, 980, 456), 0, (50, 36, 30))
    for k in range(22): x = (k * 50 + t * 180) % 1000; c.line([(x, 404), (x, 436)], (95, 74, 62), 3)
    for k in range(5):
        x = (t * 180 + k * 220) % 1100 - 100
        if x < 900: block(c, x, 362)
    c.rect((890, 300, 1190, 520), 4, (160, 118, 72)); c.rect((900, 330, 1180, 520), 4, (196, 150, 98), (140, 100, 60), 3)
    c.text((1040, 410), "RILA GROUPS", 26, BROWN, True, "mm"); c.text((1040, 450), "100% NATURAL", 22, (110, 70, 40), True, "mm")
    p = clamp((t - T * 0.6) / 1.2)
    if p > 0: y = 190 + 100 * p; c.rect((885, y, 1195, y + 36), 4, (176, 132, 82), (140, 100, 60), 3)
    if t > T - 1.4:
        a = clamp((t - T + 1.4) / 0.5); c.circ(1040, 240, 40 * a, (92, 122, 74)); c.line([(1020, 240), (1035, 256), (1062, 222)], (255, 255, 255, int(255 * a)), 7)

def outro(c, t, T):
    c.circ(640, 330, 240 + 12 * math.sin(t * 2), (255, 220, 150, 40))
    a = int(255 * clamp(t / 0.8))
    block(c, 640, 220 + 8 * math.sin(t * 2), 150, 100)
    c.text((640, 360), "Pure. Traditional. Preservative-free.", 44, BROWN + (a,), True, "mm")
    c.text((640, 430), "Rila Groups", 36, GOLD + (a,), True, "mm")
    c.text((640, 490), "Explore our jaggery products at the store", 26, (110, 80, 60, a), False, "mm")

STAGES = [
    ("harvest", harvest, "Harvest", "Mature sugarcane is cut by hand at 10-12 months, stripped of leaves and carried to the mill the same day.", ((255, 214, 160), (255, 240, 214))),
    ("crush", crush, "Crush", "Cane is pressed between heavy rollers. The fresh juice is strained through cloth to remove fibre.", ((96, 58, 40), (58, 34, 24))),
    ("boil", boil, "Boil", "Juice simmers in large open pans for a few hours, thickening as the water evaporates.", ((70, 42, 30), (36, 22, 16))),
    ("clarify", clarify, "Clarify", "Impurities rise as foam and are skimmed off. Plant extracts like okra are traditionally used as natural clarifiers.", ((70, 42, 30), (36, 22, 16))),
    ("mould", mould, "Mould", "The thick golden syrup is poured into moulds, or stirred until it turns into powder or granules.", ((120, 82, 56), (74, 48, 34))),
    ("pack", pack, "Cool & Pack", "Cooled, graded and packed in eco-friendly packaging, ready for your kitchen.", ((255, 248, 236), (251, 232, 205))),
]
WARM = ((255, 244, 226), (251, 224, 186))
SCENES = [("intro", intro, 3.5, WARM, None)] + [(n, f, 5.5, bg, (i, title, txt)) for i, (n, f, title, txt, bg) in enumerate(STAGES)] + [("outro", outro, 3.5, WARM, None)]
TOTAL = sum(s[2] for s in SCENES)

def wrap(text, sz, maxw):
    f, words, lines, cur = font(sz), text.split(), [], ""
    for w in words:
        if f.getlength((cur + " " + w).strip()) / K > maxw: lines.append(cur); cur = w
        else: cur = (cur + " " + w).strip()
    return lines + [cur]

def frame(gt):
    t0 = 0
    for name, fn, T, bg, cap in SCENES:
        if gt < t0 + T or name == "outro": break
        t0 += T
    t = gt - t0
    c = C(grad(*bg)); fn(c, t, T)
    if cap:
        i, title, txt = cap; a = int(255 * clamp(t / 0.6))
        c.rect((0, 570, W, H), 0, (44, 24, 16, 236))
        c.text((48, 586), f"STEP {i + 1} OF 6", 17, GOLD4 + (a,), True)
        c.text((48, 608), title, 36, (255, 255, 255, a), True)
        for n, ln in enumerate(wrap(txt, 21, 1180)): c.text((48, 660 + n * 28), ln, 21, (253, 243, 231, int(a * 0.9)))
    c.rect((0, 716, W * gt / TOTAL, 720), 0, GOLD)
    img = c.im.reduce(K)
    fade = 1 - clamp(t / 0.35) if t < 0.35 else (clamp((t - (T - 0.35)) / 0.35) if name == "outro" else 0)
    if fade > 0: img = Image.blend(img, Image.new("RGB", (W, H), BROWN), fade * 0.9)
    return img

if __name__ == "__main__":
    if sys.argv[1] == "stills":
        for gt in map(float, sys.argv[2:]): frame(gt).save(f"/home/claude/vid/still_{gt:05.1f}.png")
    else:
        p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                              "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", sys.argv[1]], stdin=subprocess.PIPE)
        for f in range(int(TOTAL * FPS)): p.stdin.write(frame(f / FPS).tobytes())
        p.stdin.close(); p.wait()
