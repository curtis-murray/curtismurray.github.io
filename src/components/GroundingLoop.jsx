import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// An abstract, slightly tongue-in-cheek dramatisation of the through-line: an
// agent gets a question, forms a hypothesis, but instead of confidently
// guessing it consults a knowledge graph — which confirms two of its guesses
// and corrects the third. The model proposes; the graph disposes.
//
// Domain-free placeholders (foo / bar / baz → qux). framer-motion only here.

// Steps: 1 ask · 2 ack · 3 hypothesise (+graph blooms) · 4 tool call (+zoom)
// 5 graph reveals · 6 correction · 7 tool log · 8 answer · 9 trajectory log
const MAX = 9;

export default function GroundingLoop() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(MAX);
      return;
    }
    setStep(0);
    const timers = [];
    for (let s = 1; s <= MAX; s++) {
      timers.push(setTimeout(() => setStep(s), 500 + s * 1250));
    }
    return () => timers.forEach(clearTimeout);
  }, [runId, reduce]);

  const show = (n) => step >= n;

  return (
    <div className="rounded-3xl bg-base-100/75 backdrop-blur-md ring-1 ring-base-300/40 shadow-lg p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold tracking-[0.14em] text-base-content/45">
          a grounded agent, abridged
        </span>
        <button
          onClick={() => setRunId((n) => n + 1)}
          className="text-sm font-medium text-base-content/60 hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          replay
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-start">
        {/* ── transcript ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence>
            {show(1) && (
              <Bubble key="ask" who="user" reduce={reduce}>
                tell me about <b>xyz</b>
              </Bubble>
            )}
            {show(2) && (
              <Bubble key="ack" who="agent" reduce={reduce}>
                okay — they want to know about <b>xyz</b>.
                {step === 2 && <Thinking />}
              </Bubble>
            )}
            {show(3) && (
              <Bubble key="hyp" who="agent" reduce={reduce}>
                my hunch: xyz breaks into <b>x</b>, <b>y</b>, and <b>z</b>. but
                i'm not about to just <i>guess</i> — let me check the graph.
              </Bubble>
            )}
            {show(4) && <ToolCall key="call" reduce={reduce} />}
            {show(6) && (
              <Bubble key="fix" who="agent" reduce={reduce}>
                found <b>x</b> and <b>y</b> exactly as expected. but <b>z</b>{" "}
                isn't <b>baz</b> like i assumed — the graph says it's{" "}
                <b>qux</b>. good thing i looked.
              </Bubble>
            )}
            {show(7) && <ToolLog key="log" reduce={reduce} />}
            {show(8) && (
              <Bubble key="ans" who="agent" final reduce={reduce}>
                so: <b>xyz</b> is foo, bar, and qux — grounded, not guessed.
              </Bubble>
            )}
            {show(9) && <LogEntry key="trace" reduce={reduce} />}
          </AnimatePresence>
        </div>

        {/* ── knowledge graph ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-base-200/40 ring-1 ring-base-300/50 overflow-hidden h-[300px] md:h-[440px] flex items-center justify-center md:sticky md:top-24">
          <Graph step={step} reduce={reduce} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-base-content/65">
        the agent is allowed to be creative about <i>hypotheses</i> and never
        about <i>facts</i>. every claim resolves to a node that actually exists —
        so a confident wrong guess gets caught instead of shipped.
      </p>
    </div>
  );
}

function Bubble({ who, children, final, reduce }) {
  const isUser = who === "user";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "bg-primary text-primary-content rounded-br-sm"
            : final
              ? "bg-success/12 text-base-content ring-1 ring-success/40 rounded-bl-sm"
              : "bg-base-200/80 text-base-content/90 ring-1 ring-base-300/50 rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <span className="block text-[10px] font-semibold tracking-[0.14em] text-base-content/40 mb-1">
            agent
          </span>
        )}
        {children}
      </div>
    </motion.div>
  );
}

function Thinking() {
  return (
    <span className="mt-2 flex items-center gap-2 text-base-content/50 text-sm italic">
      consulting the thinking juice
      <span className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full bg-base-content/40"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </span>
    </span>
  );
}

function ToolCall({ reduce }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group relative inline-flex w-auto items-center gap-2 rounded-xl bg-base-200/70 ring-1 ring-base-300/60 px-4 py-2.5 font-mono text-[12.5px] text-base-content/85"
    >
      <span>
        <span className="text-primary">graph.lookup</span>(…)
      </span>
      <span className="text-base-content/45">// tool call</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="show tool call"
        className="ml-0.5 text-base-content/45 hover:text-primary transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {/* hover (desktop) or tap (mobile) → reveal the actual call */}
      <div
        className={`absolute left-0 top-full mt-2 z-30 w-max max-w-[340px] rounded-xl bg-base-100 ring-1 ring-base-300/70 shadow-xl px-4 py-3 leading-relaxed text-base-content/85 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        <span className="text-primary">graph.lookup</span>({"{"}
        <div className="pl-4">
          query: <span className="text-success">"what is xyz made of?"</span>,
        </div>
        <div className="pl-4">expect: {"{"}</div>
        <div className="pl-8">x: "foo", y: "bar",</div>
        <div className="pl-8">z: "baz?" <span className="text-base-content/45">// just a hunch</span></div>
        <div className="pl-4">{"}"}</div>
        {"}"})
      </div>
    </motion.div>
  );
}

function ToolLog({ reduce }) {
  const rows = [
    { k: "x", v: "foo", tone: "ok", note: "as expected" },
    { k: "y", v: "bar", tone: "ok", note: "as expected" },
    { k: "z", v: "qux", tone: "warn", note: "expected baz — corrected" },
  ];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-base-200/50 ring-1 ring-base-300/60 divide-y divide-base-300/40 overflow-hidden font-mono text-[12.5px]"
    >
      {rows.map((r) => (
        <div key={r.k} className="flex items-center justify-between gap-2 px-3.5 py-2">
          <span className="text-base-content/85">
            {r.k} → <b className="text-base-content">{r.v}</b>
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              r.tone === "ok"
                ? "bg-success/15 text-success"
                : "bg-warning/20 text-warning"
            }`}
          >
            {r.note}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// Closing observability stage: the agent writes a structured trajectory row —
// problem, reasoning, tool outcome, revised reasoning, and a self-assessed
// confidence that animates down to "confident".
function LogEntry({ reduce }) {
  const rows = [
    ["problem", 'resolve "xyz" into its parts'],
    ["reasoning", "hypothesised x, y, z — declined to guess"],
    ["tool", "graph.lookup → ok · 3 nodes hit"],
    ["revised", "z: baz → qux (grounded correction)"],
  ];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-base-200/45 ring-1 ring-base-300/60 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3.5 py-2 border-b border-base-300/40 text-xs font-semibold text-base-content/55">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
        trajectory logged
        <span className="ml-auto inline-flex items-center gap-1 text-success">✓ saved</span>
      </div>
      <div className="px-3.5 py-2.5 space-y-1.5 font-mono text-[12px] text-base-content/80">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="text-base-content/45 w-[64px] shrink-0">{k}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="flex gap-3 pt-0.5">
          <span className="text-base-content/45 w-[64px] shrink-0">confidence</span>
          <ConfidencePicker reduce={reduce} />
        </div>
      </div>
    </motion.div>
  );
}

