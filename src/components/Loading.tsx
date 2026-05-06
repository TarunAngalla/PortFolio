import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import { siteData } from "../data/site";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent < 100 || loaded) return;
    const t1 = window.setTimeout(() => setLoaded(true), 450);
    return () => clearTimeout(t1);
  }, [percent, loaded]);

  useEffect(() => {
    if (!loaded || isLoaded) return;
    const t2 = window.setTimeout(() => setIsLoaded(true), 900);
    return () => clearTimeout(t2);
  }, [loaded, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    let revealTimeout: ReturnType<typeof setTimeout> | undefined;
    const cancelled = { current: false };
    import("./utils/initialFX")
      .then((module) => {
        if (cancelled.current) return;
        setClicked(true);
        revealTimeout = window.setTimeout(() => {
          if (cancelled.current) return;
          module.initialFX?.();
          setIsLoading(false);
        }, 850);
      })
      .catch((err) => {
        console.error("initialFX chunk failed:", err);
        if (cancelled.current) return;
        setClicked(true);
        document.body.style.overflowY = "auto";
        document.getElementsByTagName("main")[0]?.classList.add("main-active");
        setIsLoading(false);
      });
    return () => {
      cancelled.current = true;
      if (revealTimeout) clearTimeout(revealTimeout);
    };
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  const marquee = [...siteData.loading.marquee, ...siteData.loading.marquee];

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-brand" data-cursor="disable">
          <img className="loader-logo" src={siteData.brand.logoSrc} alt="" width={44} height={44} decoding="async" />
          <span className="loader-logo-sr">{siteData.brand.logoAlt}</span>
        </a>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => <div className="loaderGame-line" key={index}></div>)}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>

      <div className="loading-screen">
        <div className="loading-marquee">
          <div className="loading-marquee-track">
            {marquee.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </div>

        <div className={`loading-wrap ${clicked ? "loading-clicked" : ""}`} onMouseMove={handleMouseMove}>
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
