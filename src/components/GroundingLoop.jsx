import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// An abstract, tongue-in-cheek dramatisation of the through-line: an agent gets
// a question, forms a hypothesis, but instead of confidently guessing it selects
// a tool, fills in a structured query, consults a knowledge graph — which
// confirms two guesses and corrects the third (a subtle near-miss: bas → baz).
// The model proposes; the graph disposes.
//
// Completion-driven: each stage starts only once the previous finishes. Typed
// lines reserve their final size up front (sizer + overlay) so nothing reflows.

const STEPS = [
  { id: "title", kind: "type" },
  { id: "ask", kind: "type" },
  { id: "ack", kind: "type" },
  { id: "hunch", kind: "type" },
  { id: "bloom", kind: "wait", duration: 1000 },
  { id: "toolselect", kind: "wait", duration: 2100 },
  { id: "zoom", kind: "wait", duration: 1000 },
  { id: "toolform", kind: "wait", duration: 2700 },
  { id: "reveal", kind: "wait", duration: 800 },
  { id: "correction", kind: "type" },
  { id: "toollog", kind: "wait", duration: 800 },
  { id: "answer", kind: "type" },
  { id: "trace", kind: "wait", duration: 2300 },
];
const I = Object.fromEntries(STEPS.map((s, i) => [s.id, i]));
const MAX = STEPS.length;

function useTypewriter(text, active, speed) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return { text: text.slice(0, n), done: n >= text.length };
}

