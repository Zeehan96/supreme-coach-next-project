import Link from "next/link";
import type { BlogPostViewModel } from "../lib/blogPostFromApi";

type BlogPostDynamicViewProps = {
  post: BlogPostViewModel;
};

type BlogPostDynamicViewPropsWithBack = BlogPostDynamicViewProps & {
  backHref?: string;
  backLabel?: string;
};

export default function BlogPostDynamicView({
  post,
  backHref = "/blog",
  backLabel = "back to blog",
}: BlogPostDynamicViewPropsWithBack) {
  const showAuthor = Boolean(post.authorName || post.authorImageUrl);
  const showMetaRow = Boolean(post.dateLabel || post.readMinutes);

  return (
    <div className="page-wrapper">
      <div className="global-styles w-embed">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .stories_richtext h2 {
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-size: 1.75rem;
            font-weight: 600;
          }
          .stories_richtext p {
            margin-bottom: 1rem;
            line-height: 1.7;
          }
          .stories_richtext ul {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
          }
          .stories_richtext li {
            margin-bottom: 0.5rem;
            line-height: 1.7;
          }
          .stories_richtext figure {
            margin: 2rem 0;
          }
          .stories_richtext img {
            max-width: 100%;
            border-radius: 12px;
          }
          .stories_richtext a {
            color: var(--sc-orange);
            text-decoration: underline;
          }
          .stories_richtext a:hover {
            opacity: 0.8;
          }
          .blog_outer {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          @media (min-width: 992px) {
            .blog_outer {
              grid-template-columns: 1fr 300px;
              align-items: start;
            }
            .blog-scroll-container {
              max-height: calc(100vh - 9rem);
              overflow-y: auto;
              overscroll-behavior: contain;
              scroll-behavior: smooth;
              padding-right: 0.75rem;
              margin-right: -0.25rem;
            }
          }
          .stories_content {
            max-width: 100%;
          }
          [fs-toc-element="list"] a.toc-link {
            display: block;
            padding: 0.5rem 0;
            color: inherit;
            text-decoration: none;
            opacity: 0.7;
            transition: opacity 0.2s ease, font-weight 0.15s ease;
            font-size: 0.875rem;
            font-weight: 400;
          }
          [fs-toc-element="list"] a.toc-link:hover {
            opacity: 1;
          }
          [fs-toc-element="list"] a.toc-link.is-active {
            font-weight: 700;
            opacity: 1;
          }
          .backlink-wrapper {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: inherit;
            opacity: 0.7;
            transition: opacity 0.2s ease;
          }
          .backlink-wrapper:hover {
            opacity: 1;
          }
          .post-author_component {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .blog-detail-hero-frame {
            width: 100%;
            align-self: stretch;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            border-radius: 0.75rem;
            line-height: 0;
            box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.2);
          }
          .blog-detail-hero-frame .blog-detail-hero-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
            border-radius: 0;
            box-shadow: none;
            max-height: none;
          }
        `,
          }}
        />
      </div>

      <main className="main-wrapper">
        <section className="section-blog-post-hero">
          <div className="page-padding">
            <div className="padding-section-medium">
              <article className="container-large">
                <div className="post-hero_component">
                  <div className="post-hero_backlink">
                    <div className="margin-bottom margin-custom1">
                      <Link href={backHref} className="backlink-wrapper w-inline-block">
                        <img
                          src="https://cdn.prod.website-files.com/6340255dae4cf91cdda9ff9f/6340255dae4cf93795aa0049_Backward%20Arrow.svg"
                          loading="lazy"
                          alt=""
                          className="backlink_image"
                        />
                        <div className="text-style-label is-medium">{backLabel}</div>
                      </Link>
                    </div>
                  </div>

                  <div className="margin-bottom margin-custom1">
                    <div className="text-align-center">
                      <h1 className="heading-style-h2 main-hero-heading">{post.title}</h1>
                    </div>
                  </div>

                  {showMetaRow ? (
                    <div className="margin-bottom margin-small">
                      <div
                        className="content-meta_wrapper"
                        style={{ justifyContent: "center" }}
                      >
                        {post.dateLabel ? (
                          <div className="text-style-label is-medium margin-right margin-xsmall">
                            {post.dateLabel}
                          </div>
                        ) : null}
                        {post.dateLabel && post.readMinutes ? (
                          <div className="text-style-label is-medium margin-right margin-xsmall">
                            •
                          </div>
                        ) : null}
                        {post.readMinutes ? (
                          <>
                            <div className="text-style-label is-medium margin-right margin-xxsmall">
                              {post.readMinutes}
                            </div>
                            <div className="text-style-label is-medium margin-right margin-xxsmall">
                              min read
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {showAuthor ? (
                    <div className="margin-bottom margin-medium">
                      <div className="post-author_component">
                        {post.authorImageUrl ? (
                          <img
                            loading="lazy"
                            alt=""
                            src={post.authorImageUrl}
                            className="author_headshot margin-right margin-xsmall"
                            style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "50%" }}
                          />
                        ) : null}
                        {post.authorName ? (
                          <>
                            <div className="text-style-label is-medium margin-right margin-xxsmall">
                              by
                            </div>
                            <div className="text-style-label is-medium margin-right margin-xxsmall">
                              {post.authorName}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {post.heroImageUrl ? (
                    <div className="blog-detail-hero-frame">
                      <img
                        loading="lazy"
                        alt=""
                        src={post.heroImageUrl}
                        sizes="(max-width: 1200px) 100vw, 1080px"
                        className="blog-detail-hero-img"
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="section_stories-content">
          <div className="padding-global padding-section-medium blog">
            <div className="container-large">
              <div className="blog_outer">
                <div className="stories_content">
                  <div
                    className="stories_body blog-scroll-container"
                    data-blog-scroll-container
                  >
                    <div className="stories_rich-text-wrapper">
                      <div
                        fs-toc-offsettop="5rem"
                        fs-toc-element="contents"
                        className="stories_richtext w-richtext"
                        dangerouslySetInnerHTML={{ __html: post.html }}
                      />
                    </div>
                  </div>
                </div>

                <aside className="hide-tablet">
                  <div style={{ position: "sticky", top: "120px" }}>
                    <div className="text-style-label is-medium margin-bottom margin-small">
                      On this page
                    </div>
                    <div
                      fs-toc-element="list"
                      className="fs-toc_link-content toc"
                      style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
                    />
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
