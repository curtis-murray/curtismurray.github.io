// Deterministic ridgeline geometry for the mountain backdrop + topographic
// overlay. Pure functions, run at build time in Astro frontmatter — no client
// JS. Ridgelines are a small sum of sine octaves with seeded phases so they
// look natural but render identically every build.

const TAU = Math.PI * 2;

// Tiny seeded LCG → repeatable "random" phases.
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * Sample a ridgeline as [x, y] points across width W.
 * @param {object} o
 * @param {number} o.baseline  mean y of the ridge (smaller = higher on screen)
 * @param {number} o.amp       peak amplitude in px
 * @param {number} o.seed      phase seed
 * @param {number} [o.width]   svg user-space width
 * @param {number} [o.samples] point count
 */
export function ridge({ baseline, amp, seed, width = 1440, samples = 36, bleed = 0 }) {
  const rnd = rng(seed);
  // freq multiplier, relative amplitude
  const octaves = [
    [1, 1],
    [2.0, 0.5],
    [3.7, 0.27],
    [6.3, 0.13],
  ];
  const phases = octaves.map(() => rnd() * TAU);
  const span = width + bleed * 2;
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    let y = baseline;
    octaves.forEach(([f, a], k) => {
      y -= amp * a * Math.sin(t * TAU * f + phases[k]);
    });
    // sample from -bleed to width+bleed so a drifting ridge never exposes an edge
    pts.push([-bleed + t * span, y]);
  }
  return pts;
}

// Catmull-Rom → cubic bézier, for smooth ridges.
function curve(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || pts[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(
      1
    )} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Closed silhouette path (ridge + down to baseline floor), closing at the
 *  ridge's actual horizontal extents (which include any bleed). */
export function ridgePath(opts, { floor = 600 } = {}) {
  const pts = ridge(opts);
  const x0 = pts[0][0];
  const x1 = pts[pts.length - 1][0];
  return `${curve(pts)} L${x1.toFixed(1)},${floor} L${x0.toFixed(1)},${floor} Z`;
}

/** Open stroke path (for topographic overlay lines). */
export function linePath(opts) {
  return curve(ridge(opts));
}
