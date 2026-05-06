import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import type { TechItem } from "../../data/techStack";

function extractIcon(item: TechItem): { inner: string; viewBox: string } {
  const svg = renderToStaticMarkup(createElement(item.icon));
  const vbMatch = svg.match(/viewBox="([^"]*)"/);
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  return {
    inner: innerMatch ? innerMatch[1] : svg,
    viewBox: vbMatch ? vbMatch[1] : "0 0 24 24",
  };
}

function buildBallSvg(item: TechItem): string {
  const size = 512;
  const { inner, viewBox } = extractIcon(item);
  const [vx, vy, vw, vh] = viewBox.split(/\s+/).map(Number);
  /* Larger glyphs — readability beats filler negative space on capsule textures */
  const iconFraction = item.iconScale ?? 0.71;
  const iconPx = size * iconFraction;
  const sx = iconPx / (vw || 24);
  const sy = iconPx / (vh || 24);
  const tx = (size - iconPx) / 2 - (vx || 0) * sx;
  const ty = (size - iconPx) / 2 - (vy || 0) * sy;
  const gid = `g_${item.name.replace(/\W/g, "")}`;

  /* Frosted base reads brighter under translucent PhysicalMaterial */
  const frostMid = item.rim;
  const frostOuter = item.base;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="${gid}_core" cx="46%" cy="44%" r="72%">
      <stop offset="0%" stop-color="#243047"/>
      <stop offset="42%" stop-color="${frostMid}"/>
      <stop offset="100%" stop-color="${frostOuter}"/>
    </radialGradient>
    <radialGradient id="${gid}_rim" cx="52%" cy="52%" r="58%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="76%" stop-color="${item.glow}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${item.glow}" stop-opacity="0.32"/>
    </radialGradient>
    <!-- Minimal highlight — chrome/spec stays mostly on Three roughness, not texture wash -->
    <radialGradient id="${gid}_spec" cx="32%" cy="26%" r="26%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#${gid}_core)"/>
  <rect width="${size}" height="${size}" fill="url(#${gid}_rim)" style="mix-blend-mode:screen"/>
  <g transform="translate(${tx} ${ty}) scale(${sx} ${sy})" fill="${item.fg}" style="color:${item.fg}">
    ${inner}
  </g>
  <rect width="${size}" height="${size}" fill="url(#${gid}_spec)" style="mix-blend-mode:screen"/>
</svg>`;
}

export function buildTechTexture(item: TechItem): THREE.Texture {
  const svg = buildBallSvg(item);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const texture = new THREE.Texture();
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.name = item.name;

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    texture.image = img;
    texture.needsUpdate = true;
  };
  img.onerror = (err) => {
    console.warn(`[techTextures] Failed to load texture for "${item.name}"`, err);
  };
  img.src = url;

  return texture;
}

export function buildTechTextures(items: TechItem[]): THREE.Texture[] {
  return items.map((item) => buildTechTexture(item));
}
