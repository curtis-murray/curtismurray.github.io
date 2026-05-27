import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Types `text` out once, when the island hydrates (client:visible → roughly
// when it scrolls into view). Reduced-motion shows the full text immediately.
export default function TypeOnView({ text, speed = 26 }) {
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
  return (
    <>
      {text.slice(0, n)}
      {!reduce && !done && <span className="type-caret" aria-hidden="true" />}
    </>
  );
}
