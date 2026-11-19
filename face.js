// Face landmark overlay on the portrait (points from face-data.js, found by MediaPipe).
// At rest only corner brackets frame the face. Every few seconds a scan line sweeps
// down and landmarks glow briefly as it passes, then fade. Hover or tap shows the mesh.
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
  const total = F.points.length;
  const counter = document.getElementById("lm-count");

  // Mesh, shown only on hover/focus via CSS.
  el("path", { class: "mesh", d: F.mesh });

  // Corner brackets instead of a full box, so the face stays unobstructed.
  const c = 34;
  const corners = [
    `M${bx} ${by + c}V${by}H${bx + c}`,
    `M${bx + bw - c} ${by}H${bx + bw}V${by + c}`,
    `M${bx + bw} ${by + bh - c}V${by + bh}H${bx + bw - c}`,
    `M${bx + c} ${by + bh}H${bx}V${by + bh - c}`,
  ].join("");
  el("path", { class: "brackets", d: corners });
  const tag = el("g", { class: "tag" });
  el("rect", { x: bx, y: by - 38, width: 128, height: 30, rx: 3 }, tag);
  el("text", { x: bx + 10, y: by - 16 }, tag).textContent = "face found";

  // Landmark points.
  const ptsG = el("g", { class: "pts" });
  const dots = F.points.map(([x, y]) => el("circle", { class: "pt", cx: x, cy: y, r: 2.4 }, ptsG));
  const line = el("line", { class: "scan", x1: bx - 10, x2: bx + bw + 10, y1: by, y2: by });

  // Tap toggles the mesh on touch screens.
  const frame = svg.parentElement;
  frame.addEventListener("click", () => frame.classList.toggle("show-mesh"));

  if (reduce) {
    if (counter) counter.textContent = total;
    line.style.display = "none";
    return;
  }

  // Scan timing.
  const SWEEP = 2000, FADE = 900, REST = 5200, PERIOD = SWEEP + FADE + REST;
  const top = by, bottom = by + bh;
  const passAt = F.points.map(([, y]) => ((y - top) / (bottom - top)) * SWEEP);

  let visible = true, start = null, raf = null;
  const tick = (now) => {
    if (start === null) start = now - PERIOD + 900; // first scan starts just after load
    const t = (now - start) % PERIOD;
    const sweeping = t < SWEEP;
    if (sweeping) {
      const y = top + (t / SWEEP) * (bottom - top);
      line.setAttribute("y1", y); line.setAttribute("y2", y);
      line.style.opacity = 1;
    } else {
      line.style.opacity = 0;
    }
    let lit = 0;
    for (let i = 0; i < total; i++) {
      const dt = t - passAt[i];
      let o = 0;
      if (dt >= 0) { lit++; o = Math.max(0, 1 - dt / FADE); }
      dots[i].style.opacity = o.toFixed(2);
    }
    if (counter) counter.textContent = t < SWEEP + FADE ? lit : total;
    raf = visible && !document.hidden ? requestAnimationFrame(tick) : null;
  };
  const resume = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); };

  // Pause when off-screen or in a background tab.
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; resume(); }).observe(svg);
  document.addEventListener("visibilitychange", resume);
  resume();
})();
