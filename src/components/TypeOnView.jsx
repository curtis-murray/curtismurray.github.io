import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Types `text` out once, when the island hydrates (client:visible → roughly
// when it scrolls into view). Reduced-motion shows the full text immediately.
//
// Reflow-safe: an invisible copy of the FULL text reserves the final size and
// line-wrapping up front, and the typed characters are painted on top
// (absolutely positioned), so surrounding content never shifts while it types.
export default function TypeOnView({ text, speed = 33 }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(text.length);
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
  }, [text, speed, reduce]);

  const done = n >= text.length;

  if (reduce) return <>{text}</>;

  return (
    <span className="relative block">
      {/* sizer: full text, real wrap → locks height + line positions */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      {/* typed overlay, left/top aligned over the sizer */}
      <span className="absolute inset-0">
        {text.slice(0, n)}
        {!done && <span className="type-caret" aria-hidden="true" />}
      </span>
    </span>
  );
}
