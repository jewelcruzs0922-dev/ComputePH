import type { Metadata } from "next";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

export function socialMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = {
    url: "/images/social-card.png",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} — ${description}`,
  };

  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: SITE_LOCALE,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
