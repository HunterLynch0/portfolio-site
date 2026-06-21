import { useEffect, useRef, useState } from "react";
import { useSectionMotion } from "../hooks/useScrollProgress";
import "../styles/Timeline.css";

function Timeline({ journeyItems }) {
  const sectionRef = useSectionMotion();
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0.18,
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline-section cinematic-section" id="journey" ref={sectionRef}>
      <div className="section-heading" data-reveal>
        <p className="command-line">
          <span className="prompt">$</span> trace journey.nodes
        </p>
        <p className="eyebrow">Education / Journey</p>
        <h2>A path through study, systems projects, and internship readiness.</h2>
      </div>

      <div className="timeline-shell">
        <div className="timeline-line" aria-hidden="true">
          <span style={{ transform: `scaleY(${journeyItems.length <= 1 ? 1 : activeIndex / (journeyItems.length - 1)})` }}></span>
        </div>

        {journeyItems.map((item, index) => (
          <article
            className={`timeline-item glass-panel tilt-surface ${index === activeIndex ? "is-active" : ""}`}
            data-index={index}
            data-reveal
            key={`${item.period}-${item.title}`}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            style={{ "--delay": `${index * 80}ms` }}
          >
            <div className="timeline-node" aria-hidden="true"></div>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <strong>{item.meta}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
