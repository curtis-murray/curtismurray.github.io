import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import PdfModal from "./PdfModal.jsx";
import { track } from "../lib/track.js";

// The résumé page opens on a self-aware choice: the dull PDF, or the vibe-coded
// live page. Picking "vibe coded" reveals the merged content (#grind-content,
// progressively enhanced — it's visible by default for no-JS / crawlers) and
// smooth-scrolls down to it.
export default function WouldYouRather() {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    track("resume_choice", { choice: "vibe_coded" });
    setRevealed(true);
    const el = document.getElementById("grind-content");
    if (!el) return;
    el.classList.add("revealed");
    requestAnimationFrame(() =>
      setTimeout(() => {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -24 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60)
    );
  };

  return (
    <div className="mt-8">
      <p className="font-slab text-lg sm:text-xl text-base-content/80 mb-4">
        would you rather…
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {/* The boring one — deliberately drab. */}
        <button
          type="button"
          onClick={() => {
            track("resume_choice", { choice: "boring_pdf" });
            track("resume_opened", { source: "would_you_rather" });
            setPdfOpen(true);
          }}
          className="group text-left rounded-2xl bg-base-200/40 ring-1 ring-base-300/60 px-5 py-5 transition-all duration-300 hover:ring-base-content/30 hover:bg-base-200/60"
        >
          <span className="flex items-center gap-2 text-base-content/60">
            <FaFilePdf className="text-base" />
            <span className="font-medium text-base-content/80">
              the boring pdf version
            </span>
          </span>
          <span className="mt-1.5 block text-sm text-base-content/55">
            <span className="block group-hover:hidden">
              a tidy one-pager. for people in a hurry, and applicant tracking
              systems.
            </span>
            <span className="hidden group-hover:block italic text-base-content/70">
              go on then, i won't judge you too much.
            </span>
          </span>
        </button>

        {/* The fun one — primary, lifts, sparkles. */}
        <button
          type="button"
          onClick={reveal}
          aria-expanded={revealed}
          className="group relative overflow-hidden text-left rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-5 py-5 text-primary-content shadow-lg shadow-primary/25 ring-1 ring-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
        >
          <span className="flex items-center gap-2">
            <LuSparkles className="text-base animate-pulse" />
            <span className="font-semibold">vibe coded for your pleasure</span>
          </span>
          <span className="mt-1.5 block text-sm text-primary-content/85">
            {revealed
              ? "enjoy the scenic route ↓"
              : "the scenic route — grounded facts, animations and all."}
          </span>
        </button>
      </div>

      <PdfModal open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </div>
  );
}
