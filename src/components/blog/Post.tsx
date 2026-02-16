"use client";

import { useRouter } from "next/navigation";

import { person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Avatar, Card, Column, Media, Row, Tag, Text } from "@once-ui-system/core";

type PostMeta = {
  title: string;
  publishedAt: string;
  tags?: string[];
  image?: string; // legacy
  images?: string[]; // preferred
};

type PostShape = {
  slug: string;
  metadata: PostMeta;
};

interface PostProps {
  post: PostShape;
  thumbnail: boolean;
  direction?: "row" | "column";
}

function normalizeImages(meta: { images?: string[]; image?: string }) {
  if (meta.images?.length) return meta.images;
  if (meta.image) return [meta.image];
  return [];
}

function toTagSlug(tag: string) {
  return encodeURIComponent(tag.trim().toLowerCase());
}

export default function Post({ post, thumbnail, direction }: PostProps) {
  const router = useRouter();

  const images = normalizeImages(post.metadata);
  const preview = images[0];

  const goToTag = (tag: string) => {
    router.push(`/blog/tag/${toTagSlug(tag)}`);
  };

  return (
    <Card
      fillWidth
      key={post.slug}
      href={`/blog/${post.slug}`} // ✅ Card остается ссылкой
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {preview && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={preview}
          alt={`Thumbnail of ${post.metadata.title}`}
          aspectRatio="16 / 9"
        />
      )}

      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="12" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{person.name}</Text>
            </Row>

            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt, false)}
            </Text>
          </Row>

          <Text variant="heading-strong-l" wrap="balance">
            {post.metadata.title}
          </Text>

          {/* ✅ теги НЕ как <a>, а как button + router.push */}
          {post.metadata.tags?.length ? (
            <Row wrap gap="8">
              {post.metadata.tags.map((t) => (
                <Tag
                  key={t}
                  size="l"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onClick={(e: any) => {
                    e.preventDefault?.(); // на всякий случай
                    e.stopPropagation?.(); // ✅ не даем Card-ссылке сработать
                    goToTag(t);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault?.();
                      e.stopPropagation?.();
                      goToTag(t);
                    }
                  }}
                >
                  {t}
                </Tag>
              ))}
            </Row>
          ) : null}
        </Column>
      </Row>
    </Card>
  );
}
