import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import PdfModal from "./PdfModal.jsx";
import { track } from "../lib/track.js";

// Button that opens the résumé in an in-page PDF viewer (modal iframe), with
// download / open-in-tab fallbacks. Usable as an island anywhere.
export default function PdfViewer({
  label = "open résumé",
  variant = "primary",
  source = "pdf_viewer_button",
}) {
  const [open, setOpen] = useState(false);

  const btn =
    variant === "ghost"
      ? "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-base-content ring-1 ring-base-content/25 transition-all hover:ring-primary hover:text-primary"
      : "inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-content shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl";

  return (
    <>
      <button
        onClick={() => {
          track("resume_opened", { source });
          setOpen(true);
        }}
        className={btn}
      >
        <FaFilePdf className="text-[0.95em]" />
        {label}
      </button>
      <PdfModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
