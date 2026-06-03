export const CHATGPT_NEW_CONVERSATION_URL = "https://chatgpt.com/";
export const CODEX_ENTRY_URL = "https://chatgpt.com/codex/";

export function openUrlInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
