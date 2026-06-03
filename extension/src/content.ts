import { startExecutablePromptsFeature } from "./features/executable-prompts";

const ROOT_MARKER = "data-cgpt-power-tools-content-script";

function boot(): void {
  if (document.documentElement.hasAttribute(ROOT_MARKER)) {
    return;
  }

  document.documentElement.setAttribute(ROOT_MARKER, "true");
  startExecutablePromptsFeature();
}

boot();
