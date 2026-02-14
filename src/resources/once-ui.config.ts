// Import and set font for each variant
import { Geist, Geist_Mono } from "next/font/google";

import type {
  DataStyleConfig,
  DisplayConfig,
  EffectsConfig,
  FontsConfig,
  MailchimpConfig,
  ProtectedRoutesConfig,
  RoutesConfig,
  SameAsConfig,
  SchemaConfig,
  SocialSharingConfig,
  StyleConfig,
} from "@/types";
import { home, person } from "./index";
// const baseURL: string = "https://mariia-maliarchuk.com"; // ← заміни на ваш домен
const baseURL: string = "http://localhost:3000"; // ← заміни на ваш домен

const routes: RoutesConfig = {
  "/": true,
  "/about": true,
  "/work": true, // можна трактувати як "Послуги / Формати"
  "/blog": true,
  "/gallery": true,
};

const display: DisplayConfig = {
  location: true,
  time: true,
  themeSwitcher: true,
};

// У вас немає сторінок, які треба ховати паролем — вимикаємо
const protectedRoutes: ProtectedRoutesConfig = {};

// Fonts: залишаю Geist (нейтрально й читабельно). За бажання — підберемо “тепліші” шрифти окремо.
const heading = Geist({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const label = Geist({
  variable: "--font-label",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts: FontsConfig = {
  heading,
  body,
  label,
  code,
};

// ✅ Тепліший візуал: нейтраль “sand”, бренд “orange/yellow”, акцент “moss” (природа) або “orange”
const style: StyleConfig = {
  theme: "system", // dark | light | system
  neutral: "sand", // sand | gray | slate | custom
  brand: "orange", // теплий “сонячний” настрій
  accent: "moss", // природний відтінок (якщо в темі є moss), або постав 'yellow'/'orange'
  solid: "contrast",
  solidStyle: "flat",
  border: "rounded",
  surface: "translucent",
  transition: "micro",
  scaling: "100",
};

// Charts (якщо вони взагалі не потрібні — можна лишити як є або спростити)
// Роблю м’якше: outline + більш “спокійний” вигляд
const dataStyle: DataStyleConfig = {
  variant: "outline", // flat | gradient | outline
  mode: "sequential", // categorical | divergent | sequential
  height: 24,
  axis: { stroke: "var(--neutral-alpha-weak)" },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

// ✅ Ефекти: теплі “крапки”, легкий градієнт (не агресивний)
const effects: EffectsConfig = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 110,
  },
  gradient: {
    display: true,
    opacity: 45,
    x: 50,
    y: 35,
    width: 85,
    height: 55,
    tilt: 8,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 22,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

// Newsletter: якщо не використовуєте Mailchimp — краще вимкнути/залишити порожнім.
// Якщо використовуєте — вставте реальний action URL
const mailchimp: MailchimpConfig = {
  action: "", // ← вставте реальний Mailchimp action або залиште порожнім
  effects: {
    mask: { cursor: true, x: 50, y: 0, radius: 110 },
    gradient: {
      display: true,
      opacity: 70,
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      tilt: 0,
      colorStart: "accent-background-strong",
      colorEnd: "static-transparent",
    },
    dots: {
      display: true,
      opacity: 18,
      size: "2",
      color: "brand-on-background-weak",
    },
    grid: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      width: "0.25rem",
      height: "0.25rem",
    },
    lines: {
      display: false,
      opacity: 100,
      color: "neutral-alpha-medium",
      size: "16",
      thickness: 1,
      angle: 90,
    },
  },
};

// ✅ SEO/schema під Марію
const schema: SchemaConfig = {
  logo: `${baseURL}/images/avatar.jpg`, // або шлях до вашого логотипу
  type: "Person",
  name: person.name,
  description: home.description,
  email: person.email,
};

// ✅ Соцмережі: якщо поки немає — лишайте пустими або видаліть ключі
const sameAs: SameAsConfig = {
  instagram: "https://www.instagram.com/<username>",
  facebook: "https://www.facebook.com/<page>",
  youtube: "https://www.youtube.com/@<channel>",
  telegram: "https://t.me/<username>",
};

// ✅ Шеринг: під вашу аудиторію корисні Facebook/Telegram/WhatsApp + email/copy
const socialSharing: SocialSharingConfig = {
  display: true,
  platforms: {
    x: false,
    linkedin: false,
    facebook: true,
    pinterest: false,
    whatsapp: true,
    reddit: false,
    telegram: true,
    email: true,
    copyLink: true,
  },
};

export {
  baseURL,
  dataStyle,
  display,
  effects,
  fonts,
  mailchimp,
  protectedRoutes,
  routes,
  sameAs,
  schema,
  socialSharing,
  style,
};
