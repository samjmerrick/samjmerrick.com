// Draws a synthetic fingerprint ridge map with a detection box and minutiae markers,
// in the style of a computer vision model's annotation overlay.
(function () {
  const svg = document.getElementById("ridges");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Seeded PRNG so the print is the same on every visit.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const cx = 200, cy = 225;
  const el = (name, attrs) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  // Fingertip-shaped clip: rounded top, narrower base.
  const clipId = "tip";
  const defs = el("defs", {});
  const clip = el("clipPath", { id: clipId });
  clip.appendChild(el("path", {
    d: "M200 40 C 300 40 345 120 345 220 C 345 330 300 420 200 420 C 100 420 55 330 55 220 C 55 120 100 40 200 40 Z"
  }));
  defs.appendChild(clip);
  svg.appendChild(defs);

  const ridgeGroup = el("g", { "clip-path": `url(#${clipId})` });
  svg.appendChild(ridgeGroup);

  const ridges = [];
  const rings = 30;
  for (let i = 0; i < rings; i++) {
    const r = 9 + i * 7.6;
    const phase = rand() * Math.PI * 2;
    const gapStart = rand() * Math.PI * 2;
    const gap = i < 3 ? 0.6 : 0.12 + rand() * 0.35;
    const pts = [];
    const steps = 140;
    for (let s = 0; s <= steps; s++) {
      const t = gapStart + gap + (s / steps) * (Math.PI * 2 - gap);
      const wobble = 1 + 0.07 * Math.sin(3 * t + phase) + 0.035 * Math.sin(7 * t + i * 0.5);
      // Loop pattern: stretch vertically and pull the lower half into a delta.
      const sy = 1.22 + 0.12 * Math.max(0, Math.sin(t));
      const x = cx + r * wobble * Math.cos(t) * (1 + 0.04 * Math.sin(t * 2));
      const y = cy - 18 + r * wobble * Math.sin(t) * sy;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const path = el("path", { class: "ridge", d: "M" + pts.join(" L") });
    ridgeGroup.appendChild(path);
    ridges.push(path);
  }

  // Detection box around the core region.
  const box = el("g", { class: "overlay" });
  box.appendChild(el("rect", { class: "box", x: 92, y: 98, width: 216, height: 236 }));
  const label = el("g", { class: "box-label" });
  label.appendChild(el("rect", { x: 92, y: 78, width: 114, height: 20 }));
  const txt = el("text", { x: 99, y: 92 });
  txt.textContent = "core region 0.94";
  label.appendChild(txt);
  box.appendChild(label);

  // Minutiae: ridge endings and bifurcations, drawn as a circle with a direction tail.
  const minutiae = [
    [150, 160, -40], [252, 172, 30], [176, 268, 110], [238, 290, 70],
    [130, 236, 200], [270, 236, -10], [205, 140, -90], [196, 318, 95],
  ];
  const marks = minutiae.map(([x, y, a]) => {
    const g = el("g", {});
    g.appendChild(el("circle", { class: "minutia", cx: x, cy: y, r: 5 }));
    const rad = (a * Math.PI) / 180;
    g.appendChild(el("line", {
      class: "minutia-tail", x1: x + 5 * Math.cos(rad), y1: y + 5 * Math.sin(rad),
      x2: x + 15 * Math.cos(rad), y2: y + 15 * Math.sin(rad),
    }));
    box.appendChild(g);
    return g;
  });
  svg.appendChild(box);

  const counter = document.getElementById("minutiae-count");
  if (reduce) {
    if (counter) counter.textContent = minutiae.length;
    return;
  }

  // One orchestrated moment: ridges trace in from the core, then the model "detects".
  ridges.forEach((p, i) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.animate(
      [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration: 900, delay: i * 35, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" }
    );
  });
  const t0 = rings * 35 + 500;
  box.style.opacity = 0;
  box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: t0, fill: "forwards" });
  label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: t0 + 150, fill: "backwards" });
  marks.forEach((m, i) => {
    m.style.opacity = 0;
    m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: t0 + 250 + i * 110, fill: "forwards" })
      .onfinish = () => { if (counter) counter.textContent = i + 1; };
  });
})();
