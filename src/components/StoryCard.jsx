import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A narrative chapter that, once it scrolls into view (client:visible), types
// its title then each body paragraph in sequence — a progressive, staggered
// roll-out matching the hero and the interactive. Reflow-safe: every block
// reserves its final size up front (invisible sizer + typed overlay), so the
// card is full-height immediately and nothing below it shifts as it types.

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

function Caret() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block w-[0.45rem] h-[0.85em] translate-y-[0.08em] ml-0.5 rounded-sm bg-primary/80"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

function TypedBlock({ text, state, onDone, speed, gap, className = "" }) {
  const reduce = useReducedMotion();
  const running = state === "running" && !reduce;
  const tw = useTypewriter(text, running, speed);
  const fired = useRef(false);
  useEffect(() => {
    if (state !== "running") fired.current = false;
  }, [state]);
  useEffect(() => {
    if (running && tw.done && !fired.current) {
      fired.current = true;
      const id = setTimeout(() => onDone && onDone(), gap);
      return () => clearTimeout(id);
    }
  }, [running, tw.done, onDone, gap]);

  const full = reduce || state === "done";
  const shown = state === "pending" ? "" : full ? text : tw.text;
  return (
    <span className={`relative block ${className}`}>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0">
        {shown}
        {running && !tw.done && <Caret />}
      </span>
    </span>
  );
}

export default function StoryCard({ id = null, num, eyebrow, title, body = [], bare = false, emitOnDone = null }) {
  const reduce = useReducedMotion();
  const count = 1 + body.length; // title + paragraphs
  const [active, setActive] = useState(reduce ? count : 0);
  const advance = (i) => setActive((a) => (a === i ? a + 1 : a));
  const stateOf = (i) =>
    reduce || active > i ? "done" : active === i ? "running" : "pending";

  // once every block has finished typing, optionally announce it on the window
  // so a sibling island (the grounding loop below) can hold until we're done.
  const announced = useRef(false);
  useEffect(() => {
    if (announced.current || !emitOnDone || active < count) return;
    announced.current = true;
    window.dispatchEvent(new CustomEvent(emitOnDone));
  }, [active, count, emitOnDone]);

  // bare mode: rendered inside a shared card, so it supplies no chrome or
  // padding of its own — just the typed content and its entrance animation.
  const cardClass = bare
    ? ""
    : "mx-auto max-w-3xl rounded-3xl bg-base-100/60 backdrop-blur-md ring-1 ring-base-300/25 shadow-lg px-7 py-10 sm:px-12 sm:py-14";

  const card = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cardClass}
    >
      {(num || eyebrow) && (
            <p className="flex items-center gap-3 text-sm font-medium tracking-[0.16em] text-primary mb-4">
              {num && <span className="font-slab text-base-content/40">{num}</span>}
              {eyebrow}
            </p>
          )}
          <h2 className="font-slab font-bold text-base-content text-3xl sm:text-[2.5rem] leading-tight tracking-tight">
            <TypedBlock
              text={title}
              state={stateOf(0)}
              onDone={() => advance(0)}
              speed={32}
              gap={250}
            />
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-base-content/80">
            {body.map((para, i) => (
              <TypedBlock
                key={i}
                text={para}
                state={stateOf(i + 1)}
                onDone={() => advance(i + 1)}
                speed={15}
                gap={300}
              />
            ))}
          </div>
    </motion.div>
  );

  if (bare) return card;

  return (
    <section id={id} className="relative py-16 sm:py-24">
      <div className="container mx-auto px-6 lg:px-16">{card}</div>
    </section>
  );
}
