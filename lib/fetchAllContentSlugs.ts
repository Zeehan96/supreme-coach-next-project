import { invokeApi } from "../api";
import { cmsContentTypeForApi, type CmsContentSection } from "./cmsContentApiType";

const STATIC_FETCH_LIMIT = 50;
const MAX_PAGES = 200;

export type CmsContentType = CmsContentSection;

export async function fetchAllSlugsForContentType(
  section: CmsContentType,
): Promise<string[]> {
  const slugs = new Set<string>();
  const apiType = cmsContentTypeForApi(section);

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const payload = await invokeApi({
      path: "/api/website/content",
      method: "GET",
      queryParams: {
        type: apiType,
        page: String(page),
        limit: String(STATIC_FETCH_LIMIT),
      },
    });

    if (!payload || typeof payload !== "object") break;
    const p = payload as Record<string, unknown>;
    if (typeof p.code === "number" && p.code > 0 && p.data === undefined) break;

    const items = Array.isArray(p.data)
      ? p.data
      : Array.isArray(p.content)
        ? p.content
        : [];

    for (const item of items) {
      const rec = item as Record<string, unknown>;
      if (typeof rec?.slug === "string" && rec.slug.trim()) {
        slugs.add(rec.slug.trim());
      }
    }

    const pag = p.pagination as Record<string, unknown> | undefined;
    const hasNext = Boolean(pag?.hasNext);
    if (!hasNext) break;
  }

  return Array.from(slugs);
}
