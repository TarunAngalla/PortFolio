import gsap from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  gsap.to("body", { backgroundColor: "#050816", duration: 0.5, delay: 0.8 });

  /* The second variant of each rotating line sits absolutely on top of the
     first one. Pin it hidden BEFORE any animation so the first label is
     actually visible until the swap kicks in. */
  gsap.set([".landing-h2-2", ".landing-h2-info-1"], { opacity: 0, y: 80 });
  gsap.set([".landing-h2-1", ".landing-h2-info"], { opacity: 1, y: 0 });

  gsap.fromTo(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    { opacity: 0, y: 80, filter: "blur(6px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.08, ease: "power3.out", delay: 0.25 }
  );

  gsap.fromTo(
    [".landing-h2-1", ".landing-h2-info"],
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power2.out", delay: 0.7 }
  );

  gsap.fromTo([".header", ".icons-section", ".nav-fade"], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power1.out", delay: 0.1 });

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.4,
    defaults: { duration: 0.9, ease: "power3.inOut" },
    delay: 2.2,
  });
  tl.to([".landing-h2-1", ".landing-h2-info"], { y: -80, opacity: 0, stagger: 0.04 })
    .fromTo(
      [".landing-h2-2", ".landing-h2-info-1"],
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04 },
      "<0.15"
    )
    .to([".landing-h2-2", ".landing-h2-info-1"], { y: -80, opacity: 0, stagger: 0.04, delay: 2.4 })
    .fromTo(
      [".landing-h2-1", ".landing-h2-info"],
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04 },
      "<0.15"
    );
}
