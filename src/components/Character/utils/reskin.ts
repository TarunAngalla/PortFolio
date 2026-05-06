import * as THREE from "three";

/**
 * Runtime retheming pass for the workstation character.
 *
 * The GLB asset is an immutable, pre-baked model — we can't edit its
 * geometry here, but we CAN re-dress its materials so the character
 * matches the dark violet/cyan site theme instead of looking like a
 * generic white-plastic avatar.
 *
 * Strategy:
 *   1. Traverse every mesh in the scene.
 *   2. Clone each MeshStandardMaterial (so edits don't bleed across
 *      unrelated meshes that share a material reference).
 *   3. Classify by either:
 *        - explicit material name match (`preserve` list) — left alone
 *          because scroll-driven logic depends on them, or
 *        - color signature — brightness / hue heuristic to guess
 *          whether this slot is body-cloth, skin, hair, pants, etc.
 *   4. Apply the theme token for that class.
 */

export interface CharacterTheme {
  hoodieBase: string;        // dark premium hoodie body
  hoodieEdge: string;        // subtle violet trim (emissive)
  hoodieShadow: string;      // occluded folds
  skinBase: string;          // warmer, more believable
  skinWarm: string;          // cheek/emissive hint
  hair: string;              // sharper, darker
  pants: string;             // fitted dark pants
  shoes: string;             // muted light sneakers
  chair: string;             // part of the scene language
  desk: string;              // matching desk plate
  violet: string;            // monitor spill
  cyan: string;              // monitor spill 2
}

export const defaultCharacterTheme: CharacterTheme = {
  hoodieBase: "#111827",
  hoodieEdge: "#7c3aed",
  hoodieShadow: "#0b1020",
  skinBase: "#d8b29a",
  skinWarm: "#e3a887",
  hair: "#101014",
  pants: "#1b2236",
  shoes: "#dfe7f5",
  chair: "#0c1222",
  desk: "#12182b",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
};

/** Material names already owned by scroll / light logic — do NOT touch them. */
const PRESERVE_MATERIAL_NAMES = new Set<string>([
  "Material.027", // monitor screen content (tweened in GsapScroll)
]);

/** Mesh names that must keep their original material for scene logic. */
const PRESERVE_MESH_NAMES = new Set<string>([
  "screenlight", // emissive screen glow mesh
]);

type Cls =
  | "preserve"
  | "bodyBright"
  | "skin"
  | "hair"
  | "darkFabric"
  | "shoes"
  | "midMetal"
  | "accent"
  | "unknown";

interface ClassifyCtx {
  /** Y threshold below which meshes are considered shoe/floor zone. */
  shoeY: number;
  /** Y threshold above which meshes are considered head zone. */
  headY: number;
}

function classify(
  mesh: THREE.Mesh,
  mat: THREE.MeshStandardMaterial,
  ctx: ClassifyCtx
): Cls {
  const matName = (mat.name || "").toString();
  const meshName = (mesh.name || "").toString();
  const parentName = (mesh.parent?.name || "").toString();

  if (PRESERVE_MATERIAL_NAMES.has(matName)) return "preserve";
  if (PRESERVE_MESH_NAMES.has(meshName)) return "preserve";
  if (PRESERVE_MESH_NAMES.has(parentName)) return "preserve";

  const c = mat.color;
  const r = c.r;
  const g = c.g;
  const b = c.b;
  const brightness = r + g + b;
  const warmness = r - b; // positive = warm, negative = cool
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);

  // Resolve an approximate Y position for this mesh so shoes/feet
  // don't collide with the hoodie heuristic.
  const tmp = new THREE.Vector3();
  try {
    const mb = new THREE.Box3().setFromObject(mesh);
    mb.getCenter(tmp);
  } catch {
    tmp.set(0, 0, 0);
  }
  const inShoeZone = tmp.y <= ctx.shoeY;
  const inHeadZone = tmp.y >= ctx.headY;

  // Very dark (hair, brows, shoe soles, eyes)
  if (brightness < 0.35) return "hair";

  // Warm mid-tone with some saturation → skin
  if (warmness > 0.08 && brightness > 1.1 && brightness < 2.7) return "skin";

  // Shoes: bright+desaturated AND down in the feet zone
  if (brightness > 2.0 && saturation < 0.25 && inShoeZone) return "shoes";

  // Bright, desaturated → body / clothes / shirt
  if (brightness > 2.25 && saturation < 0.2 && !inShoeZone) {
    // If this sits in the head zone and is the biggest piece, it's probably
    // still skin (e.g. bald / white face plate). Push through as skin.
    if (inHeadZone && warmness >= -0.02) return "skin";
    return "bodyBright";
  }

  // Dark cool-ish fabric → pants or chair
  if (brightness < 1.4 && warmness <= 0.05) return "darkFabric";

  // Mid metal-ish (desk, frame)
  if (brightness >= 1.4 && brightness <= 2.25 && saturation < 0.25) return "midMetal";

  // Saturated accent (rare — monitor frame stripe, etc.)
  if (saturation > 0.35) return "accent";

  return "unknown";
}

