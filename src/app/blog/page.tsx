import { Column, Heading, Meta, Row, Schema, SmartLink, Tag } from "@once-ui-system/core";

import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const activeTag = tag?.trim();

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Row fillWidth horizontal="between" vertical="center" paddingX="24" marginBottom="l">
        <Heading variant="heading-strong-xl">{blog.title}</Heading>

        {activeTag ? (
          <Row gap="8" vertical="center">
            <Tag size="l">{activeTag}</Tag>
            <SmartLink href="/blog">
              <Tag size="l" prefixIcon="close">
                Скинути
              </Tag>
            </SmartLink>
          </Row>
        ) : null}
      </Row>

      <Column fillWidth flex={1} gap="40">
        {activeTag ? (
          <>
            {/* ✅ Один список, фильтрация внутри Posts */}
            <Posts tag={activeTag} columns="2" thumbnail direction="column" />
            <Mailchimp marginBottom="l" />
          </>
        ) : (
          <>
            {/* ✅ Твоя текущая структура без фильтра */}
            <Posts range={[1, 1]} thumbnail />
            <Posts range={[2, 3]} columns="2" thumbnail direction="column" />
            <Mailchimp marginBottom="l" />
            <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
              Попередні публікації
            </Heading>
            <Posts range={[4]} columns="2" />
          </>
        )}
      </Column>
    </Column>
  );
}
