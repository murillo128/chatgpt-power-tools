# ChatGPT Power Tools

Chrome extension power tools for heavy ChatGPT users.

The project enhances the existing ChatGPT web UI instead of replacing it. The first MVP focuses on executable prompt blocks: Markdown code blocks that can be copied, opened in a new ChatGPT conversation, or prepared for execution in Codex.

```text(prompt)
Review this repository.

Implement the smallest useful MVP.
Do not modify unrelated files.
```

## MVP 1: Executable Prompt Blocks

### Goals

- Detect rendered Markdown code blocks with language/info string `text(prompt)`.
- Add actions next to ChatGPT's native code block buttons:
  - `Run in Codex`
  - `Open in new ChatGPT`
- Keep the implementation independent from undocumented ChatGPT APIs where possible.
- Use progressive enhancement via content scripts and DOM observation.

### Non-goals for MVP 1

- Replacing ChatGPT's UI.
- Calling private ChatGPT conversation APIs.
- Building a full prompt library.
- Implementing semantic search or session forking.

## Repository layout

```text
.
├── docs/                  # Product and architecture documentation
├── extension/             # Chrome extension source
├── skills/                # ChatGPT instruction snippets for generating executable prompt blocks
├── README.md
└── package.json
```

## Development

```bash
npm install
npm run typecheck
npm run build
```

Then load the unpacked extension from:

```text
extension/dist
```

## Documentation

- [MVP 1 scope](docs/mvp-1-executable-prompt-blocks.md)
- [Architecture](docs/architecture.md)
- [Prompt block protocol](docs/prompt-block-protocol.md)
- [ChatGPT instructions](skills/chatgpt-executable-prompts.md)

## Design principles

- Solve real problems from long-running ChatGPT usage.
- Prefer DOM observation, browser APIs, and public surfaces.
- Minimize reliance on undocumented APIs.
- Keep protocols human-readable and copyable.
- Build the smallest useful feature first.
