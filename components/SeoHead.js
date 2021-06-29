import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { siteMetadata } from "../blog.config";

function SeoHead({ title, description, type, image, date, author }) {
  const router = useRouter();
  const meta = {
    ...siteMetadata,
    url: `${siteMetadata.siteUrl}${router.asPath}`,
    title: title
      ? `${title} — ${siteMetadata.title}`
      : `${siteMetadata.title} — A personal blog`,
    description: description ?? siteMetadata.description,
    type: type ?? (title ? "article" : "blog"),
    image,
    date,
    author: author ?? siteMetadata.author,
    publisher: siteMetadata.author,
  };

  const schemaOrgJSONLD = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: meta.url,
      name: meta.title,
      alternateName: siteMetadata.title || "",
    },
  ];

  if (title) {
    schemaOrgJSONLD.push(
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": meta.url,
              name: meta.title,
              image: meta.image,
            },
          },
        ],
      },
      {
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        url: meta.url,
        name: meta.title,
        alternateName: siteMetadata.title || "",
        headline: meta.title,
        ...(image && {
          image: {
            "@type": "ImageObject",
            url: meta.image,
          },
        }),
        datePublished: meta.date,
        author: {
          "@type": "Person",
          name: meta.author.name,
          email: meta.author.email,
        },
        publisher: {
          "@type": "Person",
          name: meta.publisher.name,
          email: meta.publisher.email,
        },
        description: meta.escription,
      }
    );
  }

  return (
    <Head>
      <title>{meta.title}</title>

      <link rel="canonical" href={meta.url} />
      <link rel="home" href={siteMetadata.siteUrl} />

      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:locale" content="en_GB" />
      {meta.image && <meta property="og:image" content={meta.image} />}
      <meta
        name="twitter:card"
        content={meta.image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:site" content={meta.social.twitter} />
      <meta name="twitter:creator" content={meta.social.twitter} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}
      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
      {/* Schema.org tags */}
      <script type="application/ld+json">
        {process.env.NODE_ENV === "production"
          ? JSON.stringify(schemaOrgJSONLD)
          : JSON.stringify(schemaOrgJSONLD, null, 3)}
      </script>
    </Head>
  );
}

export default SeoHead;
