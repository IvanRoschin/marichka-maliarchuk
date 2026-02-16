import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomMDX, ScrollToHash } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";
import { about, baseURL, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import {
  Avatar,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Line,
  Meta,
  Row,
  Schema,
  SmartLink,
  Text,
} from "@once-ui-system/core";

import { PostGallery } from "../PostGallery";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({ slug: post.slug }));
}

type PostShape = {
  slug: string;
  content: string;
  metadata: {
    title: string;
    subtitle?: string;
    summary: string;
    publishedAt: string;
    image?: string; // legacy single
    images?: string[]; // preferred multi
  };
};

function normalizeSlug(slug: string | string[]) {
  return Array.isArray(slug) ? slug.join("/") : slug || "";
}

function resolveImages(post: PostShape): string[] {
  if (post.metadata.images?.length) return post.metadata.images;
  if (post.metadata.image) return [post.metadata.image];
  return [];
}

function resolveHeroImage(post: PostShape): string {
  return (
    post.metadata.images?.[0] ??
    post.metadata.image ??
    `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = normalizeSlug(routeParams.slug);

  const posts = getPosts(["src", "app", "blog", "posts"]) as PostShape[];
  const post = posts.find((p) => p.slug === slugPath);

  if (!post) return {};

  const metaImage = resolveHeroImage(post);

  const meta = Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL,
    image: metaImage,
    path: `${blog.path}/${post.slug}`,
  });

  return {
    ...meta,
    icons: { icon: "/favicon.ico" }, // ✅ это уже Metadata Next.js
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = normalizeSlug(routeParams.slug);

  const post = (getPosts(["src", "app", "blog", "posts"]) as PostShape[]).find(
    (p) => p.slug === slugPath,
  );

  if (!post) notFound();

  const images = resolveImages(post);
  const heroImage = resolveHeroImage(post);

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />

      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={heroImage}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />

          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Блог</Text>
            </SmartLink>

            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>

            <Heading variant="display-strong-m">{post.metadata.title}</Heading>

            {post.metadata.subtitle && (
              <Text
                variant="body-default-l"
                onBackground="neutral-weak"
                align="center"
                style={{ fontStyle: "italic" }}
              >
                {post.metadata.subtitle}
              </Text>
            )}
          </Column>

          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>

          {images.length > 0 && (
            <PostGallery images={images} title={post.metadata.title} fallback={heroImage} />
          )}

          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>

          <ShareSection title={post.metadata.title} url={`${baseURL}${blog.path}/${post.slug}`} />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              Інші пости
            </Text>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>

          <ScrollToHash />
        </Column>
      </Row>

      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <Row gap="8" vertical="center">
          <Icon name="document" onBackground="neutral-weak" />
          <Text variant="label-strong-m">Зміст</Text>
        </Row>

        <HeadingNav fitHeight header={false} />
      </Column>
    </Row>
  );
}
