import { findExecutablePromptBlocks } from "./detect";
import { addExecutablePromptActions } from "./injector";

const SCAN_DELAY_MS = 150;

let scanTimer: number | undefined;

export function startExecutablePromptsFeature(): void {
  runPromptBlockScan();

  const observer = new MutationObserver(schedulePromptBlockScan);
  observer.observe(document.body, { childList: true, subtree: true });
}

function schedulePromptBlockScan(): void {
  if (scanTimer !== undefined) {
    window.clearTimeout(scanTimer);
  }

  scanTimer = window.setTimeout(() => {
    scanTimer = undefined;
    runPromptBlockScan();
  }, SCAN_DELAY_MS);
}

function runPromptBlockScan(): void {
  const blocks = findExecutablePromptBlocks();

  for (const block of blocks) {
    addExecutablePromptActions(block);
  }
}
