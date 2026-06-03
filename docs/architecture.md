# Architecture

## Approach

ChatGPT Power Tools is a progressive-enhancement browser extension.

The extension should augment the rendered ChatGPT interface using:

- content scripts
- DOM observation
- browser extension APIs
- small UI overlays/buttons

It should avoid replacing the ChatGPT UI or depending on undocumented internal APIs unless there is no reasonable alternative.

## Current MVP architecture

```text
Chrome extension
└── content script
    ├── observes ChatGPT DOM changes
    ├── detects executable prompt blocks
    ├── injects action buttons
    ├── copies prompt text to clipboard
    └── opens target surfaces in new tabs
```

## Extension modules

### `content.ts`

Content script entry point.

Responsibilities:

- initialize features
- avoid duplicate initialization
- keep startup small

### `features/executable-prompts`

Feature module for MVP 1.

Responsibilities:

- detect prompt blocks
- inject actions
- wire user interactions
- avoid duplicate processing

### `platform`

Small wrappers over browser/platform APIs.

Responsibilities:

- clipboard operations
- URL opening
- DOM helpers

### `ui`

Shared UI primitives.

Responsibilities:

- toast notifications
- small injected controls
- CSS class naming conventions

## Selector philosophy

ChatGPT's DOM is not a stable public API. Selectors should be defensive:

- Prefer semantic HTML where available (`pre`, `code`).
- Avoid long brittle selector chains.
- Detect structure by proximity instead of exact ancestry.
- Add extension-owned `data-*` markers after processing.
- Fail silently when the expected container cannot be found.

## Naming convention

Use a project prefix for injected classes and data attributes:

```text
cgpt-power-tools-*
data-cgpt-power-tools-*
```

## Security and privacy

MVP 1 only reads rendered code block text from the current ChatGPT page.

It does not:

- send prompt content to a backend
- call private ChatGPT APIs
- persist prompt content
- auto-submit prompts

## Browser support

Primary target:

- Chrome Manifest V3

Secondary targets:

- Edge
- Brave
- Arc
