import React, { useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { STAGES, STAGE_VIDEOS, FULL_VIDEO } from "../data/jaggeryData";
import Reveal from "./Reveal";

const STAGE_SECONDS = 5;
const DOTS = Array.from({ length: 8 });

// A video-style player: each stage plays an animated scene (or a real video if one is configured).
const ProcessPlayer = () => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [full, setFull] = useState(false);
  const stage = STAGES[index];
  const video = STAGE_VIDEOS[stage.id];
  const go = (n) => setIndex((n + STAGES.length) % STAGES.length);

  return (
    <section className="section process-section" id="process">
      <div className="container">
        <Reveal className="section-heading">
          <span className="eyebrow light">Watch &amp; Learn</span>
          <h2>How Jaggery Is Prepared</h2>
          <p>Follow the six steps from cane to cube. Pick any step, or let it play.</p>
        </Reveal>

        <div className="pp-toggle">
          <button className={`btn ${full ? "btn-outline-light" : "btn-primary"}`} onClick={() => setFull((f) => !f)}>
            {full ? "Back to step-by-step" : <><FaPlay size={12} /> Watch full video</>}
          </button>
        </div>

        <Reveal className="pp">
          <div className="pp-stage">
            {full ? (
              <video className="pp-media pp-full" src={FULL_VIDEO} controls autoPlay playsInline />
            ) : video ? (
              video.youtube ? (
                <iframe className="pp-media" title={stage.title} src={`https://www.youtube.com/embed/${video.youtube}`} allowFullScreen />
              ) : (
                <video className="pp-media" src={video.src} controls autoPlay muted loop playsInline />
              )
            ) : (
              <div className={`pp-scene anim-${stage.anim}`} key={stage.id}>
                <div className="pp-icon">{stage.icon}</div>
                {DOTS.map((_, i) => (
                  <span key={i} className="pp-dot" style={{ "--x": `${14 + i * 10}%`, "--d": `${i * 0.3}s` }} />
                ))}
              </div>
            )}

            {!full && (
            <div className="pp-caption">
              <span className="pp-step">Step {index + 1} of {STAGES.length}</span>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
              <div className="pp-controls">
                <button onClick={() => go(index - 1)} aria-label="Previous step"><FaStepBackward /></button>
                <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={() => go(index + 1)} aria-label="Next step"><FaStepForward /></button>
              </div>
            </div>
            )}

            {!full && !video && (
              <span
                key={`${stage.id}-bar`}
                className="pp-progress"
                style={{ animationDuration: `${STAGE_SECONDS}s`, animationPlayState: playing ? "running" : "paused" }}
                onAnimationEnd={() => go(index + 1)}
              />
            )}
          </div>

          <ol className="pp-steps">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <button className={`${i === index ? "active" : ""} ${i < index ? "done" : ""}`} onClick={() => { setIndex(i); setFull(false); }}>
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
