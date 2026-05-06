import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

/**
 * Scene lighting for the seated workstation character.
 *
 * Designed to make the character feel *lit by the UI*:
 *   - violet key from the upper-left (existing directional)
 *   - cyan fill from the right side, where the monitor sits
 *   - warm low fill so skin doesn't drift into blue
 *   - violet back-rim to separate silhouette from the dark page
 *   - a small pink highlight only near the screen, driven by the
 *     monitor `screenlight` mesh pulsing (section state)
 */
const setLighting = (scene: THREE.Scene) => {
  // ── Key (violet) — upper-left, the legacy primary light ──────────────
  const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // ── Fill (cyan) — from the right, picks up hoodie / desk edge ────────
  const cyanFill = new THREE.DirectionalLight(0x22d3ee, 0);
  cyanFill.position.set(3.4, 1.6, 2.2);
  cyanFill.castShadow = false;
  scene.add(cyanFill);

  // ── Back-rim (violet) — from behind, separates silhouette ────────────
  const violetRim = new THREE.DirectionalLight(0x7c3aed, 0);
  violetRim.position.set(-1.2, 2.4, -3.0);
  violetRim.castShadow = false;
  scene.add(violetRim);

  // ── Warm low key — keeps skin believable under cool spill ────────────
  const warmFill = new THREE.DirectionalLight(0xffd9b5, 0);
  warmFill.position.set(0.4, 0.6, 3.0);
  warmFill.castShadow = false;
  scene.add(warmFill);

  // ── Monitor-driven point light (pulses with screenlight opacity) ─────
  const pointLight = new THREE.PointLight(0x22d3ee, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // ── Tiny pink highlight near the screen (very restrained) ────────────
  const pinkScreenAccent = new THREE.PointLight(0xec4899, 0, 40, 2);
  pinkScreenAccent.position.set(2.6, 11.2, 2.8);
  scene.add(pinkScreenAccent);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: THREE.Object3D) {
    const mat = (screenLight as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (!mat || typeof mat.opacity !== "number") {
      pointLight.intensity = 0;
      pinkScreenAccent.intensity = 0;
      return;
    }
    if (mat.opacity > 0.9) {
      const base = (mat.emissiveIntensity ?? 0) * 20;
      pointLight.intensity = base;
      pinkScreenAccent.intensity = base * 0.12;
    } else {
      pointLight.intensity = 0;
      pinkScreenAccent.intensity = 0;
    }
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.to(cyanFill, {
      intensity: 0.85,
      duration: duration,
      ease: ease,
    });
    gsap.to(violetRim, {
      intensity: 0.6,
      duration: duration,
      ease: ease,
    });
    gsap.to(warmFill, {
      intensity: 0.35,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return {
    setPointLight,
    turnOnLights,
    // Expose raw light handles so the scene controller can drive
    // section-based brightness without fighting this module.
    lights: {
      pointLight,
      pinkScreenAccent,
      directionalLight,
      cyanFill,
      violetRim,
      warmFill,
    },
  };
};

export default setLighting;
