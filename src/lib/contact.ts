import { site } from "../config/site";

export const telHref = `tel:${site.phoneE164}`;

export const defaultSmsBody = "Hi A&S Maintenance, I need an estimate for: ";

export const callLabel = `Call ${site.phoneDisplay}`;

export const smsHref = (body = "") =>
  `sms:${site.phoneE164}${body ? `?&body=${encodeURIComponent(body)}` : ""}`;
// "?&body=" is the form that works on both iOS and Android

export const mailHref = (subject = "Estimate request", body = "") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");
