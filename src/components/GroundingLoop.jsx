import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Self-contained illustration of the propose → ground → dispose loop, in the
// language of the clinical entity-linking project: a messy free-text mention is
// resolved to a verified ontology entity. The model proposes candidates (some
// with hallucinated codes); a trusted source accepts the real ones and rejects
// the inventions. The "let it freelance" toggle ships the model's confident
// top pick straight to output — and you watch the hallucination get through.
//
// No fetch, no graph — all data is local. framer-motion is imported only here.

const SOURCE = [
  { code: "rxnorm:161", label: "Acetaminophen" },
  { code: "rxnorm:5640", label: "Ibuprofen" },
  { code: "rxnorm:1191", label: "Aspirin" },
];
const REAL_CODES = new Set(SOURCE.map((s) => s.code));

// In the model's own confidence order — note its top pick is a hallucination.
const CANDIDATES = [
  { id: "c1", label: "Paracetamol", code: "rxnorm:99812", conf: 0.91 },
  { id: "c2", label: "Acetaminophen", code: "rxnorm:161", conf: 0.74 },
  { id: "c3", label: "Tylenol-XR", code: "rxnorm:44120", conf: 0.55 },
].map((c) => ({ ...c, grounded: REAL_CODES.has(c.code) }));

const PHASES = ["propose", "ground", "settle"];

export default function GroundingLoop() {
  const reduce = useReducedMotion();
  const [freelance, setFreelance] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [runId, setRunId] = useState(0);
  const phase = PHASES[phaseIdx];

  // Drive the loop on a timer; jump straight to the end under reduced motion.
  useEffect(() => {
    if (reduce) {
      setPhaseIdx(PHASES.length - 1);
      return;
    }
    setPhaseIdx(0);
    const t1 = setTimeout(() => setPhaseIdx(1), 900);
    const t2 = setTimeout(() => setPhaseIdx(2), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [runId, freelance, reduce]);

  const replay = () => setRunId((n) => n + 1);
  const setMode = (f) => {
    if (f === freelance) return;
    setFreelance(f);
  };

  const grounded = CANDIDATES.filter((c) => c.grounded);
  // Output: grounded mode keeps only verified candidates; freelance mode ships
  // the model's top pick regardless.
  const output = freelance ? [CANDIDATES[0]] : grounded.filter((c) => c.id === "c2");
  const showVerdicts = phase !== "propose";
  const showOutput = phase === "settle";

  return (
    <div className="rounded-3xl bg-base-100/80 backdrop-blur-md ring-1 ring-base-300/50 shadow-xl p-5 sm:p-8">
      {/* mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div
          role="tablist"
          aria-label="Grounding mode"
          className="inline-flex rounded-full bg-base-200 p-1 ring-1 ring-base-300/60"
        >
          <button
            role="tab"
            aria-selected={!freelance}
            onClick={() => setMode(false)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              !freelance
                ? "bg-primary text-primary-content shadow"
                : "text-base-content/70 hover:text-base-content"
            }`}
          >
            Ground in source
          </button>
          <button
            role="tab"
            aria-selected={freelance}
            onClick={() => setMode(true)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              freelance
                ? "bg-error text-error-content shadow"
                : "text-base-content/70 hover:text-base-content"
            }`}
          >
            Let it freelance
          </button>
        </div>
        <button
          onClick={replay}
          className="text-sm font-medium text-base-content/60 hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
          Replay
        </button>
      </div>

      {/* input */}
      <div className="mb-6">
        <Label>Messy input · free-text clinical note</Label>
        <div className="mt-2 rounded-xl bg-base-200/70 ring-1 ring-base-300/60 px-4 py-3 font-mono text-sm text-base-content/90">
          pt continued on{" "}
          <span className="rounded bg-warning/25 text-warning px-1.5 py-0.5 font-semibold">
            Tylenol
          </span>{" "}
          500mg PO BD for fever
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.35fr_1fr]">
        {/* candidates */}
        <div>
          <Label>Model proposes</Label>
          <div className="mt-2 space-y-2.5">
            {CANDIDATES.map((c, i) => {
              const rejected = showVerdicts && !c.grounded;
              const shippedAnyway = freelance && c.id === CANDIDATES[0].id;
              return (
                <motion.div
                  key={c.id + runId}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{
                    opacity: rejected && !shippedAnyway ? 0.4 : 1,
                    y: 0,
                  }}
                  transition={{ delay: reduce ? 0 : i * 0.18, duration: 0.4 }}
                  className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1 transition-colors ${
                    rejected
                      ? "bg-error/5 ring-error/30"
                      : showVerdicts && c.grounded
                        ? "bg-success/5 ring-success/30"
                        : "bg-base-200/60 ring-base-300/60"
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`font-medium text-base-content truncate ${
                        rejected && !shippedAnyway ? "line-through" : ""
                      }`}
                    >
                      {c.label}
                    </p>
                    <p className="font-mono text-xs text-base-content/55">
                      {c.code}
                    </p>
                  </div>
                  <AnimatePresence mode="wait">
                    {showVerdicts ? (
                      <Pill key="v" tone={c.grounded ? "ok" : "rej"} reduce={reduce}>
                        {c.grounded ? "grounded" : "not in source"}
                      </Pill>
                    ) : (
                      <span
                        key="conf"
                        className="shrink-0 font-mono text-xs text-base-content/45"
                      >
                        {Math.round(c.conf * 100)}%
                      </span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* verified source */}
        <div>
          <Label>Verified source · ontology</Label>
          <div className="mt-2 rounded-xl bg-base-200/40 ring-1 ring-base-300/60 p-3 space-y-1.5">
            {SOURCE.map((s) => (
              <div
                key={s.code}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-base-content/85">{s.label}</span>
                <span className="font-mono text-xs text-base-content/50">
                  {s.code}
                </span>
              </div>
            ))}
            <p className="px-3 pt-1 text-xs text-base-content/45 leading-snug">
              The deterministic core. The model can propose anything; only codes
              that exist here can be committed.
            </p>
          </div>
        </div>
      </div>

      {/* output */}
      <div className="mt-7">
        <Label>Trustworthy output</Label>
        <div className="mt-2 min-h-[4.5rem]">
          <AnimatePresence mode="wait">
            {showOutput && (
              <motion.div
                key={(freelance ? "free" : "ground") + runId}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {output.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 ring-1 ${
                      c.grounded
                        ? "bg-success/10 ring-success/40"
                        : "bg-error/10 ring-error/45"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-base-content">
                        {c.label}
                      </p>
                      <p className="font-mono text-xs text-base-content/60">
                        {c.code}
                      </p>
                    </div>
                    <Pill tone={c.grounded ? "ok" : "rej"} reduce={reduce}>
                      {c.grounded ? "verified ✓" : "hallucinated code ✗"}
                    </Pill>
                  </div>
                ))}
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    freelance ? "text-error" : "text-base-content/70"
                  }`}
                >
                  {freelance
                    ? "Freelancing, the model's most confident answer is a real drug name welded to a code that doesn't exist — fluent, plausible, and wrong. It ships."
                    : "Grounded, the inventions are rejected and only the entity that exists in the source is committed. The model never gets to be the source of truth."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-base-content/45">
      {children}
    </p>
  );
}

function Pill({ children, tone, reduce }) {
  const tones = {
    ok: "bg-success/15 text-success",
    rej: "bg-error/15 text-error",
  };
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold font-mono whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </motion.span>
  );
}