function cloneMat(mat: THREE.Material): THREE.Material {
  // Clone so edits don't leak across meshes sharing the same material ref.
  const cloned = mat.clone();
  // Preserve textures by reference
  if ("map" in mat && (mat as any).map) (cloned as any).map = (mat as any).map;
  if ("normalMap" in mat && (mat as any).normalMap) (cloned as any).normalMap = (mat as any).normalMap;
  return cloned;
}

function applyClass(
  cls: Cls,
  mat: THREE.MeshStandardMaterial,
  theme: CharacterTheme
): void {
  switch (cls) {
    case "bodyBright": {
      // Premium matte hoodie fabric
      mat.color.set(theme.hoodieBase);
      mat.roughness = 0.92;
      mat.metalness = 0.0;
      mat.emissive.set(theme.hoodieEdge);
      mat.emissiveIntensity = 0.06;
      break;
    }
    case "skin": {
      mat.color.set(theme.skinBase);
      mat.roughness = 0.78;
      mat.metalness = 0.0;
      mat.emissive.set(theme.skinWarm);
      mat.emissiveIntensity = 0.04;
      break;
    }
    case "hair": {
      mat.color.set(theme.hair);
      mat.roughness = 0.45;
      mat.metalness = 0.18;
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      break;
    }
    case "darkFabric": {
      // Pants / chair upholstery
      mat.color.set(theme.pants);
      mat.roughness = 0.88;
      mat.metalness = 0.0;
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      break;
    }
    case "shoes": {
      mat.color.set(theme.shoes);
      mat.roughness = 0.7;
      mat.metalness = 0.08;
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
      break;
    }
    case "midMetal": {
      // Desk plate, frame pieces
      mat.color.set(theme.desk);
      mat.roughness = 0.55;
      mat.metalness = 0.25;
      mat.emissive.set(theme.violet);
      mat.emissiveIntensity = 0.03;
      break;
    }
    case "accent": {
      // Leave saturated accents alone — they were clearly authored on purpose.
      break;
    }
    case "preserve":
    case "unknown":
    default:
      break;
  }
  mat.needsUpdate = true;
}

/**
 * Main entry point. Call once after the GLB has been parsed and its
 * mesh graph has been traversed for shadow flags.
 *
 * Safe to call multiple times — the clone pass guarantees idempotency
 * across repeated invocations.
 */
export function reskinCharacter(
  character: THREE.Object3D,
  theme: CharacterTheme = defaultCharacterTheme
): void {
  // Compute a whole-character bounding box once so we can classify
  // shoes / head by relative Y. The model hasn't been added to the
  // scene yet, but its local transforms are enough for a relative
  // partition.
  let shoeY = -Infinity;
  let headY = Infinity;
  try {
    const bbox = new THREE.Box3().setFromObject(character);
    const range = bbox.max.y - bbox.min.y;
    if (isFinite(range) && range > 0) {
      shoeY = bbox.min.y + range * 0.1; // bottom 10% → shoe zone
      headY = bbox.min.y + range * 0.78; // top ~22% → head zone
    }
  } catch {
    /* ignore — fall back to pure color heuristic */
  }
  const ctx: ClassifyCtx = { shoeY, headY };

  character.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const original = mesh.material;
    if (!original) return;

    if (Array.isArray(original)) {
      mesh.material = original.map((m) => {
        const cloned = cloneMat(m) as THREE.MeshStandardMaterial;
        const cls = classify(mesh, cloned, ctx);
        applyClass(cls, cloned, theme);
        return cloned;
      });
    } else {
      const cloned = cloneMat(original) as THREE.MeshStandardMaterial;
      const cls = classify(mesh, cloned, ctx);
      applyClass(cls, cloned, theme);
      mesh.material = cloned;
    }
  });
}
