import Link from "next/link";
import React from "react";
import type { BlogCardModel } from "../../lib/websiteContent";

const READ_MORE_ARROW_SRC =
  "https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf94567a9ffdd_Arrow%20Frame.svg";

interface HeroBlogProps {
  type?: "blog" | "stories" | "guides";
  featuredPosts: BlogCardModel[];
  loading?: boolean;
}

function HeroBlogCard({
  post,
  basePath,
}: {
  post: BlogCardModel;
  basePath: string;
}) {
  return (
    <div role="listitem" className="main-card-collection_item w-dyn-item">
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
                src={READ_MORE_ARROW_SRC}
                loading="lazy"
                alt=""
                className="button-arrow"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function HeroBlogSkeleton() {
  return (
    <div role="listitem" className="main-card-collection_item w-dyn-item">
      <div
        className="main-card_wrapper is-featured w-inline-block"
        style={{ pointerEvents: "none", opacity: 0.55 }}
        aria-hidden
      >
        <div className="blog-card_content-wrap">
          <div className="blog-card_top-content">
            <div
              className="blog-card_card-image"
              style={{ background: "rgba(0,0,0,0.08)" }}
            />
            <div className="margin-bottom margin-xsmall">
              <div
                className="margin-top margin-small"
                style={{
                  height: "0.875rem",
                  maxWidth: "60%",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                height: "1.25rem",
                background: "rgba(0,0,0,0.06)",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            />
            <div
              style={{
                height: "1.25rem",
                maxWidth: "85%",
                background: "rgba(0,0,0,0.06)",
                borderRadius: "4px",
              }}
            />
          </div>
          <div className="blog-card_bottom-content">
            <div className="button" style={{ opacity: 0.5 }}>
              <div className="button-text">Read more</div>
              <img
                src={READ_MORE_ARROW_SRC}
                loading="lazy"
                alt=""
                className="button-arrow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroBlog = ({
  type = "blog",
  featuredPosts,
  loading = false,
}: HeroBlogProps) => {
  const basePath =
    type === "stories" ? "/stories" : type === "guides" ? "/guides" : "/blog";
  const topThree = featuredPosts.slice(0, 3);

  return (
    <div
      className="page-padding"
      style={{
        background: "#f96",
      }}
    >
      <div className="padding-section-medium is-blog">
        <div className="container-large">
          <div className="blog-hero_component">
            <h1>Supreme Coach </h1>
            <div className="" />
          </div>
          <div className="blog-hero_text-section">
            <p className="text-size-large text-align-center">
              Everything you need to know about creators and brand partnerships.
              From the team powering it.
            </p>
            <div className="w-embed">
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    "\n.blog-card_card-image {\naspect-ratio: 16/9;\n}\n.blog-card_no-image-placeholder {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 0;\n  background-color: rgba(0, 0, 0, 0.05);\n  border: 1px dashed rgba(0, 0, 0, 0.18);\n  color: rgba(0, 0, 0, 0.45);\n}\n\n",
                }}
              />
            </div>
          </div>
          <div className="blog-collection_wrapper w-dyn-list">
            <div role="list" className="blog-collection_list w-dyn-items">
              {loading ? (
                [0, 1, 2].map((i) => <HeroBlogSkeleton key={i} />)
              ) : topThree.length === 0 ? (
                <div
                  className="text-align-center padding-section-medium"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <p className="text-style-label is-medium">No posts yet.</p>
                </div>
              ) : (
                topThree.map((post) => (
                  <HeroBlogCard key={post.slug} post={post} basePath={basePath} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBlog;
