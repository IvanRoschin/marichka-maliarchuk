"use client";

import { useRef, useState } from "react";

import { mailchimp, newsletter } from "@/resources";
import {
  Background,
  Button,
  Column,
  Heading,
  Input,
  Row,
  type SpacingToken,
  Text,
  type opacity,
  useToast,
} from "@once-ui-system/core";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

export const Mailchimp: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const { addToast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // чтобы не спамить тостом на blur каждый раз
  const lastInvalidToastAtRef = useRef<number>(0);

  const validateEmail = (value: string): boolean => {
    if (!value) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const showInvalidEmailToast = () => {
    const now = Date.now();
    if (now - lastInvalidToastAtRef.current < 1500) return; // анти-спам
    lastInvalidToastAtRef.current = now;

    addToast({
      variant: "danger",
      message: "Будь ласка, введіть коректну адресу електронної пошти",
    });
  };

  const debouncedValidate = debounce((value: string) => {
    const normalized = value.trim().toLowerCase();
    if (normalized && !validateEmail(normalized)) {
      showInvalidEmailToast();
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value); // <-- важно: обновляем сразу
    debouncedValidate(value); // <-- debounce только на валидацию
  };

  const handleBlur = () => {
    const normalized = email.trim().toLowerCase();
    if (normalized && !validateEmail(normalized)) {
      showInvalidEmailToast();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = String(fd.get("EMAIL") ?? "");
    const normalized = raw.trim().toLowerCase();

    if (!validateEmail(normalized)) {
      showInvalidEmailToast();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      const data = await res.json().catch(() => ({}) as any);

      if (!res.ok || !data.ok) {
        addToast({
          variant: "danger",
          message: data?.error ?? "Не вдалося оформити підписку",
        });
        return;
      }

      addToast({
        variant: "success",
        message: "Дякуємо! Ви підписані ✅",
      });

      form.reset();
      setEmail("");
    } catch {
      addToast({
        variant: "danger",
        message: "Помилка сервера, спробуйте пізніше",
      });
    } finally {
      setLoading(false);
    }
  };

  if (newsletter.display === false) return null;

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />

      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          {newsletter.title}
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          {newsletter.description}
        </Text>
      </Column>

      <form
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        onSubmit={handleSubmit}
      >
        <Row
          id="mc_embed_signup_scroll"
          fillWidth
          maxWidth={24}
          s={{ direction: "column" }}
          gap="8"
        >
          <Input
            formNoValidate
            id="mce-EMAIL"
            name="EMAIL"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Row height="48" vertical="center">
            <Button type="submit" size="m" fillWidth disabled={loading}>
              {loading ? "..." : "Підписка"}
            </Button>
          </Row>
        </Row>
      </form>
    </Column>
  );
};
