import type { CSSProperties } from "react";
import { useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techCapabilities, techStack } from "../data/techStack";

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const stripItems = useMemo(() => [...techStack, ...techStack], []);

  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <section className="techstack" aria-labelledby="techstack-heading">
      <div className="techstack-head">
        <h2 id="techstack-heading">My Tech Stack</h2>
        <p className="techstack-sub">
          Tools I ship with — languages, frameworks, data stores, and cloud.
        </p>
      </div>

      <div className="tech-strip-wrap">
        <div className="tech-strip-track">
          {stripItems.map((item, idx) => (
            <div
              className="tech-pill"
              key={`${item.name}-${idx}`}
              style={{ "--pill-accent": item.glow } as CSSProperties}
            >
              <item.icon aria-hidden />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tech-cap-grid" aria-label="Engineering capabilities">
        {techCapabilities.map((capability) => (
          <article className="tech-cap-card" key={capability.title}>
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
