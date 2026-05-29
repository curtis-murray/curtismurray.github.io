import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import PdfModal from "./PdfModal.jsx";
import { track } from "../lib/track.js";

// Small, tasteful "prefer the boring pdf?" trigger. The base markup is a real
// anchor to the PDF, so it works before hydration and with JS off; once
// hydrated, clicking opens the in-page PdfModal viewer instead of navigating.
export default function PdfLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="/Curtis_Murray_Resume.pdf"
        onClick={(e) => {
          e.preventDefault();
          track("resume_opened", { source: "hurry_link" });
          setOpen(true);
        }}
        className="group inline-flex items-center gap-2 text-sm text-base-content/55 hover:text-primary transition-colors"
      >
        <FaFilePdf className="text-[0.95em]" />
        <span>
          or, if you're in a hurry,{" "}
          <span className="underline decoration-base-content/25 underline-offset-2 group-hover:decoration-primary">
            the boring pdf
          </span>{" "}
          →
        </span>
      </a>
      <PdfModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
