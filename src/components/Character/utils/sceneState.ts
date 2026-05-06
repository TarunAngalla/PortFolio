import * as THREE from "three";
import gsap from "gsap";

/**
 * Workstation scene state controller.
 *
 * Before this module existed, the character typed continuously and the
 * monitor flickered at a random 200ms interval — the scene was never
 * connected to what the user was actually reading on the right.
 *
 * This controller centralizes:
 *   - typing action weight (idle + bursts, not a loop)
 *   - monitor emissive brightness envelope + jitter
 *   - monitor emissive color (cool cyan → violet per section)
 *   - point-light spill scale onto the hoodie / desk / hands
 *   - the tiny pink screen accent light
 *
 * Section triggers in `GsapScroll.ts` call `setActiveSection(name)` to
 * transition everything smoothly. The render loop in `Scene.tsx` calls
 * `tick()` every frame so per-frame jitter + weight updates stay cheap.
 */

export type SceneSection =
  | "landing"
  | "about"
  | "product"
  | "ai"
  | "work"
  | "contact";

interface SectionProfile {
  /** Baseline typing contribution between bursts. Tiny for realism. */
  typingIdle: number;
  /** Peak typing weight when a burst fires. */
  typingBurst: number;
  /** Animation clip timeScale while this section is active. */
  typingSpeed: number;
  /** Random interval between bursts, ms. `[0,0]` disables bursts. */
  burstIntervalMs: [number, number];
  /** Burst fade-out duration range, ms. */
  burstDurationMs: [number, number];
  /** Target monitor emissive intensity envelope (0..1). */
  monitorBrightness: number;
  /** Flicker amplitude on top of `monitorBrightness`. */
  monitorJitter: number;
  /** Emissive hex color for the monitor + cyan spill bias. */
  monitorColor: string;
  /** Multiplier applied to the cyan point light (hoodie / hands / desk). */
  pointLightScale: number;
  /** Multiplier applied to the small pink screen accent. */
  pinkAccentScale: number;
}

/**
 * Per-section tuning. Designed so the visible arc
 *   landing → about → product → ai
 * reads as a clear monitor "turn-on" curve, and
 *   ai → work → contact
 * reads as a calming resolution.
 */
export const SECTION_PROFILES: Record<SceneSection, SectionProfile> = {
  landing: {
    typingIdle: 0,
    typingBurst: 0,
    typingSpeed: 0.85,
    burstIntervalMs: [0, 0],
    burstDurationMs: [0, 0],
    monitorBrightness: 0.12,
    monitorJitter: 0.025,
    monitorColor: "#6ee7ff",
    pointLightScale: 0.15,
    pinkAccentScale: 0,
  },
  about: {
    typingIdle: 0,
    typingBurst: 0.28,
    typingSpeed: 0.95,
    burstIntervalMs: [4200, 7800],
    burstDurationMs: [700, 1100],
    monitorBrightness: 0.45,
    monitorJitter: 0.08,
    monitorColor: "#6ee7ff",
    pointLightScale: 0.55,
    pinkAccentScale: 0.04,
  },
  product: {
    typingIdle: 0.05,
    typingBurst: 0.75,
    typingSpeed: 1.1,
    burstIntervalMs: [2000, 3800],
    burstDurationMs: [900, 1400],
    monitorBrightness: 0.72,
    monitorJitter: 0.16,
    monitorColor: "#22d3ee",
    pointLightScale: 0.95,
    pinkAccentScale: 0.1,
  },
  ai: {
    typingIdle: 0.08,
    typingBurst: 1.0,
    typingSpeed: 1.28,
    burstIntervalMs: [1400, 2600],
    burstDurationMs: [800, 1500],
    monitorBrightness: 1.0,
    monitorJitter: 0.24,
    monitorColor: "#a78bfa",
    pointLightScale: 1.15,
    pinkAccentScale: 0.18,
  },
  work: {
    typingIdle: 0.02,
    typingBurst: 0.35,
    typingSpeed: 1.0,
    burstIntervalMs: [5000, 8500],
    burstDurationMs: [600, 1000],
    monitorBrightness: 0.55,
    monitorJitter: 0.09,
    monitorColor: "#8b5cf6",
    pointLightScale: 0.72,
    pinkAccentScale: 0.08,
  },
  contact: {
    typingIdle: 0,
    typingBurst: 0,
    typingSpeed: 0.85,
    burstIntervalMs: [0, 0],
    burstDurationMs: [0, 0],
    monitorBrightness: 0.25,
    monitorJitter: 0.03,
    monitorColor: "#22d3ee",
    pointLightScale: 0.32,
    pinkAccentScale: 0,
  },
};

export interface SceneControllerHandles {
  typingAction: THREE.AnimationAction | null;
  screenLight?: THREE.Mesh | null;
  pointLight?: THREE.PointLight | null;
  pinkAccent?: THREE.PointLight | null;
}

export interface SceneController {
  setSection: (s: SceneSection) => void;
  tick: () => void;
  dispose: () => void;
  current: () => SceneSection;
}

function rand(a: number, b: number): number {
  if (a === b) return a;
  return a + Math.random() * (b - a);
}

