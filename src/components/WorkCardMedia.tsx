import type { WorkPlaceholderVariant } from "../data/site";
import { isLiveWorkLink } from "../data/site";

type Props = {
  image: string | null;
  imageAlt: string;
  link: string | null;
  placeholderVariant: WorkPlaceholderVariant;
};

function PlaceholderFrame({ variant, label }: { variant: WorkPlaceholderVariant; label: string }) {
  return (
    <div className={`work-card-media__ph work-card-media__ph--${variant}`} aria-hidden="true">
      <span className="work-card-media__ph-label">{label}</span>
    </div>
  );
}

const phLabel: Record<WorkPlaceholderVariant, string> = {
  "ai-dashboard": "AI dashboard",
  marketing: "Marketing site",
  android: "Android app",
  "nlp-dashboard": "NLP dashboard",
  "hiring-dashboard": "Hiring intelligence",
};

export default function WorkCardMedia({ image, imageAlt, link, placeholderVariant }: Props) {
  const live = isLiveWorkLink(link);
  const mediaInner = image ? (
    <img className="work-card-media__img" src={image} alt={imageAlt} loading="lazy" />
  ) : (
    <PlaceholderFrame variant={placeholderVariant} label={phLabel[placeholderVariant]} />
  );

  const footer = live ? (
    <span className="work-card-media__cta">Visit Website</span>
  ) : (
    <span className="work-card-media__soon">Preview coming soon</span>
  );

  if (live) {
    return (
      <a
        className="work-card-media work-card-media--linked"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
        aria-label={`${imageAlt} — visit website`}
      >
        <div className="work-card-media__frame">{mediaInner}</div>
        <div className="work-card-media__bar">{footer}</div>
      </a>
    );
  }

  return (
    <div className="work-card-media" role="img" aria-label={imageAlt}>
      <div className="work-card-media__frame">{mediaInner}</div>
      <div className="work-card-media__bar">{footer}</div>
    </div>
  );
}
