import {
  Column,
  Heading,
  Media,
  Meta,
  Row,
  Schema,
  SmartLink,
  Tag,
  Text,
} from "@once-ui-system/core";

import { baseURL, person, services } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: services.title,
    description: services.description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(services.title)}`,
    path: services.path,
  });
}

function mapAboutTagToBlogTag(label: string) {
  // UI label -> canonical blog tag
  const key = label.trim().toLowerCase();

  if (key === "Метафоричні карти") return "метафоричні карти";
  if (key === "руни") return "руни";
  if (key === "енергія") return "енергія";
  if (key === "коучинг") return "коучинг";

  // fallback: используем как есть
  return label;
}

export default function ServicesPage() {
  const technical = services.technical;

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={services.title}
        description={services.description}
        path={services.path}
        image={`/api/og/generate?title=${encodeURIComponent(services.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${services.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Heading as="h1" variant="display-strong-l" marginBottom="m">
        {technical.title}
      </Heading>

      <Column fillWidth gap="l">
        {technical.skills.map((skill, index) => (
          <Column key={`${skill.title}-${index}`} fillWidth gap="4">
            <Text variant="heading-strong-l">{skill.title}</Text>

            <Column gap="8" onBackground="neutral-weak">
              {skill.description}
            </Column>

            {skill.tags?.length ? (
              <Row wrap gap="8" paddingTop="8">
                {skill.tags.map((tag, tagIndex) => (
                  <SmartLink
                    key={`${tag.name}-${tagIndex}`}
                    href={`/blog?tag=${encodeURIComponent(mapAboutTagToBlogTag(tag.name))}`}
                  >
                    <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                      {tag.name}
                    </Tag>
                  </SmartLink>
                ))}
              </Row>
            ) : null}

            {skill.images?.length ? (
              <Row fillWidth paddingTop="m" gap="12" wrap>
                {skill.images.map((image, idx) => (
                  <Row
                    key={idx}
                    border="neutral-medium"
                    radius="m"
                    minWidth={image.width}
                    height={image.height}
                  >
                    <Media
                      enlarge
                      radius="m"
                      sizes={String(image.width)}
                      alt={image.alt}
                      src={image.src}
                    />
                  </Row>
                ))}
              </Row>
            ) : null}
          </Column>
        ))}
      </Column>
    </Column>
  );
}
