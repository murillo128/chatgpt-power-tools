# ChatGPT Instructions: Executable Prompts

Use these instructions in ChatGPT custom instructions or project instructions when you want generated handoff prompts to be detected by ChatGPT Power Tools.

## Minimal instruction

When generating reusable prompts for another AI agent, always place the final prompt inside:

````markdown
```text(prompt)
...
```
````

Keep explanations outside the block.

When returning raw Markdown/code-as-text with nested fenced code blocks, use a longer outer backtick fence than any fence inside. Preserve inner fenced blocks unchanged.

## Recommended behavior

A good executable prompt should include:

- target repository or project
- task objective
- relevant context
- files or areas to inspect
- implementation constraints
- acceptance criteria
- explicit non-goals

Avoid vague prompts such as:

````markdown
```text(prompt)
Improve this.
```
````

Prefer specific prompts such as:

````markdown
```text(prompt)
You are working in the `murillo128/chatgpt-power-tools` repository.

Implement MVP 1 for executable prompt blocks.

Scope:
- Detect rendered Markdown code blocks with info string `text(prompt)`.
- Inject `Run in Codex` and `Open in ChatGPT` actions near the native code block buttons.
- Do not call undocumented ChatGPT APIs.
- Keep the implementation modular.

Acceptance criteria:
- One action group is injected per prompt block.
- Prompt text is copied exactly as rendered.
- Re-rendering does not duplicate buttons.
- The extension builds successfully.
```
````
