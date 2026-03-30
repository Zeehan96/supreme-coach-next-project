import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/components.css";
import "../styles/header-responsive.css";
import NotistackProvider from "../components/NotistackProvider";

export const metadata: Metadata = {
  title: "Supreme Coach | The Largest B2B Influencer Platform",
  description:
    "Where B2B brands scale influencer marketing. Find the right creators on all platforms, book, collaborate, and pay - all in one place.",
  openGraph: {
    title: "Supreme Coach | The Largest B2B Influencer Platform",
    description:
      "Where B2B brands scale influencer marketing. Find the right creators on all platforms, book, collaborate, and pay - all in one place.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supreme Coach | The Largest B2B Influencer Platform",
    description:
      "Where B2B brands scale influencer marketing. Find the right creators on all platforms, book, collaborate, and pay - all in one place.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css"
        />
      </head>
      <body className="v2-body">
        <NotistackProvider>
          <div className="page-wrapper">
            <div className="global-styles w-embed" />
            {children}
          </div>
        </NotistackProvider>
      </body>
    </html>
  );
}
