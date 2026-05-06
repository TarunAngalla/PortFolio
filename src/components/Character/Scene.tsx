import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import {
  createSceneController,
  registerSceneController,
  SceneController,
} from "./utils/sceneState";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { finishAssetLoading } = useLoading();

  useEffect(() => {
    const el = canvasDiv.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    if (width <= 1 || height <= 1) {
      width = Math.max(320, window.innerWidth * 0.45);
      height = Math.max(480, window.innerHeight * 0.55);
    }
    const container = { width, height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    el.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let loadedCharacter: THREE.Object3D | null = null;
    let disposeHover: (() => void) | undefined;
    let introTimeout: ReturnType<typeof setTimeout> | undefined;
    let touchStartDelay: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;
    let alive = true;
    let sceneController: SceneController | null = null;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const onResize = () => {
      if (!alive || !loadedCharacter) return;
      handleResize(renderer, camera, canvasDiv, loadedCharacter);
    };

    loadCharacter()
      .then((gltf) => {
        if (!alive) return;
        if (!gltf) {
          void finishAssetLoading();
          return;
        }
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          disposeHover = animations.hover(gltf, hoverDivRef.current) ?? undefined;
        }
        mixer = animations.mixer;
        const character = gltf.scene;
        loadedCharacter = character;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;

        // Build the section-state controller now that we have the
        // typing action, the screen mesh, and the scene lights.
        sceneController = createSceneController({
          typingAction: animations.typingAction ?? null,
          screenLight: screenLight as THREE.Mesh | null,
          pointLight: light.lights.pointLight,
          pinkAccent: light.lights.pinkScreenAccent,
        });
        registerSceneController(sceneController);

        void finishAssetLoading().then(() => {
          if (!alive) return;
          introTimeout = window.setTimeout(() => {
            if (!alive) return;
            light.turnOnLights();
            document.body.classList.add("character-loaded");
            animations.startIntro();
          }, 2500);
        });
        window.addEventListener("resize", onResize);
      })
      .catch((err) => {
        console.error("Character load failed:", err);
        void finishAssetLoading();
      });

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 };

    const onDocumentMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const landingDiv = document.getElementById("landingDiv");

    const onLandingTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchStart = () => {
      clearTimeout(touchStartDelay);
      touchStartDelay = window.setTimeout(() => {
        landingDiv?.addEventListener("touchmove", onLandingTouchMove, { passive: true });
      }, 200);
    };

    const onTouchEnd = () => {
      clearTimeout(touchStartDelay);
      landingDiv?.removeEventListener("touchmove", onLandingTouchMove);
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onDocumentMouseMove);
    landingDiv?.addEventListener("touchstart", onTouchStart);
    landingDiv?.addEventListener("touchend", onTouchEnd);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
      }
      if (sceneController) {
        sceneController.tick();
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      alive = false;
      document.body.classList.remove("character-loaded");
      cancelAnimationFrame(rafId);
      clearTimeout(touchStartDelay);
      clearTimeout(introTimeout);
      disposeHover?.();
      if (sceneController) {
        registerSceneController(null);
        sceneController.dispose();
        sceneController = null;
      }
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      landingDiv?.removeEventListener("touchmove", onLandingTouchMove);
      scene.clear();
      renderer.dispose();
      if (canvasDiv.current && renderer.domElement.parentNode === canvasDiv.current) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
    };
  }, [finishAssetLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
