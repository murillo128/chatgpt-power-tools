# ChatGPT Power Tools Extension

This directory contains the Chrome extension for MVP 1: executable prompt blocks in rendered ChatGPT Markdown.

## Build

From the repository root:

```sh
npm install
npm run typecheck
npm run build
```

The production extension is emitted to `extension/dist/`. Vite copies static files from `extension/public/`, so the built extension should include:

- `extension/dist/manifest.json`
- `extension/dist/content.css`
- `extension/dist/content.js`

## Load locally in Chrome

1. Build the extension with `npm run build`.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the `extension/dist` directory from this repository.
6. Open or reload `https://chatgpt.com/`.

## Manual test block

Ask ChatGPT to render this Markdown, or paste it into a Markdown-rendered response fixture:

````markdown
```text(prompt)
Review the current repository.
Run the available typecheck and build commands.
Fix only MVP 1 Chrome extension issues.
```
````

Expected result: the rendered code block gets exactly one `Run in Codex` button and one `Open in ChatGPT` button near the native code block controls. Clicking either button copies the prompt text exactly and opens the target page in a new tab. The extension must not auto-submit the prompt.
