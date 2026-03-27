import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CreatorsPageContent from "../../components/CreatorsPageContent";
import CreatorsPageScripts from "../../components/CreatorsPageScripts";

export const metadata = {
  title: "Where creators do brand deals | Supreme Coach",
  description:
    "The all-in-one tool to help creators do more brand deals - easier, and faster.",
  openGraph: {
    title: "Where creators do brand deals | Supreme Coach",
    description:
      "The all-in-one tool to help creators do more brand deals - easier, and faster.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where creators do brand deals | Supreme Coach",
    description:
      "The all-in-one tool to help creators do more brand deals - easier, and faster.",
  },
};

type CreatorsPageProps = {
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const rawType = resolvedSearchParams?.type;
  const typeValue = Array.isArray(rawType) ? rawType[0] : rawType;
  const normalizedType = String(typeValue || "").toLowerCase();
  const type =
    normalizedType === "firms" || normalizedType === "firm"
      ? "firms"
      : "coach";

  return (
    <>
      <Header />
      <CreatorsPageContent type={type} />
      <Footer />
      <CreatorsPageScripts />
    </>
  );
}
