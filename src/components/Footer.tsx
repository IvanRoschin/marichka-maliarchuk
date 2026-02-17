import { IconButton, Row, SmartLink, Text } from "@once-ui-system/core";

import { phone, phonePretty, social } from "@/resources";

import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        {/* ✅ Номер телефону клієнта */}
        <Text onBackground="neutral-weak">
          📞 <SmartLink href={`tel:+38${phone}`}>{phonePretty}</SmartLink> (Телефон, Viber,
          Telegram)
        </Text>

        <Text onBackground="neutral-weak">
          / Шаблон сайту:{" "}
          <SmartLink href="https://once-ui.com/products/magic-portfolio">
            Once UI (Magic Portfolio)
          </SmartLink>{" "}
          ·{" "}
          <SmartLink href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</SmartLink>
        </Text>

        <Text onBackground="neutral-weak">
          Сайт має виключно інформаційний та некомерційний характер.
        </Text>

        <Row gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
