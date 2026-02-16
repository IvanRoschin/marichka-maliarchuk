import { Column, Heading, Meta, Schema, SmartLink, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog } from "@/resources";
function normalizeParamTag(tag: string) {
  // tag приходит уже decodeURIComponent’ом в Next, но оставим безопасно
  return decodeURIComponent(tag).trim().toLowerCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = normalizeParamTag(tag);

  return Meta.generate({
    title: `Тег: ${decoded} — ${blog.title}`,
    description: `Публікації за тегом: ${decoded}`,
    baseURL,
    path: `/blog/tag/${encodeURIComponent(decoded)}`,
    image: `/api/og/generate?title=${encodeURIComponent(`Тег: ${decoded}`)}`,
  });
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = normalizeParamTag(tag);

  if (!decoded) notFound();

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`Тег: ${decoded}`}
        description={`Публікації за тегом: ${decoded}`}
        path={`/blog/tag/${encodeURIComponent(decoded)}`}
        image={`/api/og/generate?title=${encodeURIComponent(`Тег: ${decoded}`)}`}
      />

      <Column fillWidth gap="16" paddingX="l" marginBottom="l">
        <SmartLink href="/blog">
          <Text variant="label-strong-m">← Назад до блогу</Text>
        </SmartLink>

        <Heading variant="heading-strong-xl">Тег: {decoded}</Heading>
      </Column>

      {/* ✅ фильтрация */}
      <Posts tag={decoded} columns="2" thumbnail direction="column" />

      <Mailchimp marginBottom="l" />
    </Column>
  );
}
