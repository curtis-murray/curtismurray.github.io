import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuChevronsDown, LuSparkles, LuSparkle } from "react-icons/lu";

const NAME = "hi, i'm curtis murray";
// LLM stays uppercase; everything else lowercase.
const TAG = "don't you hate it when your LLM starts hallucinating?";
const PARA =
  "me too...\ni did a phd betting on transparent models you could trust over black boxes you just hoped would work.\n worked out well...\n so anyway, i kept the rigour and moved it into the system around them.";

// The one word that misbehaves on cue.
const HALLU = "hallucinating";
const HALLU_START = TAG.indexOf(HALLU);
const HALLU_END = HALLU_START + HALLU.length;
const HALLU_COLORS = [
  "#fb7185", // rose
  "#f59e0b", // amber
  "#fde047", // yellow
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#818cf8", // indigo
  "#e879f9", // fuchsia
];

// One letter of "hallucinating". Always breathes (opacity, never fully out);
// cycles through colours only while `cycle` is true, then eases back to rest.
function HalluLetter({ char, index, cycle, restColor }) {
  // Pseudo-random-but-stable per-letter variety so the fade isn't uniform.
  const fadeMin = 0.5 + ((index * 41) % 28) / 100; // 0.50–0.78
  const fadeDur = 1.5 + ((index * 67) % 130) / 100; // 1.5–2.8s
  const fadeDelay = ((index * 53) % 90) / 100; // 0–0.9s
  const colorDur = 2.6 + ((index * 23) % 180) / 100; // 2.6–4.4s
  const colorDelay = ((index * 31) % 120) / 100; // 0–1.2s
  return (
    <motion.span
      className="inline-block"
      animate={{
        opacity: [1, fadeMin, 1],
        color: cycle ? [...HALLU_COLORS, HALLU_COLORS[0]] : restColor || "currentColor",
      }}
      transition={{
        opacity: {
          duration: fadeDur,
          delay: fadeDelay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        color: cycle
          ? {
              duration: colorDur,
              delay: colorDelay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }
          : { duration: 0.8, ease: "easeOut" },
      }}
    >
      {char}
    </motion.span>
  );
}

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

export default function HeroContent() {
  const reduce = useReducedMotion();
  const [tagStart, setTagStart] = useState(false);
  const [paraStart, setParaStart] = useState(false);
  const tagRef = useRef(null);
  const [restColor, setRestColor] = useState("");

  const name = useTypewriter(NAME, !reduce, 56);
  const tag = useTypewriter(TAG, tagStart && !reduce, 30);
  const para = useTypewriter(PARA, paraStart && !reduce, 28);

  useEffect(() => {
    if (reduce || !name.done) return;
    const id = setTimeout(() => setTagStart(true), 550);
    return () => clearTimeout(id);
  }, [reduce, name.done]);
  useEffect(() => {
    if (reduce || !tag.done) return;
    const id = setTimeout(() => setParaStart(true), 450);
    return () => clearTimeout(id);
  }, [reduce, tag.done]);

  const photoIn = reduce || name.done;
  const ctaIn = reduce || para.done;
  const nameText = reduce ? NAME : name.text;
  const tagText = reduce ? TAG : tag.text;
  const paraText = reduce ? PARA : para.text;
  const nameTyping = !reduce && !name.done;
  const tagTyping = !reduce && tagStart && !tag.done;
  const paraTyping = !reduce && paraStart && !para.done;

  // Capture the tagline's resting text colour so the word can ease back to it
  // once colour cycling stops (works across themes).
  useEffect(() => {
    if (tagRef.current) setRestColor(getComputedStyle(tagRef.current).color);
  }, []);

  // Cycle colours while the tag/para are still typing; drop them once
  // "me too..." (the paragraph) has finished. The fade keeps going regardless.
  const cycleColors = !reduce && !para.done;

  // Render the visible tagline, wrapping any visible part of "hallucinating"
  // in animated per-letter spans.
  function renderTag() {
    const text = tagText;
    if (reduce) return text;
    const len = text.length;
    const before = text.slice(0, Math.min(len, HALLU_START));
    const word = len > HALLU_START ? TAG.slice(HALLU_START, Math.min(len, HALLU_END)) : "";
    const after = len > HALLU_END ? TAG.slice(HALLU_END, len) : "";
    return (
      <>
        {before}
        {word.split("").map((char, i) => (
          <HalluLetter
            key={i}
            char={char}
            index={i}
            cycle={cycleColors}
            restColor={restColor}
          />
        ))}
        {after}
      </>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
      <div className="lg:col-span-7">
        <motion.p
          className="text-sm font-medium tracking-[0.18em] text-primary mb-5"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          ai engineer · phd · melbourne
        </motion.p>

        <h1 className="font-slab font-bold text-base-content text-5xl sm:text-6xl lg:text-[4.75rem] leading-[1.05] tracking-tight">
          {nameText}
          {nameTyping && <Caret />}
        </h1>

        <p
          ref={tagRef}
          className="hero-haze mt-8 font-slab text-2xl sm:text-3xl leading-snug text-base-content/85 min-h-[1.4em]"
        >
          {renderTag()}
          {tagTyping && <Caret />}
        </p>

        <p className="hero-haze mt-9 max-w-2xl text-lg sm:text-xl leading-relaxed text-base-content/90 whitespace-pre-line min-h-[6.5em] sm:min-h-[5em]">
          {paraText}
          {paraTyping && <Caret />}
        </p>

        {/* Descent cue: sparkle-flanked underlined link + bouncing double
            chevron beneath — same motif as the grind's "scenic tour", no orange
            pill. Tells you to scroll without shouting it. */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-3"
          initial={false}
          animate={{ opacity: ctaIn ? 1 : 0, y: ctaIn ? 0 : 8 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="#thesis"
            className="group inline-flex items-center gap-2.5 text-lg sm:text-xl font-medium text-primary transition-opacity hover:opacity-80"
          >
            <motion.span
              aria-hidden="true"
              className="text-[1.05em]"
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7], rotate: [0, 12, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
              }
            >
              <LuSparkles />
            </motion.span>
            <span className="underline decoration-primary/30 underline-offset-4 group-hover:decoration-primary">
              come see how
            </span>
            <motion.span
              aria-hidden="true"
              className="text-[0.8em]"
              animate={
                reduce ? undefined : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }
              }
              transition={
                reduce
                  ? undefined
                  : { repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.6 }
              }
            >
              <LuSparkle />
            </motion.span>
          </a>
          <motion.span
            className="text-3xl text-base-content/55"
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={
              reduce
                ? undefined
                : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
            }
          >
            <LuChevronsDown />
          </motion.span>
        </motion.div>
      </div>

      <div className="order-first lg:order-none lg:col-span-5 flex justify-center lg:justify-end">
        <motion.div
          className="relative"
          initial={false}
          animate={
            photoIn
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.85, y: 12 }
          }
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 18 }
          }
        >
          <div
            className="absolute -inset-3 rounded-[2rem] bg-primary/15 blur-2xl"
            aria-hidden="true"
          />
          <img
            src="/assets/about/avatar.png"
            alt="Curtis Murray"
            width="340"
            height="420"
            className="relative w-60 sm:w-72 lg:w-[20rem] aspect-[4/5] object-cover rounded-[1.75rem] shadow-2xl ring-1 ring-base-content/10"
          />
        </motion.div>
      </div>
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block w-[0.5rem] h-[0.95em] translate-y-[0.12em] ml-1 rounded-sm bg-primary/80"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}
