import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "../data/site";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".about-me > *", {
          y: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-me",
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      }, rootRef);
      return () => ctx.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{siteData.about.title}</h3>
        <p className="para">{siteData.about.body}</p>
      </div>
    </div>
  );
};

export default About;
