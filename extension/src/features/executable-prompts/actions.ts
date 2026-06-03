import { writeTextToClipboard } from "../../platform/clipboard";
import { CHATGPT_NEW_CONVERSATION_URL, CODEX_ENTRY_URL, openUrlInNewTab } from "../../platform/links";
import { showToast } from "../../ui/toast";
import type { ExecutablePromptAction } from "./types";

export const executablePromptActions: ExecutablePromptAction[] = [
  {
    id: "run-in-codex",
    label: "Run in Codex",
    run: async (block) => {
      await writeTextToClipboard(block.prompt);
      openUrlInNewTab(CODEX_ENTRY_URL);
      showToast("Prompt copied. Paste it into Codex to run it.");
    },
  },
  {
    id: "open-in-chatgpt",
    label: "Open in ChatGPT",
    run: async (block) => {
      await writeTextToClipboard(block.prompt);
      openUrlInNewTab(CHATGPT_NEW_CONVERSATION_URL);
      showToast("Prompt copied. Paste it into the new ChatGPT conversation.");
    },
  },
];
