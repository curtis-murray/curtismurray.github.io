import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Sticky desktop scroll-spy rail for the grind journey. Highlights the chapter
// currently in view and jumps to one on click. Pure navigation enhancement:
// it's a client island (hidden on no-JS), and every chapter is still reachable
// by ordinary scrolling without it.
//
// Buttons (not <a href="#…">) on purpose — Layout's global anchor handler
// hijacks in-page anchor clicks with its own offset, so we drive the scroll
// ourselves with a larger offset that clears the sticky top nav.
export default function JourneyRail({ chapters }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter(Boolean);
    if (!sections.length) return;

    // A thin band across the vertical middle of the viewport — a section is
    // "active" while it crosses that band, giving one clean highlight.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="résumé chapters"
      className="hidden lg:block sticky top-24 self-start"
    >
      <ul className="space-y-3 border-l border-base-300/50 pl-4">
        {chapters.map((c) => {
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => go(c.id)}
                aria-current={active ? "true" : undefined}
                className={`group block text-left text-base leading-snug transition-colors ${
                  active
                    ? "text-primary font-medium"
                    : "text-base-content/55 hover:text-base-content/90"
                }`}
              >
                <span
                  className={`mr-2 inline-block transition-all ${
                    active ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60"
                  }`}
                  aria-hidden="true"
                >
                  ›
                </span>
                {c.rail}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

JourneyRail.propTypes = {
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      rail: PropTypes.string.isRequired,
    })
  ).isRequired,
};
