import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { reskinCharacter } from "./reskin";

const DECRYPT_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      }
    );
  });
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      let blobUrl: string | null = null;

      const cleanupBlob = () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrl = null;
        }
      };

      try {
        const encryptedBlob = await withTimeout(
          decryptFile("/models/character.enc", "Character3D#@"),
          DECRYPT_TIMEOUT_MS,
          "Decrypt model"
        );
        blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;

        loader.load(
          blobUrl,
          async (gltf) => {
            try {
              character = gltf.scene;
              try {
                await renderer.compileAsync(character, camera, scene);
              } catch (compileErr) {
                cleanupBlob();
                console.error("compileAsync failed:", compileErr);
                reject(compileErr);
                return;
              }
              character.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                  mesh.frustumCulled = true;
                }
              });
              // Retint clothing/skin/desk materials to match the site
              // theme (dark violet + cyan) without editing the GLB.
              try {
                reskinCharacter(character);
              } catch (reskinErr) {
                console.warn("Character reskin failed (non-fatal):", reskinErr);
              }
              setCharTimeline(character, camera);
              setAllTimeline();
              character.getObjectByName("footR")!.position.y = 3.36;
              character.getObjectByName("footL")!.position.y = 3.36;
              dracoLoader.dispose();
              cleanupBlob();
              ScrollTrigger.refresh();
              resolve(gltf);
            } catch (err) {
              cleanupBlob();
              console.error(err);
              reject(err);
            }
          },
          undefined,
          (error) => {
            cleanupBlob();
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        cleanupBlob();
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
