import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BeyondInterest, BeyondInterestVariant } from "../data/site";
import { siteData } from "../data/site";
import "./styles/BeyondTheBuild.css";

gsap.registerPlugin(ScrollTrigger);

function InterestVisual({
  variant,
  imageSrc,
  imageAlt,
}: {
  variant: BeyondInterestVariant;
  imageSrc?: string;
  imageAlt?: string;
}) {
  if (variant === "markets-photo" && imageSrc) {
    return (
      <div className="beyond-media beyond-media--photo beyond-media--compact">
        <div className="beyond-photo-shell">
          <img src={imageSrc} alt={imageAlt ?? ""} loading="lazy" decoding="async" />
        </div>
      </div>
    );
  }

  if (variant === "tennis-css") {
    return (
      <div className="beyond-media beyond-media--visual beyond-visual beyond-visual--tennis" aria-hidden="true">
        <span className="beyond-vis-cover" />
        <span className="beyond-vis-tennis-court" />
        <span className="beyond-vis-tennis-spot" />
        <span className="beyond-vis-tennis-silhouette" />
        <span className="beyond-vis-tennis-racket" />
        <span className="beyond-vis-tennis-motion" />
      </div>
    );
  }

  return (
    <div className="beyond-media beyond-media--visual beyond-visual beyond-visual--ai" aria-hidden="true">
      <span className="beyond-vis-ai-base" />
      <span className="beyond-vis-ai-grid" />
      <span className="beyond-vis-ai-flow" />
      <span className="beyond-vis-ai-nodes" />
      <span className="beyond-vis-ai-core" />
    </div>
  );
}

function InterestCard({ item }: { item: BeyondInterest }) {
  return (
    <article className="beyond-card beyond-card--interest">
      <InterestVisual variant={item.variant} imageSrc={item.imageSrc} imageAlt={item.imageAlt} />
      <div className="beyond-card__body">
        <p className="beyond-card__kicker">{item.subtitle}</p>
        <h3 className="beyond-card__title">{item.title}</h3>
        <p className="beyond-card__desc">{item.body}</p>
      </div>
    </article>
  );
}

export default function BeyondTheBuild() {
  const rootRef = useRef<HTMLElement>(null);
  const { beyondTheBuild: data } = siteData;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.from(".beyond-head > *", {
          y: 36,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".beyond-section",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
        gsap.from(".beyond-card", {
          y: 44,
          opacity: 0,
          duration: 0.72,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".beyond-cinematic",
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
    <section ref={rootRef} className="beyond-section" id="beyond" aria-labelledby="beyond-heading">
      <div className="beyond-inner">
        <header className="beyond-head">
          <h2 id="beyond-heading">
            {data.title.replace(/\sBuild$/, "")} <span className="beyond-head-accent">Build</span>
          </h2>
          <p className="beyond-lead">{data.lead}</p>
        </header>

        <div className="beyond-cinematic">
          <article className="beyond-card beyond-card--hero">
            <div className="beyond-media beyond-media--photo beyond-media--hero">
              <div className="beyond-photo-shell">
                <img
                  src={data.hero.imageSrc}
                  alt={data.hero.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="beyond-card__body beyond-card__body--hero">
              <p className="beyond-card__kicker">{data.hero.kicker}</p>
              <h3 className="beyond-card__title">{data.hero.title}</h3>
              <p className="beyond-card__desc">{data.hero.body}</p>
            </div>
          </article>

          <div className="beyond-stack">{data.interests.map((item) => (
            <InterestCard key={item.id} item={item} />
          ))}</div>
        </div>
      </div>
    </section>
  );
}
