import { apiBaseUrl } from "../config/env";

export function normalizeWebsiteContentList(payload: unknown): Record<string, unknown>[] {
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.data)) return p.data as Record<string, unknown>[];
  if (Array.isArray(p.content)) return p.content as Record<string, unknown>[];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  return [];
}

export type ContentPagination = {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
  totalCount: number;
  totalPages: number;
};

export function parseContentPagination(payload: unknown): ContentPagination | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const pag = p.pagination;
  if (!pag || typeof pag !== "object") return null;
  const pg = pag as Record<string, unknown>;

  const num =
    (a: unknown, b?: unknown, c?: unknown, d?: unknown): number => {
      const n =
        (typeof a === "number" ? a : undefined) ??
        (typeof b === "number" ? b : undefined) ??
        (typeof c === "number" ? c : undefined) ??
        (typeof d === "number" ? d : undefined);

      if (typeof n === "number" && Number.isFinite(n)) return n;

      const asStr =
        typeof a === "string"
          ? a
          : typeof b === "string"
            ? b
            : typeof c === "string"
              ? c
              : typeof d === "string"
                ? d
                : "";

      const parsed = asStr ? Number(asStr) : NaN;
      return Number.isFinite(parsed) ? parsed : 0;
    };

  const bool =
    (a: unknown, b?: unknown, c?: unknown): boolean => {
      if (typeof a === "boolean") return a;
      if (typeof a === "number") return a !== 0;
      if (typeof a === "string") return a === "true" || a === "1";
      if (typeof b === "boolean") return b;
      if (typeof c === "boolean") return c;
      return false;
    };

  return {
    currentPage:
      num(pg.currentPage, (pg as any).current_page) || 1,
    hasNext: bool(pg.hasNext, (pg as any).has_next, (pg as any).next),
    hasPrev: bool(pg.hasPrev, (pg as any).has_prev, (pg as any).prev),
    limit: num(pg.limit, (pg as any).perPage, (pg as any).pageSize) || 10,
    totalCount: num(pg.totalCount, (pg as any).total_count) || 0,
    totalPages:
      num(pg.totalPages, (pg as any).total_pages) || 1,
  };
}

function imageSourceToString(raw: unknown): string {
  if (raw == null) return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "object" && raw !== null && "url" in raw) {
    const u = (raw as { url?: unknown }).url;
    return typeof u === "string" ? u.trim() : "";
  }
  return "";
}

export function resolveMediaUrl(
  value: unknown,
  base: string = String(apiBaseUrl).replace(/\/$/, "")
): string {
  const s = imageSourceToString(value);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${base}${path}`;
}

export type BlogCardModel = {
  slug: string;
  title: string;
  imageUrl: string;
  dateLabel: string;
  readMinutes: string | null;
  categories: string[];
  /** ms since epoch for sorting (newest first); 0 if no date */
  sortTimestamp: number;
};

export function sortBlogCards(a: BlogCardModel, b: BlogCardModel): number {
  if (b.sortTimestamp !== a.sortTimestamp) {
    return b.sortTimestamp - a.sortTimestamp;
  }
  return a.slug.localeCompare(b.slug);
}

export function mergeBlogCardsBySlug(
  previous: BlogCardModel[],
  incoming: BlogCardModel[],
): BlogCardModel[] {
  const seen = new Set(previous.map((x) => x.slug));
  const merged = [...previous];
  for (const c of incoming) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      merged.push(c);
    }
  }
  return merged.sort(sortBlogCards);
}

export function toBlogCard(item: Record<string, unknown>, base?: string): BlogCardModel | null {
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  if (!slug) return null;

  const title =
    (typeof item.title === "string" && item.title.trim()) ||
    (typeof item.name === "string" && item.name.trim()) ||
    "Untitled";

  const imageRaw =
    item.image ??
    item.featuredImage ??
    item.coverImage ??
    item.thumbnail ??
    item.heroImage ??
    item.imageUrl ??
    item.banner;

  const imageUrl = resolveMediaUrl(imageRaw, base);

  const dateRaw =
    item.publishedAt ?? item.publishedDate ?? item.date ?? item.createdAt ?? item.updatedAt;
  let dateLabel = "";
  let sortTimestamp = 0;
  if (dateRaw != null && dateRaw !== "") {
    const d = new Date(String(dateRaw));
    if (!Number.isNaN(d.getTime())) {
      sortTimestamp = d.getTime();
      dateLabel = d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  const readRaw =
    item.readTime ??
    item.readingTime ??
    item.minuteRead ??
    item.estimatedReadMinutes ??
    item.readMinutes;
  let readMinutes: string | null = null;
  if (readRaw != null && readRaw !== "") {
    const n = Number(readRaw);
    readMinutes = Number.isFinite(n) ? String(Math.round(n)) : String(readRaw);
  }

  let categories: string[] = [];
  if (Array.isArray(item.categories)) {
    categories = item.categories.map((c) => String(c)).filter(Boolean);
  } else if (typeof item.category === "string" && item.category.trim()) {
    categories = [item.category.trim()];
  } else if (Array.isArray(item.tags)) {
    categories = item.tags
      .map((t) => (typeof t === "string" ? t : (t as { name?: string })?.name))
      .filter((x): x is string => typeof x === "string" && x.length > 0);
  }

  return { slug, title, imageUrl, dateLabel, readMinutes, categories, sortTimestamp };
}
