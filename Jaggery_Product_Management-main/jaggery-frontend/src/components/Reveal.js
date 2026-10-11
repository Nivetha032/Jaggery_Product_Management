import React, { useEffect, useRef } from "react";

// Adds the "in" class once the element scrolls into view.
export const Reveal = ({ as: Tag = "div", delay = 0, className = "", children, ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
