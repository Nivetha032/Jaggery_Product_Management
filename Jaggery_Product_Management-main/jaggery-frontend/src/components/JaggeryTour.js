import React, { useEffect, useRef, useState } from "react";
import { TOUR_STOPS } from "../data/jaggeryData";
import Reveal from "./Reveal";

// Scroll-driven tour: a jaggery marker travels down the path as you scroll.
const JaggeryTour = () => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.55 - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="section tour-section" id="tour">
      <div className="container">
        <Reveal className="section-heading">
          <span className="eyebrow">Jaggery Tour</span>
          <h2>Journey of a Jaggery Block</h2>
          <p>Scroll to follow our jaggery from the cane field to your kitchen.</p>
        </Reveal>

        <div className="tour" ref={ref} style={{ "--p": progress }}>
          <div className="tour-line" />
          <div className="tour-fill" />
          <div className="tour-marker" aria-hidden="true">🍯</div>
          <div className="tour-stops">
            {TOUR_STOPS.map((stop, i) => (
              <div key={stop.place} className={`tour-stop ${progress * TOUR_STOPS.length >= i + 0.15 ? "active" : ""}`}>
                <div className="tour-card">
                  <span className="tour-icon">{stop.icon}</span>
                  <div>
                    <small>Stop {i + 1}</small>
                    <h3>{stop.place}</h3>
                    <p>{stop.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JaggeryTour;
