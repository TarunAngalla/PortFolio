import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/WhatIDo.css";
import { siteData } from "../data/site";

gsap.registerPlugin(ScrollTrigger);

const WhatIDo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          const handler = () => handleClick(container);
          container.dataset.clickBound = "true";
          container.addEventListener("click", handler);
          (container as any).__handler = handler;
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container && (container as any).__handler) {
          container.removeEventListener("click", (container as any).__handler);
        }
      });
    };
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = rootRef.current;
      if (!root) return;

      const ctx = gsap.context(() => {
        const cardsHost = root.querySelector(".what-box-in");
        gsap.from(".what-box-header", {
          y: 42,
          opacity: 0,
          duration: 0.78,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });

        if (cardsHost) {
          gsap.from(".what-content", {
            y: 48,
            opacity: 0,
            duration: 0.72,
            stagger: 0.11,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsHost,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        }
      }, root);
      return () => ctx.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="whatIDO">
      <div className="what-box">
        <div className="what-box-header">
          <h2 className="title">
            {siteData.whatIDo.title[0]}
            <span className="hat-h2">{siteData.whatIDo.title[1]}</span>
            <div>
              {siteData.whatIDo.title[2]}
              <span className="do-h2">{siteData.whatIDo.title[3]}</span>
            </div>
          </h2>
          <p className="what-lead">{siteData.whatIDo.lead}</p>
        </div>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line x1="0" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
              <line x1="100%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="7,7" />
            </svg>
          </div>

          {siteData.whatIDo.cards.map((card, index) => (
            <div className="what-content what-noTouch" ref={(el) => setRef(el, index)} key={card.title}>
              <div className="what-border1">
                <svg height="100%">
                  <line x1="0" y1={index === 0 ? "0" : "100%"} x2="100%" y2={index === 0 ? "0" : "100%"} stroke="white" strokeWidth="2" strokeDasharray="6,6" />
                  {index === 0 && <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6,6" />}
                </svg>
              </div>
              <div className="what-corner"></div>
              <div className="what-content-in">
                <h3>{card.title}</h3>
                <h4>{card.subtitle}</h4>
                <p>{card.description}</p>
                <h5>{card.toolsTitle}</h5>
                <div className="what-content-flex">
                  {card.tools.map((tool) => (
                    <div className="what-tags" key={tool}>{tool}</div>
                  ))}
                </div>
                <div className="what-arrow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);
    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
