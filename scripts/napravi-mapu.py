#!/usr/bin/env python3
# Crta mapu oko radnje iz OpenStreetMap izvoza (Overpass JSON): public/img/v2/mapa-lokacija.svg + src/data/mapa.json
# python3 -I scripts/napravi-mapu.py osm.json
import json, math, sys
from collections import defaultdict

PIN = (44.72733, 20.42626)
SIR, VIS = 4200, 1400          # 1 jedinica = 0,5 m
PX, PY = SIR * 0.5, VIS * 0.54 # gde pin stoji u kadru
ULICA_RADNJE = "Једанаесте крајишке дивизије"
ZGRADA_RADNJE = 466648510
K_LAT = 111320.0 * 2
K_LON = 111320.0 * 2 * math.cos(math.radians(PIN[0]))

def tacka(g): return (PX + (g["lon"] - PIN[1]) * K_LON, PY - (g["lat"] - PIN[0]) * K_LAT)
def okvir(ts, m=60): return any(-m <= x <= SIR + m and -m <= y <= VIS + m for x, y in ts)

def uprosti(ts, e):
    if len(ts) < 3: return ts
    (ax, ay), (bx, by) = ts[0], ts[-1]
    dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy) or 1
    i, m = 0, -1
    for j in range(1, len(ts) - 1):
        d = abs(dy * (ts[j][0] - ax) - dx * (ts[j][1] - ay)) / L
        if d > m: i, m = j, d
    if m <= e: return [ts[0], ts[-1]]
    return uprosti(ts[:i + 1], e)[:-1] + uprosti(ts[i:], e)

def uprosti_oblik(ts, e):
    # Zatvoren oblik počinje i završava istom tačkom, pa se deli na dva dela pre uprošćavanja
    p = len(ts) // 2
    return uprosti(ts[:p + 1], e)[:-1] + uprosti(ts[p:], e)

def put(ts, zatvori=False):
    q = [(round(x), round(y)) for x, y in ts]
    d = f"M{q[0][0]} {q[0][1]}"; px, py = q[0]
    for x, y in q[1:]:
        if (x, y) == (px, py): continue
        d += f"l{x - px} {y - py}"; px, py = x, y
    return d + ("z" if zatvori else "")

osm = json.load(open(sys.argv[1]))["elements"]
sloj = defaultdict(list); lanci = defaultdict(list); zgrada = None
KLASE = {"motorway": "a", "trunk": "a", "motorway_link": "b", "primary": "a", "primary_link": "b", "secondary": "b", "secondary_link": "c", "tertiary": "c", "tertiary_link": "c", "unclassified": "d", "residential": "d", "service": "e", "track": "e", "footway": "f", "path": "f", "steps": "f"}
for el in osm:
    if el["type"] != "way" or "geometry" not in el: continue
    t = el.get("tags", {}); ts = [tacka(g) for g in el["geometry"]]
    if not okvir(ts): continue
    zatv = len(ts) > 3 and el["geometry"][0] == el["geometry"][-1]
    if el["id"] == ZGRADA_RADNJE: zgrada = put(ts, True)
    if "building" in t and zatv: sloj["zgrada"].append(put(uprosti_oblik(ts, 1.2), True))
    elif t.get("natural") == "water" and zatv: sloj["voda"].append(put(ts, True))
    elif "waterway" in t: sloj["reka" if t["waterway"] == "river" else "potok"].append(put(uprosti(ts, 3)))
    elif (t.get("natural") in ("wood", "scrub") or t.get("landuse") in ("forest", "orchard", "allotments", "meadow", "grass", "recreation_ground", "cemetery") or t.get("leisure") in ("park", "garden", "pitch")) and zatv:
        sloj["zelenilo"].append(put(uprosti_oblik(ts, 3), True))
    elif t.get("railway") == "rail": sloj["pruga"].append(put(uprosti(ts, 2)))
    elif t.get("highway") in KLASE and t.get("tunnel") != "yes":
        sloj[KLASE[t["highway"]]].append(put(uprosti(ts, 1)))
        if t.get("name") == ULICA_RADNJE: sloj["radnja"].append(put(uprosti(ts, 1)))
        if t.get("name") and KLASE[t["highway"]] in "abcd":
            lanci[t.get("name:sr-Latn") or t["name"]].append((KLASE[t["highway"]], ts))

