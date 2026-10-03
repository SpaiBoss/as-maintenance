import { mailHref, smsHref } from "../lib/contact";
import { buildEstimateMessage } from "../lib/estimate";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const eventNames: Record<string, string> = {
  call: "click_call",
  text: "click_text",
  email: "click_email",
  composer_text: "composer_text",
  composer_email: "composer_email",
  copy_email: "copy_email",
};

function fieldValue(root: ParentNode, name: string) {
  const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `[data-field="${name}"]`,
  );
  return field?.value.trim() ?? "";
}

function composerMessage(root: ParentNode) {
  return buildEstimateMessage({
    job: fieldValue(root, "job"),
    city: fieldValue(root, "city"),
    details: fieldValue(root, "details"),
    name: fieldValue(root, "name"),
  });
}

async function copyText(text: string, selectTarget: Element | null) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (selectTarget) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(selectTarget);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    return false;
  }
}

document.addEventListener("click", async (event) => {
  const raw = event.target;
  const origin = raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
  if (!origin) return;

  const tracked = origin.closest<HTMLElement>("[data-track]");
  if (tracked && typeof window.gtag === "function") {
    const key = tracked.dataset.track ?? "";
    try {
      window.gtag("event", eventNames[key] ?? key, {
        page_path: window.location.pathname,
        placement: tracked.dataset.placement ?? "",
      });
    } catch {
      // Tracking must not block tel, sms, or mailto navigation.
    }
  }

  const emailButton = origin.closest<HTMLButtonElement>("[data-copy-email]");
  if (emailButton) {
    const line = emailButton.closest("[data-email-line]");
    const value = line?.querySelector<HTMLElement>("[data-email-value]");
    const status = line?.querySelector<HTMLElement>("[data-copy-status]");
    const text = value?.textContent?.trim() ?? "";
    const ok = await copyText(text, value ?? null);
    if (status) status.textContent = ok ? "Copied" : "Email selected. Copy it from the selection.";
  }

  const composer = origin.closest<HTMLElement>("[data-composer]");
  if (!composer) return;

  if (origin.closest("[data-composer-copy]")) {
    const message = composerMessage(composer);
    const fallback = composer.querySelector<HTMLElement>("[data-composer-fallback]");
    if (fallback) fallback.textContent = message;
    const status = composer.querySelector<HTMLElement>("[data-composer-status]");
    const ok = await copyText(message, fallback);
    if (fallback) fallback.hidden = ok;
    if (status) status.textContent = ok ? "Copied" : "Message selected. Copy it from the selection.";
  }

  const go = origin.closest<HTMLAnchorElement>("[data-composer-go]");
  if (!go) return;
  event.preventDefault();
  const message = composerMessage(composer);
  const href =
    go.dataset.composerGo === "email" ? mailHref("Estimate request", message) : smsHref(message);
  go.href = href;
  window.location.href = href;
});

for (const composer of document.querySelectorAll<HTMLElement>("[data-composer]")) {
  const sync = () => {
    const message = composerMessage(composer);
    const text = composer.querySelector<HTMLAnchorElement>('[data-composer-go="text"]');
    const email = composer.querySelector<HTMLAnchorElement>('[data-composer-go="email"]');
    if (text) text.href = smsHref(message);
    if (email) email.href = mailHref("Estimate request", message);
  };
  composer.addEventListener("input", sync);
  composer.addEventListener("change", sync);
}
