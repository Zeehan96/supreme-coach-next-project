"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import HeroBlog from "./Blog/HeroBlog";
import { invokeApi } from "../api";
import { cmsContentTypeForApi, type CmsContentSection } from "../lib/cmsContentApiType";
import {
  normalizeWebsiteContentList,
  parseContentPagination,
  sortBlogCards,
  toBlogCard,
  type BlogCardModel,
} from "../lib/websiteContent";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

function isInvokeApiErrorPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const o = payload as Record<string, unknown>;
  return typeof o.code === "number" && o.code > 0 && o.data === undefined;
}

interface BlogPageContentProps {
  type?: "blog" | "stories" | "guides";
}

function getPaginationPages(totalPages: number, currentPage: number) {
  if (totalPages <= 1) return [1];
  const pages: Array<number | "..."> = [];

  const maxPagesToShowDesktop = 10;
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (totalPages <= maxPagesToShowDesktop) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push("...");

  pages.push(totalPages);
  return pages;
}

export default function BlogPageContent({ type = "blog" }: BlogPageContentProps) {
  const section: CmsContentSection =
    type === "stories" ? "stories" : type === "guides" ? "guides" : "blog";
  const apiContentType = cmsContentTypeForApi(section);
  const basePath =
    type === "stories" ? "/stories" : type === "guides" ? "/guides" : "/blog";

  const headingText = useMemo(() => {
    if (type === "stories") return "All stories";
    if (type === "guides") return "All guides";
    return "All blogs";
  }, [type]);

  const [heroPosts, setHeroPosts] = useState<BlogCardModel[]>([]);
  const [posts, setPosts] = useState<BlogCardModel[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const skipFetchOnFirstPageChangeRef = useRef(false);

  const loadPage = async (pageNum: number) => {
    console.log("[BlogPageContent] loadPage pageNum=", pageNum);
    const payload = await invokeApi({
      path: "/api/website/content",
      method: "GET",
      queryParams: {
        type: apiContentType,
        page: String(pageNum),
        limit: String(PAGE_SIZE),
      },
    });

    if (isInvokeApiErrorPayload(payload)) {
      return { cards: [] as BlogCardModel[], pagination: null as ReturnType<typeof parseContentPagination> };
    }

    const raw = normalizeWebsiteContentList(payload);
    const cards = raw
      .map((item) => toBlogCard(item))
      .filter((c): c is BlogCardModel => c !== null)
      .sort(sortBlogCards);

    const pagination = parseContentPagination(payload);
    console.log("[BlogPageContent] pagination=", pagination);
    return { cards, pagination };
  };

  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    setPageLoading(false);
    setCurrentPage(1);
    skipFetchOnFirstPageChangeRef.current = true;

    (async () => {
      const { cards, pagination } = await loadPage(1);
      if (cancelled) return;
      setHeroPosts(cards);
      setPosts(cards);
      setTotalPages(pagination?.totalPages ?? 1);
      setTotalCount(pagination?.totalCount ?? cards.length);
      setInitialLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, apiContentType]);

  useEffect(() => {
    let cancelled = false;
    if (skipFetchOnFirstPageChangeRef.current) {
      skipFetchOnFirstPageChangeRef.current = false;
      return;
    }
    setPageLoading(true);

    (async () => {
      const { cards, pagination } = await loadPage(currentPage);
      if (cancelled) return;
      if (currentPage === 1) {
        setHeroPosts(cards);
      }
      setPosts(cards);
      setTotalPages(pagination?.totalPages ?? totalPages);
      setTotalCount(pagination?.totalCount ?? totalCount);
      setPageLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, type, apiContentType]);

  const displayStart = (currentPage - 1) * PAGE_SIZE;
  const displayEnd = Math.min(displayStart + PAGE_SIZE, totalCount);
  const pageItems = getPaginationPages(totalPages, currentPage);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background-color: rgba(255, 153, 102, 1); }
        .blog-card_card-image { aspect-ratio: 16/9; }
        .blog-card_no-image-placeholder {
          display: flex; align-items: center; justify-content: center; min-height: 0;
          background-color: rgba(0, 0, 0, 0.05);
          border: 1px dashed rgba(0, 0, 0, 0.18);
          color: rgba(0, 0, 0, 0.45);
        }
        .pagination-bar button {
          border: 1px solid rgba(0,0,0,0.25);
          border-radius: 9999px;
          padding: 0;
          width: 2rem;
          height: 2rem;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s ease, opacity 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .pagination-bar button:hover { background: rgba(255, 153, 102, 0.2); }
        .pagination-bar button:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination-bar .is-active { background: rgba(255, 153, 102, 0.35); font-weight: 700; }
        .blog-page-spinner {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 3px solid rgba(255, 163, 102, 0.25); /* #ffa366 */
          border-top-color: rgba(255, 163, 102, 1); /* #ffa366 */
          animation: blog-spinner-rotate 0.85s linear infinite;
        }
        @keyframes blog-spinner-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
        }}
      />

      <main className="main-wrapper">
        <HeroBlog type={type} featuredPosts={heroPosts.slice(0, 3)} loading={initialLoading} />

        <section className="section-podcast-episodes">
          <div className="page-padding">
            <div className="padding-section-medium">
              <div className="margin-bottom margin-medium">
                <div className="container-small">
                  <div className="margin-bottom margin-medium">
                    <div className="text-align-center">
                      <h2 className="heading-style-h3 blog">{headingText}</h2>
                    </div>
                  </div>
                  <div className="w-embed">
                    <style
                      dangerouslySetInnerHTML={{
                        __html: "\n.podcast-cms_thumbnail {aspect-ratio: 16/9;}\n",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="container-large">
                <div className="blog-collection_wrapper w-dyn-list">
                  <div
                    fs-cmsfilter-element="list"
                    role="list"
                    className="blog-collection_list w-dyn-items"
                  >
                    {initialLoading || pageLoading ? (
                      <div
                        className="text-align-center padding-section-medium"
                        style={{
                          gridColumn: "1 / -1",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          role="status"
                          aria-live="polite"
                          aria-label="Loading posts"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div className="blog-page-spinner" />
                        </div>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-align-center padding-section-medium">
                        <p className="text-style-label is-medium">No posts yet.</p>
                      </div>
                    ) : (
                      <>
                        {posts.map((post) => (
                          <div
                            key={post.slug}
                            role="listitem"
                            className="main-card-collection_item w-dyn-item"
                          >
                            <Link
                              href={`${basePath}/${encodeURIComponent(post.slug)}`}
                              className="main-card_wrapper is-featured w-inline-block"
                            >
                              <div className="blog-card_content-wrap">
                                <div className="blog-card_top-content">
                                  {post.imageUrl ? (
                                    <img
                                      src={post.imageUrl}
                                      loading="lazy"
                                      alt=""
                                      sizes="100vw"
                                      className="blog-card_card-image"
                                    />
                                  ) : (
                                    <div
                                      className="blog-card_card-image blog-card_no-image-placeholder"
                                      role="img"
                                      aria-label="No image"
                                    >
                                      <span className="text-style-label is-medium">No image</span>
                                    </div>
                                  )}

                                  {post.dateLabel || post.readMinutes ? (
                                    <div className="margin-bottom margin-xsmall">
                                      <div className="margin-top margin-small">
                                        <div className="content-meta_wrapper margin-bottom margin-xsmall">
                                          {post.dateLabel ? (
                                            <div className="text-style-label is-small margin-right margin-xsmall">
                                              {post.dateLabel}
                                            </div>
                                          ) : null}
                                          {post.dateLabel && post.readMinutes ? (
                                            <div className="text-style-label is-small margin-right margin-xsmall">
                                              •
                                            </div>
                                          ) : null}
                                          {post.readMinutes ? (
                                            <>
                                              <div className="text-style-label is-small margin-right margin-xxsmall">
                                                {post.readMinutes}
                                              </div>
                                              <div className="text-style-label is-small">min read</div>
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}

                                  <h2 className="heading-style-h5">{post.title}</h2>
                                </div>

                                <div className="blog-card_bottom-content">
                                  <div className="button">
                                    <div className="button-text">Read more</div>
                                    <img
                                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf94567a9ffdd_Arrow%20Frame.svg"
                                      loading="lazy"
                                      alt=""
                                      className="button-arrow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>

                            {post.categories.length > 0 ? (
                              <div className="category-cms_filter-hidden w-dyn-list">
                                <div role="list" className="w-dyn-items">
                                  {post.categories.map((cat) => (
                                    <div key={cat} role="listitem" className="w-dyn-item">
                                      <div fs-cmsfilter-field="category">{cat}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "1.25rem" }} className="pagination-bar">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div className="text-style-label is-medium" style={{ opacity: 0.75 }}>
                      {totalCount > 0 ? (
                        <>
                          Showing {displayStart + 1} to {displayEnd} of {totalCount}
                        </>
                      ) : (
                        "No items"
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || initialLoading}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {pageItems.map((p, idx) =>
                        p === "..." ? (
                          <span key={`ellipsis-${idx}`} style={{ opacity: 0.6 }}>
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            disabled={initialLoading}
                            className={p === currentPage ? "is-active" : ""}
                            style={{ fontSize: "0.875rem" }}
                          >
                            {p}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || initialLoading}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {pageLoading ? (
                    null
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-content-link">
          <div className="page-padding">
            <div className="padding-section-medium">
              <div className="container-large">
                <div className="margin-bottom margin-large">
                  <h2 className="heading-style-h3">Content that gets your creative juices going</h2>
                </div>
                <div className="w-layout-grid content-link_grid">
                  <a
                    id="w-node-c9b299c4-0cf9-829b-3e3f-086ae013c3e6-9dde2fc0"
                    href="/creators-on-air"
                    className="content-link_card-wrapper is-blue w-inline-block"
                  >
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf90ae9aa0104_Pod%20Froot.svg"
                      loading="lazy"
                      alt="Blue podcasting froot"
                      className="content-link_froot"
                    />
                    <h3 className="content-link_title">
                      Creators <br />
                      on a<span className="content-link_podcast-icon">i</span>r
                    </h3>
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf96d99aa002e_Arrow%20Blue.svg"
                      loading="lazy"
                      alt="Blue right arrow"
                      className="content-link_arrow"
                    />
                  </a>
                  <a
                    id="w-node-_89bc98f9-4ebe-0598-933b-00395cf17f70-9dde2fc0"
                    href="/frootful-creator"
                    className="content-link_card-wrapper is-pink w-inline-block"
                  >
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf93668aa0106_Newsletter%20Froot.svg"
                      loading="lazy"
                      alt="Newsletter froot scrolling laptop"
                      className="content-link_froot"
                    />
                    <h3 className="content-link_title">Frootful Creator</h3>
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf9093aaa0038_Yellow%20Arrow.svg"
                      loading="lazy"
                      alt="Yellow right arrow"
                      className="content-link_arrow"
                    />
                  </a>
                  <a
                    id="w-node-_9514747d-8c1e-3edc-fdf8-c81f137dd83d-9dde2fc0"
                    data-w-id="9514747d-8c1e-3edc-fdf8-c81f137dd83d"
                    href="#"
                    className="content-link_card-wrapper is-green w-inline-block"
                  >
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf97230aa002c_Green%20froot.svg"
                      loading="lazy"
                      alt="Green froot illustration"
                      className="content-link_froot"
                    />
                    <h3 className="content-link_title">
                      The
                      <br />
                      Guides
                    </h3>
                    <img
                      src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf946deaa002d_Green%20Arrow.svg"
                      loading="lazy"
                      alt="Green right arrow"
                      className="content-link_arrow"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

