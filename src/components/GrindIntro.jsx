import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuChevronsDown, LuSparkles, LuSparkle } from "react-icons/lu";
import PdfModal from "./PdfModal.jsx";
import { track } from "../lib/track.js";

// The grind's dramatic single-screen opening. "the grind" types itself, then the
// rest of the hero fades up: the understated "boring pdf" floating in the middle
// of a lot of empty space, and the prominent "scenic tour" in the bottom third
// with a down-arrow cue. The journey below (#journey) stays hidden until the
// visitor commits — clicks the scenic tour or scrolls down a touch.
const TITLE = "the grind";
const SUB =
  "freshly ground, lightly roasted, mildly over-steeped, dangerously over-caffeinated — have a brews.";
const JUDGE = "go ahead, i won't judge too much.";

// Types `text` out while `active`; empties when inactive. Reduced-motion shows
// the full text immediately (and nothing when inactive).
function useTypewriter(text, active, speed, reduce) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(active ? text.length : 0);
      return;
    }
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
  }, [text, active, speed, reduce]);
  return text.slice(0, n);
}

// Reveals #journey (the index + chapters) once and scrolls to its first section
// when asked. Idempotent — the class toggle is cheap to repeat.
function revealJourney(scroll) {
  const j = document.getElementById("journey");
  if (j) j.classList.add("revealed");
  if (!scroll) return;
  const el = document.getElementById("studied");
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -24 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function GrindIntro() {
  const reduce = useReducedMotion();
  const [pdfOpen, setPdfOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // "the grind" types first; the rest of the hero stays hidden until it lands.
  const title = useTypewriter(TITLE, true, 95, reduce);
  const titleDone = title.length >= TITLE.length;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduce) {
      setShown(true);
      return;
    }
    if (!titleDone) return;
    const t = setTimeout(() => setShown(true), 260);
    return () => clearTimeout(t);
  }, [titleDone, reduce]);

  // The hover aside under "the boring pdf" types in only on hover.
  const judge = useTypewriter(JUDGE, hovered, 28, reduce);
  const judgeDone = judge.length >= JUDGE.length;

  // Drive the always-mounted clippy video: hover plays it, mouse-leave
  // pauses and rewinds to the first frame so the next hover always restarts
  // the crying arc from the start. Forcing currentTime=0 right after mount
  // helps Safari/Firefox actually paint the first frame instead of showing
  // black until the video is interacted with.
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && !reduce) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* some browsers throw before metadata loads — harmless */
      }
    }
  }, [hovered, reduce]);

  // Scrolling down even a little commits you to the journey — reveal it (but
  // don't yank the scroll; the visitor is already moving).
  const armed = useRef(false);
  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      if (armed.current) return;
      if (window.scrollY > 24) {
        armed.current = true;
        revealJourney(false);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  const onTour = (e) => {
    e.preventDefault();
    track("resume_choice", { choice: "scenic_tour" });
    revealJourney(true);
  };

  // Fade-up stagger for everything that follows the typed title.
  const container = {
    hide: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } },
  };
  const item = {
    hide: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="flex min-h-[100svh] flex-col"
      variants={container}
      initial="hide"
      animate={shown ? "show" : "hide"}
    >
      {/* top: the typed title + a subtitle that fades in behind it */}
      <header className="pt-8 lg:pt-14">
        <h1 className="font-slab font-bold text-base-content text-4xl sm:text-5xl tracking-tight">
          {reduce ? (
            TITLE
          ) : (
            <span className="relative inline-block">
              <span className="invisible" aria-hidden="true">
                {TITLE}
              </span>
              <span className="absolute inset-0 whitespace-nowrap">
                {title}
                {!titleDone && <span className="type-caret" aria-hidden="true" />}
              </span>
            </span>
          )}
        </h1>
        <motion.p
          variants={item}
          className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/75"
        >
          {SUB}
        </motion.p>
      </header>

      {/* centre: clippy guards the boring pdf, sad until you hover */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          variants={item}
          className="flex flex-col items-center text-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            type="button"
            onClick={() => {
              track("resume_choice", { choice: "boring_pdf" });
              track("resume_opened", { source: "grind_boring_pdf" });
              setPdfOpen(true);
            }}
            className="group inline-flex flex-col items-center gap-2 text-sm text-base-content/55 hover:text-primary transition-colors"
            aria-label="open the boring pdf"
          >
            {/* video is always mounted, paused on its first frame. hover
                plays it; mouse-leave pauses and rewinds to frame 0, so the
                next hover always restarts the crying arc from the beginning. */}
            <span className="relative block h-20 w-16">
              <video
                ref={videoRef}
                src="/clippy-sad.webm"
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </span>
            <span className="underline decoration-base-content/25 underline-offset-2 group-hover:decoration-primary">
              the boring pdf
            </span>
          </button>
          {/* hover-typed aside; min-height reserved so it never nudges layout */}
          <span
            className="mt-1.5 block min-h-[1.25em] text-xs italic text-base-content/45"
            aria-hidden={!hovered}
          >
            {judge}
            {hovered && !reduce && !judgeDone && (
              <span className="type-caret" aria-hidden="true" />
            )}
          </span>
        </motion.div>
      </div>

      {/* the scenic tour: text + sparkles, with the bouncing grey chevron
          underneath — same descent-cue motif as the about page, no orange pill.
          extra bottom padding pulls it up off the very edge of the viewport. */}
      <motion.div
        variants={item}
        className="flex flex-col items-center gap-3 pb-28 sm:pb-36"
      >
        <a
          href="#studied"
          onClick={onTour}
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
            the scenic tour
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

      <PdfModal open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </motion.div>
  );
}
