# MVP 1: Executable Prompt Blocks

## Problem

Long technical ChatGPT conversations often produce reusable prompts intended for another agent, such as Codex or a fresh ChatGPT conversation. Today those prompts are visually indistinguishable from ordinary code blocks and require manual copy/paste.

## Proposed solution

Detect executable prompt blocks rendered by ChatGPT and add contextual actions next to the native code block controls.

Canonical block:

````markdown
```text(prompt)
Review the repository.

Implement the smallest useful change.
Do not touch unrelated files.
```
````

## User-facing behavior

For each detected executable prompt block:

1. Keep ChatGPT's existing code block UI intact.
2. Add a small action group near the native copy/download buttons.
3. Provide:
   - `Run in Codex`
   - `Open in ChatGPT`
4. Never mutate the prompt content.
5. Never auto-submit without explicit user action.

## MVP implementation strategy

### Detection

Use a content script on ChatGPT pages.

Detection rules:

- Scan rendered code blocks.
- Accept language/info strings equivalent to:
  - `text(prompt)`
  - `prompt`
- Extract the block text from the rendered `<code>` element.
- Mark processed blocks with a `data-cgpt-power-tools-*` attribute to avoid duplicate injection.

### DOM observation

ChatGPT renders and updates messages dynamically, so the extension uses `MutationObserver` to rescan incrementally.

The observer should:

- Start after content script load.
- Run an initial scan.
- Debounce subsequent scans.
- Avoid expensive full-tree work where possible.

### Actions

#### Open in new ChatGPT

Open a new ChatGPT conversation with the prompt copied to the clipboard and a small interstitial instruction shown via notification/toast.

Rationale: public URL prefill behavior is not guaranteed. Clipboard-first behavior is less magical but reliable.

#### Run in Codex

For MVP 1, copy the prompt to the clipboard and open Codex entry point if available/configured.

Rationale: Codex product URLs and deep-linking behavior may change. The action is still useful as a one-click handoff, but should be implemented behind a small adapter.

## Suggested module layout

```text
extension/src/
├── content.ts
├── features/
│   └── executable-prompts/
│       ├── actions.ts
│       ├── detect.ts
│       ├── index.ts
│       ├── inject.ts
│       └── types.ts
├── platform/
│   ├── clipboard.ts
│   ├── dom.ts
│   └── links.ts
└── ui/
    └── toast.ts
```

## Acceptance criteria

- A block marked as `text(prompt)` is detected in ChatGPT responses.
- The extension injects exactly one action group per block.
- Actions survive ChatGPT re-rendering without duplicating buttons.
- `Open in ChatGPT` opens a new ChatGPT tab and copies the prompt.
- `Run in Codex` copies the prompt and opens the configured Codex entry point.
- The native ChatGPT copy/download buttons keep working.
- No internal ChatGPT API calls are required.

## Risks

### ChatGPT DOM changes

The rendered DOM is not a public API. Keep selectors broad and defensive.

### Native toolbar placement

The exact location of ChatGPT's code block toolbar can change. Prefer injecting inside the nearest stable code block container, with graceful fallback.

### Codex deep links

Codex URL behavior may change. Keep Codex launch logic isolated in one adapter.

## Deferred work

- Options page for configurable Codex URL.
- Prompt block metadata.
- Prompt history.
- Session forking.
- Prompt library.
- Integration tests against saved ChatGPT DOM fixtures.
