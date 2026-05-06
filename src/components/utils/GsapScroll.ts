import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import gsap from "gsap";
import {
  SceneSection,
  setActiveSection,
} from "../Character/utils/sceneState";
gsap.registerPlugin(ScrollTrigger);

/**
 * Section-state ScrollTriggers. Each fires on enter / enter-back and
 * asks the scene controller to transition. Kept module-level so
 * `setCharTimeline` can rebuild them cleanly on HMR / remount.
 */
let sectionTriggers: ScrollTrigger[] = [];

function installSectionTriggers(): void {
  // Kill any triggers left over from a previous mount.
  sectionTriggers.forEach((t) => t.kill());
  sectionTriggers = [];

  const bindings: Array<{ selector: string; start: string; section: SceneSection }> = [
    { selector: ".landing-section", start: "top 65%", section: "landing" },
    { selector: ".about-section", start: "top 65%", section: "about" },
    { selector: ".whatIDO", start: "top 70%", section: "product" },
    // `ai` spans career + techstack naturally: techstack is lazy-loaded
    // and may not be in the DOM when we install triggers, so we anchor
    // the AI state on `.career-section` and let it carry through.
    { selector: ".career-section", start: "top 70%", section: "ai" },
    { selector: ".work-section", start: "top 70%", section: "work" },
    { selector: ".contact-section", start: "top 75%", section: "contact" },
  ];

  bindings.forEach(({ selector, start, section }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      end: "bottom 30%",
      onEnter: () => setActiveSection(section),
      onEnterBack: () => setActiveSection(section),
      invalidateOnRefresh: true,
    });
    sectionTriggers.push(trigger);
  });
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  let screenLight: THREE.Mesh | undefined;
  let monitor: THREE.Mesh | undefined;

  character?.children.forEach((object: THREE.Object3D) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] | undefined;
        if (!mat || Array.isArray(mat)) return;
        mat.transparent = true;
        mat.opacity = 0;
        if (mat.name === "Material.027") {
          monitor = mesh;
          mat.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      const mesh = object as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (!mat) return;
      mat.transparent = true;
      mat.opacity = 0;
      mat.emissive.set("#6ee7ff");
      // NOTE: emissiveIntensity is no longer driven here by a random
      // flicker timeline. The scene controller in `sceneState.ts`
      // owns the intensity envelope + jitter, and reacts per-section.
      mat.emissiveIntensity = 0;
      screenLight = mesh;
    }
  });

  const neckBone = character?.getObjectByName("spine005");

  if (window.innerWidth > 1024) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }
      if (monitor?.material && !Array.isArray(monitor.material)) {
        tl2.to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0).fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        );
      }
      if (screenLight?.material && !Array.isArray(screenLight.material)) {
        tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
      }

      tl2
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }

  // Wire section-state ScrollTriggers so the scene controller
  // transitions between `landing → about → product → ai → work → contact`
  // as the user scrolls. Ordered after the camera/character timelines
  // so we don't racewith their initial measurement pass.
  installSectionTriggers();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
