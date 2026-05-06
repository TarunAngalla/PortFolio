import { PropsWithChildren } from "react";
import { siteData } from "../data/site";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const { hero } = siteData;

  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>{hero.greeting}</h2>
          <h1>
            {hero.firstName}
            <br />
            <span>{hero.lastName}</span>
          </h1>
        </div>
        <div className="landing-info">
          <span className="landing-info-h3-line" aria-hidden="true" />
          <h3>{hero.preTitle}</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">{hero.rotatingPrimary[0]}</div>
            <div className="landing-h2-2">{hero.rotatingPrimary[1]}</div>
          </h2>
          <h2>
            <div className="landing-h2-info">{hero.rotatingSecondary[0]}</div>
            <div className="landing-h2-info-1">{hero.rotatingSecondary[1]}</div>
          </h2>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Landing;
