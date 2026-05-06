import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "../data/site";
import "./styles/Career.css";

gsap.registerPlugin(ScrollTrigger);

const Career = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { career: heading } = siteData.headings;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".career-container > h2, .career-lead", {
          y: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".career-container",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(".career-info-box", {
          y: 44,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".career-info",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }, rootRef);
      return () => ctx.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="career-section section-container">
      <div className="career-container">
        <h2>
          {heading.lead} <span>{heading.emphasis}</span>
          <br /> {heading.tail}
        </h2>
        <p className="career-lead">{heading.sub}</p>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {siteData.career.map((item) => (
            <div className="career-info-box" key={`${item.company}-${item.role}-${item.year}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.year}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
