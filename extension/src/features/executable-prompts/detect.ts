import type { ExecutablePromptBlock } from "./types";

const SUPPORTED_LANGUAGES = new Set(["text(prompt)", "prompt"]);

export const PROCESSED_ATTR = "data-cgpt-power-tools-executable-prompt";

export function findExecutablePromptBlocks(root: ParentNode = document): ExecutablePromptBlock[] {
  const blocks: ExecutablePromptBlock[] = [];
  const codeElements = root.querySelectorAll<HTMLElement>("pre code");

  for (const code of codeElements) {
    const pre = code.closest("pre");

    if (!(pre instanceof HTMLPreElement)) {
      continue;
    }

    if (pre.hasAttribute(PROCESSED_ATTR)) {
      continue;
    }

    const language = getCodeLanguage(code, pre);

    if (!isExecutablePromptLanguage(language)) {
      continue;
    }

    const prompt = code.textContent ?? "";

    if (!prompt.trim()) {
      continue;
    }

    blocks.push({ pre, code, prompt, language });
  }

  return blocks;
}

function isExecutablePromptLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.has(language.trim().toLowerCase());
}

function getCodeLanguage(code: HTMLElement, pre: HTMLPreElement): string {
  const candidates = [
    code.getAttribute("data-language"),
    pre.getAttribute("data-language"),
    extractLanguageFromClassName(code.className),
    extractLanguageFromClassName(pre.className),
    findNearbyLanguageLabel(pre),
  ];

  return candidates.find((candidate) => candidate?.trim())?.trim() ?? "";
}

function extractLanguageFromClassName(className: string): string | undefined {
  const match = className.match(/(?:^|\\s)language-([^\\s]+)/);
  return match?.[1];
}

function findNearbyLanguageLabel(pre: HTMLPreElement): string | undefined {
  const container = findLikelyCodeBlockContainer(pre);

  if (!container) {
    return undefined;
  }

  const labels = Array.from(container.querySelectorAll<HTMLElement>("span, div"))
    .map((element) => element.textContent?.trim() ?? "")
    .filter(Boolean);

  return labels.find((label) => isExecutablePromptLanguage(label));
}

export function findLikelyCodeBlockContainer(pre: HTMLPreElement): HTMLElement {
  return (
    pre.closest("[data-testid]") ??
    pre.closest("div") ??
    pre
  ) as HTMLElement;
}