export default function GroundingLoop({ eyebrow, title, bare = false, subtitle = false, startAfter = null }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [runId, setRunId] = useState(0);
  // which focus node the reader is hovering ("x" | "y" | "z" | null) — set by
  // both the answer words and the nodes themselves.
  const [hot, setHot] = useState(null);
  // hold the whole sequence until it's allowed to start, so it doesn't race the
  // chapter stacked above it in the same card.
  const [started, setStarted] = useState(reduce);
  // latched once the title finishes typing, so the rest of the card doesn't
  // crowd the title on first reveal. stays true through replay so the body
  // doesn't flash out from under the user clicking replay.
  const [bodyShown, setBodyShown] = useState(reduce);
  const rootRef = useRef(null);

  useEffect(() => {
    if (started) return;
    // If we're told to wait for an upstream signal — the chapter above us
    // finishing its type-out — hold for that event rather than starting on our
    // own scroll position, so the two never type at the same time.
    if (startAfter) {
      const go = () => setStarted(true);
      window.addEventListener(startAfter, go);
      return () => window.removeEventListener(startAfter, go);
    }
    const el = rootRef.current;
    if (!el) return;
    // Fallback: fire once the loop has scrolled up into the top ~15–40% band of
    // the viewport — by then the chapter stacked above it has moved off, so the
    // two don't type at the same time.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started, startAfter]);

  useEffect(() => {
    setActive(reduce ? MAX : 0);
  }, [runId, reduce]);

  // Latch the body open as soon as the title step finishes (or immediately if
  // there's no title to wait on). Never flips back: replay resets `active` but
  // shouldn't yank the header/replay button out from under the user mid-click.
  useEffect(() => {
    if (bodyShown) return;
    if (reduce || !title || active >= I.ask) setBodyShown(true);
  }, [bodyShown, reduce, title, active]);

  // wait-kind stages advance on a timer; type-kind stages advance themselves.
  useEffect(() => {
    if (reduce || !started || active >= MAX) return;
    const stp = STEPS[active];
    if (stp.kind !== "wait") return;
    const id = setTimeout(
      () => setActive((a) => (a === active ? a + 1 : a)),
      stp.duration
    );
    return () => clearTimeout(id);
  }, [active, runId, reduce, started]);

  const advance = (i) => setActive((a) => (a === i ? a + 1 : a));
  // until the sequence is in view, nothing has started typing yet.
  const stateOf = (id) =>
    reduce ? "done" : !started ? "pending" : active > I[id] ? "done" : active === I[id] ? "running" : "pending";

  const phase = {
    bloom: reduce || active >= I.bloom,
    zoom: reduce || active >= I.zoom,
    // the focus cluster (x/y/z + neighbours + their names) blooms with the wider
    // graph; the zoom is then a camera move into structure that's already there.
    cluster: reduce || active >= I.bloom,
    corrected: reduce || active >= I.correction,
  };
  const thinkingOpen = reduce || active >= I.ack;
  const thinkingBusy = !reduce && active <= I.toollog;
  const show = (id) => reduce || active >= I[id];

  // bare mode: rendered inside a shared card, so it supplies no chrome or
  // padding of its own.
  const shellClass = bare
    ? ""
    : "rounded-3xl bg-base-100/75 backdrop-blur-md ring-1 ring-base-300/40 shadow-lg p-5 sm:p-7";

  return (
    <div ref={rootRef} className={shellClass}>
      {(eyebrow || title) && (
        <div className="mb-7 text-left">
          {eyebrow && (
            <p className="text-sm font-medium tracking-[0.16em] text-primary mb-2">
              {eyebrow}
            </p>
          )}
          {title && subtitle && (
            <p className="font-slab font-medium text-base-content/70 text-lg sm:text-xl leading-snug">
              <TypedText
                text={title}
                state={stateOf("title")}
                onDone={() => advance(I.title)}
                speed={32}
                gap={250}
              />
            </p>
          )}
          {title && !subtitle && (
            <h2 className="font-slab font-bold text-base-content text-3xl sm:text-[2.5rem] leading-tight tracking-tight">
              <TypedText
                text={title}
                state={stateOf("title")}
                onDone={() => advance(I.title)}
                speed={32}
                gap={250}
              />
            </h2>
          )}
        </div>
      )}
      <motion.div
        initial={false}
        animate={{ opacity: bodyShown ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: bodyShown ? "auto" : "none" }}
        aria-hidden={!bodyShown}
      >
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

      <div key={runId} className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-start">
        {/* transcript */}
        <div className="space-y-3">
          {show("ask") && (
            <ChatBubble
              who="user"
              text="tell me about xyz"
              state={stateOf("ask")}
              onDone={() => advance(I.ask)}
            />
          )}

          {thinkingOpen && (
            <ThinkingBlock busy={thinkingBusy} reduce={reduce}>
              {show("ack") && (
                <ThinkLine
                  text="okay — they want to know about xyz."
                  state={stateOf("ack")}
                  onDone={() => advance(I.ack)}
                />
              )}
              {show("hunch") && (
                <ThinkLine
                  text="my hunch: xyz breaks into x, y, and z. but i'm not about to just guess — let me check the graph."
                  state={stateOf("hunch")}
                  onDone={() => advance(I.hunch)}
                />
              )}
              {show("toolselect") && <ToolSelect run={show("toolselect")} reduce={reduce} />}
              {show("toolform") && <ToolForm run={show("toolform")} reduce={reduce} />}
              {/* mobile: graph appears inline right after the tool call */}
              {show("toolform") && (
                <div className="md:hidden rounded-xl bg-base-200/40 ring-1 ring-base-300/50 overflow-hidden h-[260px] flex items-center justify-center">
                  <Graph phase={phase} reduce={reduce} hot={hot} onHover={setHot} />
                </div>
              )}
              {show("correction") && (
                <ThinkLine
                  text="found x and y exactly as expected. but z isn't bas like i assumed — the graph says it's baz. good thing i looked."
                  state={stateOf("correction")}
                  onDone={() => advance(I.correction)}
                />
              )}
              {show("toollog") && <ToolLog reduce={reduce} />}
            </ThinkingBlock>
          )}

          {show("answer") && (
            <ChatBubble
              who="agent"
              final
              text="so: xyz is foo, bar, and baz — grounded, not guessed."
              highlights={[{ word: "foo", node: "x" }, { word: "bar", node: "y" }, { word: "baz", node: "z" }]}
              onHover={setHot}
              state={stateOf("answer")}
              onDone={() => advance(I.answer)}
            />
          )}

          {show("trace") && <LogEntry reduce={reduce} />}
        </div>

        {/* knowledge graph — desktop only (mobile uses the inline slot above) */}
        <div className="hidden md:flex rounded-2xl bg-base-200/40 ring-1 ring-base-300/50 overflow-hidden h-[440px] items-center justify-center md:sticky md:top-24">
          <Graph phase={phase} reduce={reduce} hot={hot} onHover={setHot} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-base-content/65">
        the agent is allowed to be creative about <i>hypotheses</i> and never
        about <i>facts</i>. every claim resolves to a node that actually exists,
      or dies trying.</p>
      </motion.div>
    </div>
  );
}

// ── typed text (reflow-safe: reserves full size, types an overlay) ───────────
function useTyped(text, state, onDone, speed, gap) {
  const reduce = useReducedMotion();
  const running = state === "running" && !reduce;
  const tw = useTypewriter(text, running, speed);
  const fired = useRef(false);
  useEffect(() => {
    fired.current = false; // reset on any state change (incl. replay done→running)
  }, [state]);
  useEffect(() => {
    if (running && tw.done && !fired.current) {
      fired.current = true;
      const id = setTimeout(() => onDone && onDone(), gap);
      return () => clearTimeout(id);
    }
  }, [running, tw.done, onDone, gap]);
  const full = state === "done" || reduce;
  const shown = state === "pending" ? "" : full ? text : tw.text;
  return { text: shown, caret: running && !tw.done, full };
}

// Wrap each highlighted word in a primary-coloured hover target that pings the
// matching graph node. Only used once the line is fully typed (so the
// typewriter never has to reason about partial words).
function renderHighlighted(text, highlights, onHover) {
  const re = new RegExp(`\\b(${highlights.map((h) => h.word).join("|")})\\b`, "g");
  return text.split(re).map((part, i) => {
    const h = highlights.find((x) => x.word === part);
    if (!h) return part;
    return (
      <span
        key={i}
        className="text-primary font-semibold rounded px-0.5 -mx-0.5 cursor-default transition-colors hover:bg-primary/15"
        onMouseEnter={() => onHover && onHover(h.node)}
        onMouseLeave={() => onHover && onHover(null)}
      >
        {part}
      </span>
    );
  });
}

function TypedText({ text, state, onDone, speed, gap, className = "", highlights, onHover }) {
  const t = useTyped(text, state, onDone, speed, gap);
  return (
    <span className={`relative block ${className}`}>
      <span className="invisible" aria-hidden="true">{text}</span>
      <span className="absolute inset-0">
        {highlights && t.full ? renderHighlighted(text, highlights, onHover) : t.text}
        {t.caret && <Caret />}
      </span>
    </span>
  );
}

function ThinkLine({ text, state, onDone, speed = 40, gap = 450 }) {
  return (
    <div className="text-[14px] leading-relaxed text-base-content/85">
      <TypedText text={text} state={state} onDone={onDone} speed={speed} gap={gap} />
    </div>
  );
}

function ChatBubble({ who, text, state, onDone, final, speed = 46, gap = 350, highlights, onHover }) {
  const isUser = who === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
        {final && (
          <span className="block text-[10px] font-semibold tracking-[0.14em] text-base-content/40 mb-1">
            answer
          </span>
        )}
        <TypedText text={text} state={state} onDone={onDone} speed={speed} gap={gap} highlights={highlights} onHover={onHover} />
      </div>
    </motion.div>
  );
}

function Caret() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block w-[0.45rem] h-[0.9em] translate-y-[0.1em] ml-0.5 rounded-sm bg-primary/80"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// ── thinking block ──────────────────────────────────────────────────────────
function ThinkingBlock({ children, busy, reduce }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-base-200/35 ring-1 ring-base-300/40 border-l-2 border-primary/40 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-base-content/45">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z" /><path d="M9 21h6" /></svg>
        thinking
        {busy && (
          <span className="inline-flex gap-1 ml-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block h-1 w-1 rounded-full bg-base-content/40"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        )}
      </div>
      <div className="px-4 pb-3.5 space-y-2.5">{children}</div>
    </motion.div>
  );
}

