import { findExecutablePromptBlocks } from "./detect";
import { addExecutablePromptActions } from "./injector";

export function startExecutablePromptsFeature(): void {
  runPromptBlockScan();

  const scanAgain = () => {
    window.setTimeout(runPromptBlockScan, 150);
  };

  const observer = new MutationObserver(scanAgain);
  observer.observe(document.body, { childList: true, subtree: true });
}

function runPromptBlockScan(): void {
  const blocks = findExecutablePromptBlocks();

  for (const block of blocks) {
    addExecutablePromptActions(block);
  }
}
