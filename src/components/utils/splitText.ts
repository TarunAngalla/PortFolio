import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  const paras = gsap.utils.toArray<HTMLElement>(".para");
  const titles = gsap.utils.toArray<HTMLElement>(".title");
  const TriggerStart = window.innerWidth <= 1024 ? "top 70%" : "20% 65%";

  paras.forEach((para) => {
    gsap.fromTo(
      para,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: para.parentElement?.parentElement || para,
          start: TriggerStart,
          once: true,
        },
      }
    );
  });

  titles.forEach((title) => {
    gsap.fromTo(
      title,
      { autoAlpha: 0, y: 60, rotate: 3 },
      {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title.parentElement?.parentElement || title,
          start: TriggerStart,
          once: true,
        },
      }
    );
  });
}
