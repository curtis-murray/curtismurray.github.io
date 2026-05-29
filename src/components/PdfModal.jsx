import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { track } from "../lib/track.js";

const PDF = "/Curtis_Murray_Resume.pdf";

// Controlled in-page PDF viewer (modal iframe) with download / open-in-tab
// fallbacks. Esc closes; body scroll locks while open. Trigger lives elsewhere
// (PdfViewer button, WouldYouRather card) so the modal can be reused.
export default function PdfModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex w-full max-w-4xl h-[90vh] flex-col overflow-hidden rounded-2xl bg-base-100 ring-1 ring-base-300/60 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-base-300/50">
              <span className="text-sm font-medium text-base-content/70 truncate">
                curtis murray · résumé
              </span>
              <div className="flex items-center gap-1">
                <a
                  href={PDF}
                  download
                  onClick={() => track("resume_downloaded")}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-base-content/70 hover:text-primary hover:bg-base-200/70 transition-colors"
                >
                  <FaDownload className="text-[0.9em]" /> download
                </a>
                <a
                  href={PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("resume_opened_in_tab")}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-base-content/70 hover:text-primary hover:bg-base-200/70 transition-colors"
                >
                  <FaExternalLinkAlt className="text-[0.85em]" /> open in tab
                </a>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <iframe
              src={`${PDF}#view=FitH&toolbar=0`}
              title="Curtis Murray résumé"
              className="flex-1 w-full bg-base-200"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
