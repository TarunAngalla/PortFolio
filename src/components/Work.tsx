import { useRef } from "react";
import "./styles/Work.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData, type WorkPlaceholderVariant } from "../data/site";
import WorkCardMedia from "./WorkCardMedia";

gsap.registerPlugin(ScrollTrigger);

const placeholderById: Record<string, WorkPlaceholderVariant> = {
  anvikshiki: "ai-dashboard",
  bds: "marketing",
  usereasyshop: "android",
  cyberbullying: "nlp-dashboard",
  "resume-matching": "hiring-dashboard",
};

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const ctx = gsap.context(() => {
        gsap.from(".work-section__head > *", {
          y: 36,
          opacity: 0,
          duration: 0.72,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-section__head",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });

        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
          gsap.from(card, {
            y: 56,
            opacity: 0,
            x: i % 2 === 0 ? -28 : 28,
            duration: 0.88,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-section__head">
          <h2>
            {siteData.headings.work.lead} <span>{siteData.headings.work.emphasis}</span>
          </h2>
          <p className="work-lead">{siteData.headings.work.sub}</p>
        </div>
        <div className="work-grid">
          {siteData.work.map((project) => (
            <article className="work-card" key={project.id}>
              <WorkCardMedia
                image={project.image}
                imageAlt={project.imageAlt}
                link={project.link}
                placeholderVariant={placeholderById[project.id] ?? "ai-dashboard"}
              />
              <div className="work-card__body">
                <div className="work-card__meta">
                  <span className="work-card__num">{project.number}</span>
                  <span className="work-card__category">{project.category}</span>
                </div>
                <h3 className="work-card__title">{project.title}</h3>
                <p className="work-card__tagline">{project.tagline}</p>
                <p className="work-card__desc">{project.description}</p>
                <ul className="work-card__highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ul className="work-card__stack" aria-label="Tech stack">
                  {project.stack.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
