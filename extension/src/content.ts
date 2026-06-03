import { startExecutablePromptsFeature } from "./features/executable-prompts";

const ROOT_MARKER = "data-cgpt-power-tools-content-script";

function boot(): void {
  if (document.documentElement.hasAttribute(ROOT_MARKER)) {
    return;
  }

  document.documentElement.setAttribute(ROOT_MARKER, "true");
  startWhenBodyIsReady();
}

function startWhenBodyIsReady(): void {
  if (document.body) {
    startExecutablePromptsFeature();
    return;
  }

  window.setTimeout(startWhenBodyIsReady, 50);
}

try {
  boot();
} catch {
  // Content scripts should never break ChatGPT if the host DOM changes.
}
