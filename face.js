// Overlays the MediaPipe face landmarks (see face-data.js) on the portrait:
// detection box first, then the mesh and contours, like a model's output.
(function () {
  const svg = document.getElementById("face");
  const F = window.FACE;
  if (!svg || !F) return;
  const NS = "http://www.w3.org/2000/svg";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (name, attrs, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n);
    return n;
  };

  const [bx, by, bw, bh] = F.box;
  const boxG = el("g", {});
  el("rect", { class: "box", x: bx, y: by, width: bw, height: bh }, boxG);
  const tag = el("g", { class: "tag" }, boxG);
  el("rect", { x: bx - 1.5, y: by - 36, width: 128, height: 36 }, tag);
  el("text", { x: bx + 10, y: by - 11 }, tag).textContent = "face found";

  const mesh = el("path", { class: "mesh", d: F.mesh });
  const contours = el("path", { class: "contour", d: F.contours });
  const ptsG = el("g", {});
  F.points.forEach(([x, y], i) => {
    if (i % 3 === 0) el("circle", { class: "pt", cx: x, cy: y, r: 2.2 }, ptsG);
  });

  const counter = document.getElementById("lm-count");
  const total = F.points.length;
  if (reduce) { if (counter) counter.textContent = total; return; }

  const fade = (node, delay, dur) => {
    node.style.opacity = 0;
    node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, delay, fill: "forwards", easing: "ease-out" });
  };
  fade(boxG, 400, 150);
  fade(ptsG, 700, 500);
  fade(mesh, 1000, 900);
  const len = contours.getTotalLength();
  contours.style.strokeDasharray = len;
  contours.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
    { duration: 1400, delay: 1000, easing: "cubic-bezier(.3,.7,.2,1)", fill: "both" });

  if (counter) {
    const t0 = performance.now() + 700, dur = 1200;
    const tick = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / dur));
      counter.textContent = Math.round(k * total);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
