# Prompt Block Protocol

## Purpose

Executable prompt blocks provide a simple, human-readable way for one AI agent to generate instructions intended for another agent or a future session.

The protocol is intentionally Markdown-based so it remains:

- readable
- copyable
- robust across tools
- easy for browser extensions to detect

## Canonical format

````markdown
```text(prompt)
Review the repository.

Implement the requested change.
Do not modify unrelated files.
```
````

## Detection

The extension should treat a code block as executable when its language/info string is one of:

```text
text(prompt)
prompt
```

`text(prompt)` is preferred because it remains valid-looking Markdown while carrying extra intent.

## Content rules

Inside the block:

- Write the final prompt exactly as it should be sent.
- Avoid commentary outside the target task.
- Include repository, branch, scope, constraints, and acceptance criteria when relevant.
- Include explicit non-goals to prevent overreach.

## Nested Markdown rule

When returning raw Markdown that itself contains fenced code blocks, wrap the outer Markdown block with a fence longer than any inner fence.

Example:

`````markdown
````markdown
# Example

```ts
console.log("inner code block");
```
````
`````

This keeps ChatGPT rendering from prematurely closing the outer block.

## Future metadata

Not part of MVP 1, but possible future variants:

````markdown
```text(prompt codex repo="murillo128/chatgpt-power-tools")
...
```
````

Metadata should not be required for basic behavior.
