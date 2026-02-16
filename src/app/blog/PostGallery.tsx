"use client";

import { Carousel, Column, Media } from "@once-ui-system/core";

type PostGalleryProps = {
  images: string[];
  title: string;
  fallback?: string;
};

export function PostGallery({ images, title, fallback }: PostGalleryProps) {
  const slides = (images ?? []).filter(Boolean);

  // 0 -> fallback
  if (slides.length === 0) {
    if (!fallback) return null;

    return (
      <Media
        src={fallback}
        alt={title}
        aspectRatio="16/9"
        priority
        sizes="(min-width: 1024px) 768px, (min-width: 768px) 90vw, 100vw"
        border="neutral-alpha-weak"
        radius="l"
        marginTop="12"
        marginBottom="8"
      />
    );
  }

  // 1 -> single hero
  if (slides.length === 1) {
    return (
      <Media
        src={slides[0]}
        alt={title}
        aspectRatio="16/9"
        priority
        sizes="(min-width: 1024px) 768px, (min-width: 768px) 90vw, 100vw"
        border="neutral-alpha-weak"
        radius="l"
        marginTop="12"
        marginBottom="8"
      />
    );
  }

  // 2+ -> slider ONLY (без миниатюр снизу)
  const items = slides.map((src) => ({ slide: src, alt: title }));

  return (
    <Column fillWidth marginTop="12" marginBottom="8">
      <Carousel
        items={items}
        controls
        priority
        fill
        aspectRatio="16/9"
        sizes="(min-width: 1024px) 768px, (min-width: 768px) 90vw, 100vw"
        indicator={false} // ✅ убрали thumbnails снизу
        play={{
          auto: false,
          interval: 5000,
          controls: true,
          progress: true,
        }}
      />
    </Column>
  );
}
