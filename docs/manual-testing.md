# Manual Testing

## MVP 1 executable prompt blocks

1. From the repository root, run:

   ```sh
   npm install
   npm run typecheck
   npm run build
   ```

2. Load `extension/dist` as an unpacked Chrome extension.
3. Open or reload `https://chatgpt.com/`.
4. Ask ChatGPT to render this Markdown:

   ````markdown
   ```text(prompt)
   Review the current repository.
   Run the available typecheck and build commands.
   Fix only MVP 1 Chrome extension issues.
   ```
   ````

5. Verify the rendered prompt code block shows exactly one action group with:
   - `Run in Codex`
   - `Open in ChatGPT`
6. Verify streaming, regenerating, or editing the message does not duplicate the action group.
7. Verify ChatGPT's native code block copy/download controls still respond normally.
8. Click each extension action and verify:
   - the prompt text is copied exactly
   - a new tab opens to the expected product surface
   - the prompt is not auto-submitted
