import matter from "gray-matter";
import { notFound } from "next/navigation";

import fs from "fs";
import path from "path";

export type Team = {
  name: string;
  role?: string;
  avatar: string;
  linkedIn?: string;
};

export type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;

  /**
   * Legacy single-image field.
   * We keep it for backward compatibility, but we will auto-fill it from `images[0]` when possible.
   */
  image?: string;

  /**
   * Preferred multi-image field (like projects).
   */
  images?: string[];

  tags?: string[];
  team?: Team[];
  link?: string;
};

export type MDXPost = {
  metadata: Metadata;
  slug: string;
  content: string;
};

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) notFound();
}

function ensureFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) notFound();
}

function toStringOrUndefined(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value == null) return undefined;
  // Avoid turning objects into "[object Object]"
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

export function normalizeTags(data: unknown): string[] {
  // new: tags: ["a","b"]
  if (Array.isArray((data as any)?.tags)) {
    return (data as any).tags.filter(
      (t: unknown): t is string => typeof t === "string" && t.trim() !== "",
    );
  }

  // legacy: tag: "a"
  if (typeof (data as any)?.tag === "string" && (data as any).tag.trim() !== "") {
    return [(data as any).tag.trim()];
  }

  return [];
}

function normalizeImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v : toStringOrUndefined(v)))
      .filter((v): v is string => Boolean(v));
  }

  const single = toStringOrUndefined(value);
  return single ? [single] : [];
}

function normalizeTeam(value: unknown): Team[] {
  if (!Array.isArray(value)) return [];

  const mapped = value.map((raw): Team | null => {
    if (!raw || typeof raw !== "object") return null;

    const obj = raw as Record<string, unknown>;
    const name = toStringOrUndefined(obj.name) ?? "";
    const avatar = toStringOrUndefined(obj.avatar) ?? "";

    if (!name || !avatar) return null;

    return {
      name,
      avatar,
      role: toStringOrUndefined(obj.role),
      linkedIn: toStringOrUndefined(obj.linkedIn),
    };
  });

  return mapped.filter((x): x is Team => x !== null);
}

function getMDXFiles(dir: string): string[] {
  ensureDirExists(dir);

  return (
    fs
      .readdirSync(dir)
      .filter((file) => path.extname(file).toLowerCase() === ".mdx")
      // stable ordering (nice for builds)
      .sort((a, b) => a.localeCompare(b))
  );
}

function readMDXFile(filePath: string): { metadata: Metadata; content: string } {
  ensureFileExists(filePath);

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const images = normalizeImages((data as any).images);
  const imageLegacy = toStringOrUndefined((data as any).image);

  // ✅ Preview logic: first image from images[] wins, else legacy image
  const previewImage = images[0] ?? imageLegacy;

  const metadata: Metadata = {
    title: toStringOrUndefined((data as any).title) ?? "",
    subtitle: toStringOrUndefined((data as any).subtitle),
    publishedAt: toStringOrUndefined((data as any).publishedAt) ?? "",
    summary: toStringOrUndefined((data as any).summary) ?? "",

    images,
    image: previewImage,

    tags: normalizeTags(data),
    team: normalizeTeam((data as any).team),
    link: toStringOrUndefined((data as any).link),
  };

  return { metadata, content };
}

function getMDXData(dir: string): MDXPost[] {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map((file) => {
    const filePath = path.join(dir, file);
    const { metadata, content } = readMDXFile(filePath);

    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

/**
 * Usage:
 * getPosts(["src", "app", "blog", "posts"])
 * getPosts(["src", "app", "work", "projects"])
 */
export function getPosts(customPath: string[] = ["", "", "", ""]): MDXPost[] {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}
