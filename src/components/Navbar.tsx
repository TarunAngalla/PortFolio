import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { siteData } from "../data/site";
import "./styles/Navbar.css";

const Navbar = () => {
  useEffect(() => {
    const links = document.querySelectorAll(".header ul a");
    const clickHandlers: Array<{ element: Element; handler: EventListener }> = [];

    links.forEach((elem) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const section = (e.currentTarget as HTMLAnchorElement).getAttribute("data-href");
        if (section) {
          document.querySelector(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      elem.addEventListener("click", handler);
      clickHandlers.push({ element: elem, handler });
    });

    gsap.set([".header", ".icons-section", ".nav-fade"], { opacity: 0 });

    return () => {
      clickHandlers.forEach(({ element, handler }) => element.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-brand" data-cursor="disable">
          <img className="navbar-logo" src={siteData.brand.logoSrc} alt="" width={44} height={44} decoding="async" />
          <span className="navbar-logo-sr">{siteData.brand.logoAlt}</span>
        </a>
        <a href={`mailto:${siteData.brand.email}`} className="navbar-connect" data-cursor="disable">{siteData.brand.email}</a>
        <ul>
          <li><a data-href="#about" href="#about"><HoverLinks text="ABOUT" /></a></li>
          <li><a data-href="#work" href="#work"><HoverLinks text="WORK" /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>
      </div>
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
