import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PdfViewer from "./PdfViewer.jsx";

const NAME = "hi, i'm curtis murray";
// LLM stays uppercase; everything else lowercase.
const TAG = "don't you hate it when your LLM starts hallucinating?";
const PARA =
  "me too...\ni did a phd betting on transparent models you could trust over black boxes you just hoped would work. then the black boxes got too good to ignore — so i kept the rigour and moved it into the system around them.";

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

  const name = useTypewriter(NAME, !reduce, 45);
  const tag = useTypewriter(TAG, tagStart && !reduce, 24);
  const para = useTypewriter(PARA, paraStart && !reduce, 22);

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

        <p className="hero-haze mt-8 font-slab text-2xl sm:text-3xl leading-snug text-base-content/85 min-h-[1.4em]">
          {tagText}
          {tagTyping && <Caret />}
        </p>

        <p className="hero-haze mt-9 max-w-2xl text-lg sm:text-xl leading-relaxed text-base-content/90 whitespace-pre-line min-h-[6.5em] sm:min-h-[5em]">
          {paraText}
          {paraTyping && <Caret />}
        </p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={false}
          animate={{ opacity: ctaIn ? 1 : 0, y: ctaIn ? 0 : 8 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="#thesis"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-content shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            come see how
            <span aria-hidden="true" className="text-lg">↓</span>
          </a>
          <PdfViewer label="open résumé" variant="ghost" />
        </motion.div>
      </div>

      <div className="lg:col-span-5 flex justify-center lg:justify-end">
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
