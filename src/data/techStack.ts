import type { IconType } from "react-icons";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiFastapi,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiSpringboot,
  SiFirebase,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa6";
import { TbBrandAzure } from "react-icons/tb";

export type TechCategory = "frontend" | "backend" | "database" | "cloud";

export interface TechItem {
  name: string;
  icon: IconType;
  category: TechCategory;
  base: string;
  rim: string;
  glow: string;
  fg: string;
  iconScale?: number;
}

export interface TechCapability {
  title: string;
  description: string;
}

export const techStack: TechItem[] = [
  { name: "Java", icon: FaJava, category: "backend", base: "#1f1110", rim: "#37211d", glow: "#f89820", fg: "#f8d49a" },
  { name: "Spring Boot", icon: SiSpringboot, category: "backend", base: "#0d1f12", rim: "#1a3420", glow: "#6DB33F", fg: "#c9f7b7" },
  { name: "Python", icon: SiPython, category: "backend", base: "#0b1830", rim: "#1a2f56", glow: "#3776AB", fg: "#FFE873" },
  { name: "FastAPI", icon: SiFastapi, category: "backend", base: "#0b1b1a", rim: "#163533", glow: "#009688", fg: "#8ef3e8" },
  { name: "Node.js", icon: SiNodedotjs, category: "backend", base: "#0d1f12", rim: "#1a3420", glow: "#339933", fg: "#d6ffd6" },
  { name: "PostgreSQL", icon: SiPostgresql, category: "database", base: "#0b1328", rim: "#1c2d52", glow: "#336791", fg: "#d8e9ff" },
  { name: "MongoDB", icon: SiMongodb, category: "database", base: "#0b1a12", rim: "#163126", glow: "#47A248", fg: "#47A248" },
  { name: "AWS", icon: FaAws, category: "cloud", base: "#1b1308", rim: "#2f2312", glow: "#FF9900", fg: "#FF9900" },
  { name: "Docker", icon: SiDocker, category: "cloud", base: "#0b1628", rim: "#15325a", glow: "#2496ED", fg: "#7ec9ff" },
  { name: "React", icon: SiReact, category: "frontend", base: "#0b1f2a", rim: "#153747", glow: "#61DAFB", fg: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, category: "frontend", base: "#0b1729", rim: "#14345a", glow: "#3178C6", fg: "#9dd0ff" },
  { name: "Azure", icon: TbBrandAzure, category: "cloud", base: "#07182b", rim: "#12375e", glow: "#0078D4", fg: "#8bd0ff" },
  { name: "Firebase", icon: SiFirebase, category: "cloud", base: "#221507", rim: "#3f2a0a", glow: "#FFCA28", fg: "#ffdf75" },
];

export const techCapabilities: TechCapability[] = [
  {
    title: "AI SYSTEMS",
    description:
      "RAG pipelines, embeddings, semantic retrieval, LLM orchestration, structured outputs, recommendation systems, and AI-powered workflows.",
  },
  {
    title: "BACKEND ENGINEERING",
    description:
      "Production APIs, authentication systems, scalable workflows, validation layers, service architecture, and business logic implementation.",
  },
  {
    title: "DATA & STORAGE",
    description:
      "PostgreSQL, MongoDB, structured ingestion pipelines, indexing strategies, retrieval systems, and scalable data modeling.",
  },
  {
    title: "CLOUD & INFRASTRUCTURE",
    description:
      "AWS, Docker, Azure integrations, deployment workflows, cloud storage systems, and containerized services.",
  },
  {
    title: "PRODUCTION PROBLEM SOLVING",
    description:
      "Debugging production issues, stability improvements, operational fixes, performance optimization, and reliability-focused engineering.",
  },
];