STIL = [("zelenilo", 'fill="#dfe8d3"'), ("voda", 'fill="#bcd8ea"'), ("reka", 'fill="none" stroke="#bcd8ea" stroke-width="26"'), ("potok", 'fill="none" stroke="#c9e0ee" stroke-width="7"'), ("zgrada", 'fill="#e6e2d8"'), ("f", 'fill="none" stroke="#fbfaf6" stroke-width="3" stroke-dasharray="7 6"'), ("pruga", 'fill="none" stroke="#b9b6ad" stroke-width="4" stroke-dasharray="16 11"')]
OSE = [("e", 8, "#fff", "#dcd8cd"), ("d", 15, "#fff", "#d8d3c7"), ("c", 22, "#fff", "#d2cdc0"), ("b", 28, "#f8e4bd", "#e4c78f"), ("a", 38, "#f2c98a", "#d9a862")]
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIR} {VIS}" preserveAspectRatio="xMidYMid slice"><rect width="{SIR}" height="{VIS}" fill="#f5f3ed"/>']
for ime, s in STIL:
    if sloj[ime]: o.append(f'<path {s} d="{"".join(sloj[ime])}"/>')
o.append('<g fill="none" stroke-linecap="round" stroke-linejoin="round">')
for k, sir, _, oiv in OSE:
    if sloj[k]: o.append(f'<path stroke="{oiv}" stroke-width="{sir + 5}" d="{"".join(sloj[k])}"/>')
for k, sir, boja, _ in OSE:
    if sloj[k]: o.append(f'<path stroke="{boja}" stroke-width="{sir}" d="{"".join(sloj[k])}"/>')
o.append(f'<path stroke="#ea5530" stroke-width="9" d="{"".join(sloj["radnja"])}"/></g>')
o.append("</svg>")
open("public/img/v2/mapa-lokacija.svg", "w").write("".join(o))

# Nazivi: najduži neprekinuti deo svake ulice koji je u kadru, tekst uvek čita sleva nadesno
def spoji(delovi):
    delovi = [d[:] for d in delovi]; najb = []
    while delovi:
        c = delovi.pop(); ide = True
        while ide:
            ide = False
            for d in delovi:
                bl = lambda a, b: math.hypot(a[0] - b[0], a[1] - b[1]) < 2
                if bl(c[-1], d[0]): c += d[1:]
                elif bl(c[-1], d[-1]): c += d[::-1][1:]
                elif bl(c[0], d[-1]): c = d + c[1:]
                elif bl(c[0], d[0]): c = d[::-1] + c[1:]
                else: continue
                delovi.remove(d); ide = True; break
        najb.append(c)
    return najb
def duz(ts): return sum(math.hypot(ts[i][0] - ts[i + 1][0], ts[i][1] - ts[i + 1][1]) for i in range(len(ts) - 1))
natpisi = []
for ime, dd in lanci.items():
    rang = min(k for k, _ in dd)
    best = None
    for c in spoji([t for _, t in dd]):
        u = [p for p in c if 40 <= p[0] <= SIR - 40 and 40 <= p[1] <= VIS - 40]
        # samo neprekinut deo u kadru
        delovi = []; tek = []
        for p in c:
            if 40 <= p[0] <= SIR - 40 and 40 <= p[1] <= VIS - 40: tek.append(p)
            else:
                if tek: delovi.append(tek)
                tek = []
        if tek: delovi.append(tek)
        for d in delovi:
            if len(d) > 1 and (best is None or duz(d) > duz(best)): best = d
    if not best: continue
    nazivna = len(ime) * 15.5
    if duz(best) < nazivna * 1.15: continue
    p = uprosti(best, 14)
    if p[0][0] > p[-1][0]: p = p[::-1]
    natpisi.append({"naziv": ime, "rang": rang, "d": put(p), "duz": round(duz(best))})
natpisi.sort(key=lambda n: (n["rang"], -n["duz"]))
json.dump({"sir": SIR, "vis": VIS, "pin": [round(PX), round(PY)], "zgrada": zgrada, "natpisi": natpisi}, open("src/data/mapa.json", "w"), ensure_ascii=False)
import os; print("svg KB", os.path.getsize("public/img/v2/mapa-lokacija.svg") // 1024, "zgrada", bool(zgrada), [(n["naziv"], n["rang"]) for n in natpisi][:40])
