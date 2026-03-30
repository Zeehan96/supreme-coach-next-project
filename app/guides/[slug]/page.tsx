import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import BlogPostDynamicView from "../../../components/BlogPostDynamicView";
import BlogPostPageScripts from "../../../components/BlogPostPageScripts";
import Footer from "../../../components/Footer";
import { fetchAllSlugsForContentType } from "../../../lib/fetchAllContentSlugs";
import { getBlogPostViewModel } from "../../../lib/blogPostFromApi";

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllSlugsForContentType("guides");
    if (slugs.length > 0) {
      return slugs.map((slug: string) => ({ slug }));
    }
  } catch (error) {
    console.error("Failed to fetch guide static params:", error);
  }

  return [{ slug: "getting-started-with-creator-marketing" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostViewModel(slug);

  const fallback = {
    title: "Guide Post | Supreme Coach",
    description: "Read our latest guide",
    image: "",
  };

  const title = post?.title || fallback.title;
  const description =
    (post?.description && post.description.trim()) || fallback.description;
  const image = post?.heroImageUrl || fallback.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.supremecoach.xyz/guides/${slug}`,
      siteName: "Supreme Coach",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function GuidePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostViewModel(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <BlogPostDynamicView
        post={post}
        backHref="/guides"
        backLabel="back to guides"
      />
      <BlogPostPageScripts />
      <Footer />
    </>
  );
}

