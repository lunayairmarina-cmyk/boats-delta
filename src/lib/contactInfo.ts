"use client";

import type { MouseEvent } from "react";

const COUNTRY_CODE = "966";
const LOCAL_NUMBER = "534457744";

export const CONTACT_PHONE_DISPLAY = "0534457744";
export const CONTACT_EMAIL = "cap.harbi@boatpro.club";
export const CONTACT_WHATSAPP_MESSAGE =
  "Hello Lunier Marina, I'd like to connect.";

const PHONE_E164 = `+${COUNTRY_CODE}${LOCAL_NUMBER}`;
const PHONE_WHATSAPP = `${COUNTRY_CODE}${LOCAL_NUMBER}`;

export const getPhoneHref = () => `tel:${PHONE_E164}`;

export const getWhatsAppHref = (message = CONTACT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;

export const getMailHref = () => `mailto:${CONTACT_EMAIL}`;

const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Mobi/i.test(
    navigator.userAgent
  );

type PhoneIntentOptions = {
  message?: string;
};

export const handlePhoneIntent = (
  event?: MouseEvent<HTMLAnchorElement>,
  options?: PhoneIntentOptions
) => {
  event?.preventDefault();
  if (typeof window === "undefined") return;

  if (isMobileDevice()) {
    window.location.href = getPhoneHref();
    return;
  }

  window.open(
    getWhatsAppHref(options?.message),
    "_blank",
    "noopener,noreferrer"
  );
};























