import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import BlogPostDynamicView from "../../../components/BlogPostDynamicView";
import BlogPostPageScripts from "../../../components/BlogPostPageScripts";
import Footer from "../../../components/Footer";
import { getBlogPostViewModel } from "../../../lib/blogPostFromApi";
import { fetchAllSlugsForContentType } from "../../../lib/fetchAllContentSlugs";

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllSlugsForContentType("blog");
    if (slugs.length > 0) {
      return slugs.map((slug: string) => ({ slug }));
    }
  } catch (error) {
    console.error("Failed to fetch blog static params:", error);
  }

  return [{ slug: "5-tips-to-run-newsletter-marketing-campaigns" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostViewModel(slug);

  const blogMetadata: Record<
    string,
    {
      title: string;
      description: string;
      image: string;
      publishedTime: string;
      modifiedTime: string;
    }
  > = {
    "5-tips-to-run-newsletter-marketing-campaigns": {
      title:
        "5 Tips to run Newsletter Marketing campaigns | Supreme Coach Blog",
      description:
        "Create successful newsletter marketing campaigns that convert more customers",
      image: "",
      publishedTime: "2024-03-05",
      modifiedTime: "2024-03-08",
    },
  };

  const fallbackMetadata = blogMetadata[slug] || {
    title: "Blog Post | Supreme Coach",
    description: "Read our latest blog post",
    image: "",
    publishedTime: "",
    modifiedTime: "",
  };

  const title = post?.title || fallbackMetadata.title;
  const description =
    (post?.description && post.description.trim()) || fallbackMetadata.description;
  const image = post?.heroImageUrl || fallbackMetadata.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.supremecoach.xyz/blog/${slug}`,
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

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostViewModel(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <BlogPostDynamicView post={post} />
      <BlogPostPageScripts />
      <Footer />
    </>
  );
}