// ── tool selection (cycles candidate MCP tools, lands on graph.lookup) ───────
const TOOLS = ["web.search", "vector.retrieve", "sql.query", "graph.lookup"];
function ToolSelect({ run, reduce }) {
  const TARGET = TOOLS.length - 1;
  const [sel, setSel] = useState(reduce ? TARGET : 0);
  useEffect(() => {
    if (reduce || !run) {
      setSel(TARGET);
      return;
    }
    let cur = 0;
    setSel(0);
    const id = setInterval(() => {
      cur += 1;
      setSel(cur);
      if (cur >= TARGET) clearInterval(id);
    }, 460);
    return () => clearInterval(id);
  }, [run, reduce]);
  const landed = sel >= TARGET;
  return (
    <div className="rounded-lg bg-base-100/60 ring-1 ring-base-300/50 p-2.5">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-base-content/45 mb-1.5">
        selecting tool
      </p>
      <div className="flex flex-wrap gap-1.5 font-mono text-[12px]">
        {TOOLS.map((tool, i) => {
          const on = i === sel;
          const best = i === TARGET && landed;
          return (
            <span
              key={tool}
              className={`rounded-md px-2 py-0.5 transition-all duration-150 ${
                best
                  ? "bg-primary text-primary-content font-semibold"
                  : on
                    ? "bg-base-300/70 text-base-content"
                    : "text-base-content/45"
              }`}
            >
              {tool}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── tool form (the LLM fills in structured fields) ───────────────────────────
const FIELDS = [
  ["query reason", "resolve what xyz is made of"],
  ["query nodes", "x, y, z"],
  ["expected return", "x: foo, y: bar, z: bas?"],
];
function ToolForm({ run, reduce }) {
  const [fi, setFi] = useState(0);
  useEffect(() => {
    if (!run) setFi(0);
  }, [run]);
  const active = run && !reduce;
  const f0 = useTypewriter(FIELDS[0][1], active && fi >= 0, 26);
  const f1 = useTypewriter(FIELDS[1][1], active && fi >= 1, 26);
  const f2 = useTypewriter(FIELDS[2][1], active && fi >= 2, 26);
  useEffect(() => {
    if (active && f0.done && fi === 0) setFi(1);
  }, [active, f0.done, fi]);
  useEffect(() => {
    if (active && f1.done && fi === 1) setFi(2);
  }, [active, f1.done, fi]);
  const fields = [f0, f1, f2];
  const val = (i) => {
    if (reduce || !active) return FIELDS[i][1];
    if (i < fi) return FIELDS[i][1];
    if (i === fi) return fields[i].text;
    return "";
  };
  const typing = (i) => active && i === fi && !fields[i].done;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-base-100/60 ring-1 ring-base-300/50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-base-300/40">
        <span className="font-mono text-[12px] text-primary font-semibold">
          graph.lookup
        </span>
        <span className="text-[10px] tracking-[0.12em] text-base-content/40">
          mcp tool
        </span>
      </div>
      <div className="px-3 py-2.5 space-y-1.5 font-mono text-[12px]">
        {FIELDS.map(([label, value], i) => (
          <div key={label} className="flex gap-3">
            <span className="text-base-content/45 w-[104px] shrink-0">
              {label}
            </span>
            {/* reflow-safe: reserve the full value width/height */}
            <span className="relative block flex-1 min-w-0 text-base-content/90">
              <span className="invisible" aria-hidden="true">{value}</span>
              <span className="absolute inset-0">
                {val(i)}
                {typing(i) && <Caret />}
              </span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── tool result rows ─────────────────────────────────────────────────────────
function ToolLog({ reduce }) {
  const rows = [
    { k: "x", v: "foo", tone: "ok", note: "as expected" },
    { k: "y", v: "bar", tone: "ok", note: "as expected" },
    { k: "z", v: "baz", tone: "warn", note: "expected bas — corrected" },
  ];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-base-100/55 ring-1 ring-base-300/50 divide-y divide-base-300/40 overflow-hidden font-mono text-[12px]"
    >
      {rows.map((r) => (
        <div key={r.k} className="flex items-center justify-between gap-2 px-3 py-1.5">
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

// ── trajectory log (observability) ───────────────────────────────────────────
function LogEntry({ reduce }) {
  const rows = [
    ["problem", 'resolve "xyz" into its parts'],
    ["reasoning", "hypothesised x, y, z — declined to guess"],
    ["tool", "graph.lookup → ok · 3 nodes hit", true],
    ["revised", "z: bas → baz (grounded correction)"],
  ];
  const [open, setOpen] = useState(false);
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
        {rows.map(([k, v, isTool]) => (
          <div key={k} className="flex gap-3">
            <span className="text-base-content/45 w-[64px] shrink-0">{k}</span>
            <span>
              {isTool ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    className="text-primary font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    graph.lookup
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-90" : ""}`}><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                  {v.replace("graph.lookup", "")}
                </>
              ) : (
                v
              )}
            </span>
          </div>
        ))}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-1 rounded-lg bg-base-100/60 ring-1 ring-base-300/50 p-2.5 space-y-1 text-[11.5px]">
                <div className="flex gap-3">
                  <span className="text-base-content/45 w-[110px] shrink-0">tool</span>
                  <span className="text-primary font-semibold">graph.lookup</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-base-content/45 w-[110px] shrink-0">query reason</span>
                  <span>resolve what xyz is made of</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-base-content/45 w-[110px] shrink-0">query nodes</span>
                  <span>x, y, z</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-base-content/45 w-[110px] shrink-0">expected</span>
                  <span>x: foo, y: bar, z: bas?</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-base-content/45 w-[110px] shrink-0">returned</span>
                  <span>
                    x: foo, y: bar,{" "}
                    <span className="text-warning">z: baz (≠ bas)</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-0.5">
          <span className="text-base-content/45 w-[64px] shrink-0">confidence</span>
          <ConfidencePicker reduce={reduce} />
        </div>
      </div>
    </motion.div>
  );
}

function ConfidencePicker({ reduce }) {
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
    }, 760);
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
              active ? "opacity-100" : landed ? "opacity-60" : "opacity-55"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                active ? (best ? "bg-success" : "bg-warning") : "bg-base-content/30"
              }`}
            />
            <span
              className={
                active && best
                  ? "text-success font-semibold"
                  : active
                    ? "text-warning"
                    : "text-base-content/70"
              }
            >
              {o}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── knowledge graph ──────────────────────────────────────────────────────────
const FOCUS = {
  x: { p: [168, 134], label: "foo" },
  y: { p: [236, 150], label: "bar" },
  z: { p: [200, 206], label: "baz", was: "bas" },
};
const NEIGHBORS = [
  [132, 106], [148, 178],
  [292, 126], [284, 188],
  [156, 246], [252, 240],
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

function Graph({ phase, reduce, hot, onHover }) {
  const { bloom, zoom, cluster, corrected } = phase;
  const t = reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] };
  const focusFill = "oklch(var(--p))";
  const neighborFill = "color-mix(in oklab, oklch(var(--p)), oklch(var(--n)))";
  const decoyFill = "oklch(var(--n))";
  const pos = (key) => FOCUS[key].p;
  const enter = (k) => onHover && onHover(k);
  const leave = () => onHover && onHover(null);

  return (
    <motion.svg
      viewBox="0 0 400 320"
      className="w-full h-full"
      initial={false}
      animate={{ scale: zoom ? 1.85 : 1 }}
      transition={t}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
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
      {DECOYS.map(([x, y], i) => (
        <motion.circle
          key={`dn${i}`} cx={x} cy={y} r="3.4"
          fill={decoyFill}
          initial={false}
          animate={{ opacity: zoom ? 0 : bloom ? 0.55 : 0 }}
          transition={t}
        />
      ))}
      {NEIGHBOR_EDGES.map(([k, ni], i) => (
        <motion.line
          key={`ne${i}`}
          x1={pos(k)[0]} y1={pos(k)[1]} x2={NEIGHBORS[ni][0]} y2={NEIGHBORS[ni][1]}
          stroke={neighborFill} strokeWidth="1.2"
          initial={false}
          animate={{ opacity: cluster ? 0.75 : 0 }}
          transition={t}
        />
      ))}
      <motion.line
        x1={pos("x")[0]} y1={pos("x")[1]} x2={pos("y")[0]} y2={pos("y")[1]}
        stroke={focusFill} strokeWidth="2"
        initial={false}
        animate={{ opacity: cluster ? 0.95 : 0 }}
        transition={t}
      />
      {NEIGHBORS.map(([x, y], i) => (
        <motion.circle
          key={`nn${i}`} cx={x} cy={y} r="5"
          fill={neighborFill}
          initial={false}
          animate={{ opacity: cluster ? 1 : 0 }}
          transition={t}
        />
      ))}
      {["x", "y", "z"].map((k) => {
        const isHot = hot === k;
        return (
          <g key={k}>
            {/* halo — blooms while this node (or its answer word) is hovered */}
            <motion.circle
              cx={pos(k)[0]} cy={pos(k)[1]}
              fill={focusFill}
              initial={false}
              animate={{ opacity: cluster && isHot ? 0.3 : 0, r: isHot ? 22 : 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ filter: "blur(2px)" }}
            />
            <motion.circle
              cx={pos(k)[0]} cy={pos(k)[1]}
              fill={focusFill}
              stroke="var(--mtn-sky-top)" strokeWidth="1.5"
              initial={false}
              animate={{ opacity: cluster ? 1 : 0, r: isHot ? 11.5 : 8 }}
              transition={{ ...t, r: { duration: 0.25, ease: "easeOut" } }}
            />
            {/* transparent hit target so hovering the node lights it up */}
            <circle
              cx={pos(k)[0]} cy={pos(k)[1]} r="18"
              fill="transparent"
              pointerEvents={cluster ? "auto" : "none"}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => enter(k)}
              onMouseLeave={leave}
            />
          </g>
        );
      })}
      <AnimatePresence>
        {cluster && (
          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.15 }}
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            <Label cx={pos("x")[0]} cy={pos("x")[1]} dx={-9} anchor="end" tag="x" main="foo" tone="ok" active={hot === "x"} />
            <Label cx={pos("y")[0]} cy={pos("y")[1]} dx={9} anchor="start" tag="y" main="bar" tone="ok" active={hot === "y"} />
            <Label
              cx={pos("z")[0]} cy={pos("z")[1]} dy={18} anchor="middle"
              tag="z"
              main={corrected ? "baz" : "bas"}
              was={corrected ? "bas" : undefined}
              tone={corrected ? "warn" : "neutral"}
              active={hot === "z"}
            />
          </motion.g>
        )}
      </AnimatePresence>
    </motion.svg>
  );
}

function Label({ cx, cy, dx = 0, dy = 0, anchor, tag, main, was, tone, active }) {
  const fill =
    tone === "ok" ? "oklch(var(--su))" : tone === "warn" ? "oklch(var(--wa))" : "oklch(var(--bc))";
  // paint-order stroke draws a base-100 outline *under* the glyphs, so labels
  // stay legible over the translucent, blurred mountain backdrop.
  const halo = { paintOrder: "stroke", stroke: "oklch(var(--b1))", strokeWidth: 2.4, strokeLinejoin: "round" };
  // Outer <g> positions the label (a static transform); the inner motion.g owns
  // the hover scale. Keeping these on separate elements stops framer-motion's
  // animated `scale` from overwriting the positioning transform.
  return (
    <g transform={`translate(${cx + dx}, ${cy + dy})`} textAnchor={anchor}>
      <motion.g
        initial={false}
        animate={{ scale: active ? 1.18 : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ transformBox: "fill-box", transformOrigin: anchor === "end" ? "right" : anchor === "start" ? "left" : "center" }}
      >
        <text y="-8" fontSize="6" fontWeight="700" fillOpacity="0.5" fill="oklch(var(--bc))" style={halo}>{tag}</text>
        {was && (
          <text y="4" fontSize="7" fill="oklch(var(--wa))" textDecoration="line-through" opacity="0.75" style={halo}>{was}</text>
        )}
        <text y={was ? 14 : 4} fontSize="9.5" fontWeight="800" fill={fill} style={halo}>{main}</text>
      </motion.g>
    </g>
  );
}
