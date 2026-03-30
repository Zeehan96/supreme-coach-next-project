/** Keys used in routes / UI (blog, stories, guides pages). */
export type CmsContentSection = "blog" | "stories" | "guides";

/**
 * `type` query param for `/api/website/content` (and similar CMS endpoints).
 * API expects `story` and `guide`, not `stories` / `guides`.
 */
export function cmsContentTypeForApi(section: CmsContentSection): "blog" | "story" | "guide" {
  if (section === "stories") return "story";
  if (section === "guides") return "guide";
  return "blog";
}
