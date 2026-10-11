import React, { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { STAGES, FULL_VIDEO, VIDEO_TIMING } from "../data/jaggeryData";
import Reveal from "./Reveal";

const { intro, stage } = VIDEO_TIMING;

// The video starts paused. Click play to start it; click a step to jump to that part.
const ProcessPlayer = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);

  const play = () => videoRef.current.play().catch(() => {});

  const onTime = () => {
    const i = Math.floor((videoRef.current.currentTime - intro) / stage);
    setActive(i >= 0 && i < STAGES.length ? i : -1);
  };

  const jump = (i) => {
    videoRef.current.currentTime = intro + i * stage + 0.05;
    play();
  };

  return (
    <section className="section process-section" id="process">
      <div className="container">
        <Reveal className="section-heading">
          <span className="eyebrow light">Watch &amp; Learn</span>
          <h2>How Jaggery Is Prepared</h2>
          <p>Press play to watch the full process, or jump straight to any step.</p>
        </Reveal>

        <Reveal className="pp">
          <div className="pp-stage">
            <video
              ref={videoRef}
              className="pp-media"
              src={FULL_VIDEO}
              controls
              preload="metadata"
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={onTime}
            />
            {!playing && (
              <button className="pp-bigplay" onClick={play} aria-label="Play video">
                <FaPlay />
              </button>
            )}
          </div>

          <ol className="pp-steps">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <button
                  className={`${i === active ? "active" : ""} ${i < active ? "done" : ""}`}
                  onClick={() => jump(i)}
                >
                  <span className="pp-step-icon">{s.icon}</span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
};

export default ProcessPlayer;