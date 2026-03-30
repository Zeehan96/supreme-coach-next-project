import { cache } from "react";
import { invokeApi } from "../api";
import { apiBaseUrl } from "../config/env";
import { resolveMediaUrl } from "./websiteContent";

function isApiErrorPayload(p: unknown): boolean {
  if (!p || typeof p !== "object") return true;
  const o = p as Record<string, unknown>;
  return typeof o.code === "number" && o.code > 0 && o.data === undefined;
}

function unwrapRecord(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  const p = payload as Record<string, unknown>;
  if (p.success === false) return {};
  const d = p.data;
  if (d && typeof d === "object" && !Array.isArray(d)) {
    return d as Record<string, unknown>;
  }
  return p;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickHtml(raw: Record<string, unknown>): string {
  const keys = [
    "html",
    "body",
    "contentHtml",
    "richText",
    "articleBody",
    "postContent",
    "descriptionHtml",
  ];
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  const c = raw.content;
  if (typeof c === "string" && c.trim()) return c.trim();
  if (c && typeof c === "object" && !Array.isArray(c)) {
    const co = c as Record<string, unknown>;
    for (const k of ["html", "body", "rendered", "markdown"]) {
      const v = co[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return "";
}

function pickAuthorName(obj: Record<string, unknown>): string | null {
  const direct = pickString(obj, ["authorName", "writerName", "byline"]);
  if (direct) return direct;
  const a = obj.author ?? obj.writer;
  if (typeof a === "string" && a.trim()) return a.trim();
  if (a && typeof a === "object") {
    const n = (a as Record<string, unknown>).name;
    if (typeof n === "string" && n.trim()) return n.trim();
  }
  return null;
}

function pickAuthorImage(obj: Record<string, unknown>): string | null {
  const a = obj.author;
  if (a && typeof a === "object") {
    const rec = a as Record<string, unknown>;
    const u = resolveMediaUrl(
      rec.image ?? rec.avatar ?? rec.photo ?? rec.headshot ?? rec.picture,
    );
    if (u) return u;
  }
  const u = resolveMediaUrl(
    obj.authorImage ?? obj.authorAvatar ?? obj.authorPhoto ?? obj.writerImage,
  );
  return u || null;
}

function formatDateLabel(raw: unknown): string {
  if (raw == null || raw === "") return "";
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pickReadMinutes(obj: Record<string, unknown>): string | null {
  const v =
    obj.readTime ??
    obj.readingTime ??
    obj.minuteRead ??
    obj.estimatedReadMinutes ??
    obj.readMinutes;
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? String(Math.round(n)) : String(v);
}

export function rewriteHtmlRelativeAssets(html: string): string {
  if (!html) return html;
  const base = String(apiBaseUrl).replace(/\/$/, "");
  return html.replace(
    /<img\b([^>]*?)\bsrc=["'](?!https?:\/\/|data:)([^"']+)["']/gi,
    (_m, before: string, src: string) => {
      const path = src.startsWith("/") ? src : `/${src}`;
      return `<img${before}src="${base}${path}"`;
    },
  );
}

export type BlogPostViewModel = {
  title: string;
  html: string;
  description: string;
  heroImageUrl: string;
  dateLabel: string;
  readMinutes: string | null;
  authorName: string | null;
  authorImageUrl: string | null;
};

export function blogPostViewModelFromPayload(payload: unknown): BlogPostViewModel | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  if (root.success === false) return null;
  const raw = unwrapRecord(payload);
  const title = pickString(raw, ["title", "name", "headline", "seoTitle"]);
  let html = pickHtml(raw);
  html = rewriteHtmlRelativeAssets(html);

  const description = pickString(raw, ["description", "excerpt", "summary", "seoDescription"]);

  const heroImageUrl = resolveMediaUrl(
    raw.image ??
      raw.featuredImage ??
      raw.coverImage ??
      raw.heroImage ??
      raw.thumbnail ??
      raw.banner ??
      raw.ogImage,
  );

  const dateRaw =
    raw.publishedAt ?? raw.publishedDate ?? raw.date ?? raw.createdAt ?? raw.updatedAt;
  const dateLabel = formatDateLabel(dateRaw);

  const readMinutes = pickReadMinutes(raw);
  const authorName = pickAuthorName(raw);
  const authorImageUrl = pickAuthorImage(raw);

  if (!title && !html) return null;

  return {
    title: title || "Blog post",
    html,
    description: description || "",
    heroImageUrl,
    dateLabel,
    readMinutes,
    authorName,
    authorImageUrl,
  };
}

export async function fetchWebsitePagePayload(slug: string): Promise<unknown | null> {
  const safe = encodeURIComponent(slug);
  let payload = await invokeApi({
    path: `/api/website/pages/${safe}`,
    method: "GET",
  });

  if (
    isApiErrorPayload(payload) ||
    (payload && typeof payload === "object" && (payload as Record<string, unknown>).success === false)
  ) {
    payload = await invokeApi({
      path: `/api/content/${safe}`,
      method: "GET",
    });
  }

  if (isApiErrorPayload(payload)) return null;
  return payload;
}

export const getBlogPostViewModel = cache(async (slug: string): Promise<BlogPostViewModel | null> => {
  const payload = await fetchWebsitePagePayload(slug);
  return blogPostViewModelFromPayload(payload);
});