export function createSceneController(
  handles: SceneControllerHandles
): SceneController {
  let current: SceneSection = "landing";
  let disposed = false;
  let burstTimeout: number | null = null;

  // Animatable envelope — GSAP writes to these, tick() reads from them.
  const env = {
    brightness: SECTION_PROFILES.landing.monitorBrightness,
    jitter: SECTION_PROFILES.landing.monitorJitter,
    typingWeight: 0,
    pointLightScale: SECTION_PROFILES.landing.pointLightScale,
    pinkAccentScale: SECTION_PROFILES.landing.pinkAccentScale,
  };

  // Prime the typing action so it's running but silent until a burst.
  if (handles.typingAction) {
    handles.typingAction.enabled = true;
    handles.typingAction.setEffectiveWeight(0);
    handles.typingAction.play();
    handles.typingAction.timeScale = SECTION_PROFILES.landing.typingSpeed;
  }

  const clearBurstTimer = () => {
    if (burstTimeout != null) {
      window.clearTimeout(burstTimeout);
      burstTimeout = null;
    }
  };

  const scheduleNextBurst = () => {
    clearBurstTimer();
    if (disposed) return;
    const p = SECTION_PROFILES[current];
    if (p.burstIntervalMs[1] <= 0) return;
    const wait = rand(p.burstIntervalMs[0], p.burstIntervalMs[1]);
    burstTimeout = window.setTimeout(() => {
      if (disposed) return;
      triggerBurst();
      scheduleNextBurst();
    }, wait);
  };

  const triggerBurst = () => {
    const p = SECTION_PROFILES[current];
    if (p.typingBurst <= 0) return;
    const duration = rand(p.burstDurationMs[0], p.burstDurationMs[1]) / 1000;
    // Quick attack up to peak, then a slower decay back to the idle floor.
    gsap.killTweensOf(env, "typingWeight");
    gsap
      .timeline()
      .to(env, {
        typingWeight: p.typingBurst,
        duration: 0.22,
        ease: "power2.out",
      })
      .to(env, {
        typingWeight: p.typingIdle,
        duration,
        ease: "power2.inOut",
      });
  };

  const setSection = (s: SceneSection) => {
    if (s === current) return;
    current = s;
    const p = SECTION_PROFILES[s];

    // Kill any in-flight burst tween so the section transition wins.
    gsap.killTweensOf(env);

    gsap.to(env, {
      brightness: p.monitorBrightness,
      jitter: p.monitorJitter,
      pointLightScale: p.pointLightScale,
      pinkAccentScale: p.pinkAccentScale,
      duration: 1.15,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(env, {
      typingWeight: p.typingIdle,
      duration: 0.55,
      ease: "power2.out",
    });

    if (handles.typingAction) {
      gsap.to(handles.typingAction, {
        timeScale: p.typingSpeed,
        duration: 0.6,
        ease: "power1.out",
      });
    }

    // Tween the monitor's emissive color smoothly.
    const sl = handles.screenLight;
    if (sl) {
      const mat = sl.material as THREE.MeshStandardMaterial | undefined;
      if (mat && mat.emissive) {
        const target = new THREE.Color(p.monitorColor);
        gsap.to(mat.emissive, {
          r: target.r,
          g: target.g,
          b: target.b,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    }

    scheduleNextBurst();
  };

  const tick = () => {
    if (disposed) return;

    // 1. Typing weight — drive every frame so fades are crisp.
    if (handles.typingAction) {
      handles.typingAction.setEffectiveWeight(env.typingWeight);
    }

    // 2. Monitor envelope — but only while the screen is actually visible.
    const sl = handles.screenLight;
    if (sl) {
      const mat = sl.material as THREE.MeshStandardMaterial | undefined;
      if (mat && typeof mat.opacity === "number") {
        const visible = mat.opacity > 0.9;
        if (visible) {
          const jit = (Math.random() - 0.5) * env.jitter;
          const level = Math.max(0, env.brightness + jit);
          mat.emissiveIntensity = level * 8;

          if (handles.pointLight) {
            handles.pointLight.intensity = level * 20 * env.pointLightScale;
          }
          if (handles.pinkAccent) {
            handles.pinkAccent.intensity = level * 6 * env.pinkAccentScale;
          }
        } else {
          // Monitor hasn't faded in yet (scrubbed by GsapScroll). Keep spill dark.
          if (handles.pointLight) handles.pointLight.intensity = 0;
          if (handles.pinkAccent) handles.pinkAccent.intensity = 0;
        }
      }
    }
  };

  const dispose = () => {
    disposed = true;
    clearBurstTimer();
    gsap.killTweensOf(env);
    if (handles.typingAction) {
      gsap.killTweensOf(handles.typingAction);
    }
  };

  // Initialize in landing state (no `setSection` call — that bails on same).
  scheduleNextBurst();

  return {
    setSection,
    tick,
    dispose,
    current: () => current,
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/* Module-level active controller so GsapScroll's ScrollTriggers can    */
/* drive the scene without needing the controller instance threaded     */
/* through every call site.                                             */
/* ──────────────────────────────────────────────────────────────────── */

let activeController: SceneController | null = null;

export function registerSceneController(c: SceneController | null): void {
  activeController = c;
}

export function setActiveSection(s: SceneSection): void {
  activeController?.setSection(s);
}