function ConfidencePicker({ reduce }) {
  // actual order (best first); selector steps up from the bottom and settles on
  // "confident" at the top.
  const opts = ["confident", "uhhh?", "boy have i seen some things"];
  const TARGET = 0;
  const [sel, setSel] = useState(reduce ? TARGET : opts.length - 1);
  useEffect(() => {
    if (reduce) return;
    let cur = opts.length - 1;
    setSel(cur);
    const id = setInterval(() => {
      cur -= 1;
      if (cur < TARGET) {
        clearInterval(id);
        return;
      }
      setSel(cur);
    }, 720);
    return () => clearInterval(id);
  }, [reduce]);
  const landed = sel === TARGET;
  return (
    <div className="space-y-1">
      {opts.map((o, i) => {
        const active = i === sel;
        const best = i === TARGET;
        return (
          <div
            key={i}
            className={`flex items-center gap-2 transition-opacity duration-200 ${
              active ? "opacity-100" : landed ? "opacity-25" : "opacity-45"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                active ? (best ? "bg-success" : "bg-warning") : "bg-base-content/25"
              }`}
            />
            <span className={active && best ? "text-success font-semibold" : ""}>
              {o}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── knowledge graph ──────────────────────────────────────────────────────
// Cluster (focus + neighbours) centred on the viewBox so a simple scale about
// centre reads as a camera zoom; decoys (3× the cluster) fade out on zoom.
const FOCUS = {
  x: { p: [168, 134], label: "foo" },
  y: { p: [236, 150], label: "bar" },
  z: { p: [200, 206], label: "qux", was: "baz" },
};
const NEIGHBORS = [
  [132, 106], [148, 178], // around x
  [292, 126], [284, 188], // around y
  [156, 246], [252, 240], // around z
];
const NEIGHBOR_EDGES = [["x", 0], ["x", 1], ["y", 2], ["y", 3], ["z", 4], ["z", 5]];
const DECOYS = [
  [34, 40], [96, 28], [168, 24], [248, 26], [322, 36], [374, 64],
  [26, 110], [378, 132], [28, 184], [380, 206], [40, 256], [360, 262],
  [70, 300], [140, 296], [212, 300], [300, 296], [364, 300], [60, 70],
  [332, 84], [110, 252], [304, 248], [200, 56], [264, 292], [44, 300],
];
const DECOY_EDGES = [
  [0, 1], [2, 3], [5, 7], [6, 8], [9, 11], [12, 13], [19, 20], [17, 0],
];

function Graph({ step, reduce }) {
  // step 3: the raw graph (decoy cloud) blooms. step 4 (tool call): the relevant
  // subgraph — x/y/z + neighbours — appears and the camera zooms in.
  const bloom = step >= 3;
  const zoom = step >= 4;
  const subgraph = step >= 4;
  const reveal = step >= 5;
  const t = reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

  const focusFill = "oklch(var(--p))";
  const neighborFill = "color-mix(in oklab, oklch(var(--p)), oklch(var(--n)))";
  const decoyFill = "oklch(var(--n))";

  const pos = (key) => FOCUS[key].p;

  return (
    <motion.svg
      viewBox="0 0 400 320"
      className="w-full h-full"
      initial={false}
      animate={{ scale: zoom ? 1.85 : 1 }}
      transition={t}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {/* decoy edges */}
      {DECOY_EDGES.map(([a, b], i) => (
        <motion.line
          key={`de${i}`}
          x1={DECOYS[a][0]} y1={DECOYS[a][1]} x2={DECOYS[b][0]} y2={DECOYS[b][1]}
          stroke={decoyFill} strokeWidth="0.8"
          initial={false}
          animate={{ opacity: zoom ? 0 : bloom ? 0.25 : 0 }}
          transition={t}
        />
      ))}
      {/* decoy nodes */}
      {DECOYS.map(([x, y], i) => (
        <motion.circle
          key={`dn${i}`} cx={x} cy={y} r="3.4"
          fill={decoyFill}
          initial={false}
          animate={{ opacity: zoom ? 0 : bloom ? 0.55 : 0 }}
          transition={t}
        />
      ))}

      {/* neighbour edges (drawn from each focus node to its neighbours) */}
      {NEIGHBOR_EDGES.map(([k, ni], i) => (
        <motion.line
          key={`ne${i}`}
          x1={pos(k)[0]} y1={pos(k)[1]} x2={NEIGHBORS[ni][0]} y2={NEIGHBORS[ni][1]}
          stroke={neighborFill} strokeWidth="1.2"
          initial={false}
          animate={{ opacity: subgraph ? 0.75 : 0 }}
          transition={t}
        />
      ))}
      {/* x — y connection (z stays isolated from the pair) */}
      <motion.line
        x1={pos("x")[0]} y1={pos("x")[1]} x2={pos("y")[0]} y2={pos("y")[1]}
        stroke={focusFill} strokeWidth="2"
        initial={false}
        animate={{ opacity: subgraph ? 0.95 : 0 }}
        transition={t}
      />

      {/* neighbour nodes */}
      {NEIGHBORS.map(([x, y], i) => (
        <motion.circle
          key={`nn${i}`} cx={x} cy={y} r="5"
          fill={neighborFill}
          initial={false}
          animate={{ opacity: subgraph ? 1 : 0 }}
          transition={t}
        />
      ))}

      {/* focus nodes (x, y, z) */}
      {["x", "y", "z"].map((k) => (
        <motion.circle
          key={k} cx={pos(k)[0]} cy={pos(k)[1]} r="8"
          fill={focusFill}
          stroke="var(--mtn-sky-top)" strokeWidth="1.5"
          initial={false}
          animate={{ opacity: subgraph ? 1 : 0 }}
          transition={t}
        />
      ))}

      {/* labels — small base font so the zoom keeps them readable */}
      <AnimatePresence>
        {reveal && (
          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.15 }}
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            <Label cx={pos("x")[0]} cy={pos("x")[1]} dx={-7} anchor="end" tag="x" main="foo" tone="ok" />
            <Label cx={pos("y")[0]} cy={pos("y")[1]} dx={7} anchor="start" tag="y" main="bar" tone="ok" />
            <Label cx={pos("z")[0]} cy={pos("z")[1]} dy={16} anchor="middle" tag="z" main="qux" was="baz" tone="warn" />
          </motion.g>
        )}
      </AnimatePresence>
    </motion.svg>
  );
}

function Label({ cx, cy, dx = 0, dy = 0, anchor, tag, main, was, tone }) {
  const fill = tone === "ok" ? "oklch(var(--su))" : "oklch(var(--wa))";
  return (
    <g transform={`translate(${cx + dx}, ${cy + dy})`} textAnchor={anchor}>
      <text y="-3" fontSize="6" fontWeight="700" fill="oklch(var(--bc))">{tag}</text>
      {was && (
        <text y="6" fontSize="5" fill="oklch(var(--wa))" textDecoration="line-through" opacity="0.7">{was}</text>
      )}
      <text y={was ? 13 : 6} fontSize="6" fontWeight="700" fill={fill}>{main}</text>
    </g>
  );
}
