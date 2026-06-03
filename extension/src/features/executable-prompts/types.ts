export type ExecutablePromptBlock = {
  pre: HTMLPreElement;
  code: HTMLElement;
  prompt: string;
  language: string;
};

export type ExecutablePromptAction = {
  id: string;
  label: string;
  run: (block: ExecutablePromptBlock) => Promise<void>;
};
