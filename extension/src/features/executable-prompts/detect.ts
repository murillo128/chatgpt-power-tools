import type { ExecutablePromptBlock } from "./types";

const SUPPORTED_LANGUAGES = new Set(["text(prompt)", "prompt"]);
const LANGUAGE_CLASS_PREFIX = "language-";
const MAX_CONTAINER_DEPTH = 6;
const LABEL_SELECTOR = [
  "[data-language]",
  "[aria-label]",
  "[class*='language-']",
  "span",
  "div",
].join(",");

export const PROCESSED_ATTR = "data-cgpt-power-tools-executable-prompt";
export const ACTIONS_ATTR = "data-cgpt-power-tools-actions";

export function findExecutablePromptBlocks(root: ParentNode = document): ExecutablePromptBlock[] {
  const blocks: ExecutablePromptBlock[] = [];

  try {
    const codeElements = root.querySelectorAll<HTMLElement>("pre code");

    for (const code of codeElements) {
      const pre = code.closest("pre");

      if (!(pre instanceof HTMLPreElement)) {
        continue;
      }

      if (isExtensionProcessed(pre)) {
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
  } catch {
    // ChatGPT's DOM is not a public API. If it changes under us while scanning,
    // skip this scan and let the next mutation/initial scan try again.
  }

  return blocks;
}

export function markExecutablePromptBlockProcessed(pre: HTMLPreElement): void {
  pre.setAttribute(PROCESSED_ATTR, "true");
}

export function isExecutablePromptLanguage(language: string): boolean {
  return SUPPORTED_LANGUAGES.has(normalizeLanguageInfo(language));
}

function isExtensionProcessed(pre: HTMLPreElement): boolean {
  return (
    pre.hasAttribute(PROCESSED_ATTR) ||
    Boolean(findLikelyCodeBlockContainer(pre).querySelector(`[${ACTIONS_ATTR}]`))
  );
}

function getCodeLanguage(code: HTMLElement, pre: HTMLPreElement): string {
  const candidates = [
    code.getAttribute("data-language"),
    pre.getAttribute("data-language"),
    extractLanguageFromClassName(code),
    extractLanguageFromClassName(pre),
    findNearbyLanguageLabel(pre),
  ];

  return candidates.find((candidate) => isExecutablePromptLanguage(candidate ?? ""))?.trim() ?? "";
}

function normalizeLanguageInfo(language: string): string {
  return language.trim().toLowerCase();
}

function extractLanguageFromClassName(element: HTMLElement): string | undefined {
  for (const className of element.classList) {
    if (className.startsWith(LANGUAGE_CLASS_PREFIX)) {
      return className.slice(LANGUAGE_CLASS_PREFIX.length);
    }
  }

  return undefined;
}

function findNearbyLanguageLabel(pre: HTMLPreElement): string | undefined {
  const container = findLikelyCodeBlockContainer(pre);
  const labels = collectLikelyLanguageLabels(container, pre);

  return labels.find(isExecutablePromptLanguage);
}

function collectLikelyLanguageLabels(container: HTMLElement, pre: HTMLPreElement): string[] {
  const labels: string[] = [];
  const nearbyElements = [
    pre.previousElementSibling,
    pre.parentElement,
    container,
    ...Array.from(container.querySelectorAll<HTMLElement>(LABEL_SELECTOR)),
  ];

  for (const element of nearbyElements) {
    if (!(element instanceof HTMLElement) || element === pre || pre.contains(element)) {
      continue;
    }

    const dataLanguage = element.getAttribute("data-language");
    if (dataLanguage) {
      labels.push(dataLanguage);
    }

    const classLanguage = extractLanguageFromClassName(element);
    if (classLanguage) {
      labels.push(classLanguage);
    }

    labels.push(...getVisibleElementTextCandidates(element));
  }

  return labels;
}

function getVisibleElementTextCandidates(element: HTMLElement): string[] {
  if (element.hidden || element.getAttribute("aria-hidden") === "true") {
    return [];
  }

  const candidates = [
    element.getAttribute("aria-label"),
    ...Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent),
    element.textContent,
  ];

  return candidates
    .map((text) => text?.trim() ?? "")
    .filter((text) => text.length > 0 && text.length <= 80);
}

export function findLikelyCodeBlockContainer(pre: HTMLPreElement): HTMLElement {
  let current: HTMLElement | null = pre.parentElement;
  let fallback: HTMLElement = pre;
  let depth = 0;

  while (current && depth < MAX_CONTAINER_DEPTH) {
    if (current.matches("article, main, body")) {
      break;
    }

    fallback = current;

    const hasPre = current.querySelector("pre") === pre;
    const hasNativeControls = Boolean(current.querySelector("button"));
    const hasNearbyPromptLabel = collectOwnTextLabels(current).some(isExecutablePromptLanguage);

    if (hasPre && (hasNativeControls || hasNearbyPromptLabel)) {
      return current;
    }

    current = current.parentElement;
    depth += 1;
  }

  return fallback;
}

function collectOwnTextLabels(element: HTMLElement): string[] {
  const labels: string[] = [];

  for (const child of element.children) {
    if (!(child instanceof HTMLElement) || child.matches("pre")) {
      continue;
    }

    labels.push(...getVisibleElementTextCandidates(child));
  }

  const ownText = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent?.trim() ?? "")
    .filter(Boolean);

  labels.push(...ownText);

  return labels;
}
