import { showToast } from "../../ui/toast";
import { executablePromptActions } from "./actions";
import { findLikelyCodeBlockContainer, PROCESSED_ATTR } from "./detect";
import type { ExecutablePromptBlock } from "./types";

const ACTIONS_CLASS = "cgpt-power-tools-actions";
const BUTTON_CLASS = "cgpt-power-tools-button";

export function addExecutablePromptActions(block: ExecutablePromptBlock): void {
  const container = findLikelyCodeBlockContainer(block.pre);
  const wrapper = document.createElement("span");
  wrapper.className = ACTIONS_CLASS;
  wrapper.setAttribute("data-cgpt-power-tools-actions", "true");

  for (const action of executablePromptActions) {
    const control = document.createElement("button");
    control.type = "button";
    control.className = BUTTON_CLASS;
    control.textContent = action.label;

    control.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      void action.run(block).catch(() => {
        showToast("ChatGPT Power Tools action failed.");
      });
    };

    wrapper.append(control);
  }

  const toolbar = findToolbar(container, block.pre);

  if (toolbar) {
    toolbar.append(wrapper);
  } else {
    container.prepend(wrapper);
  }

  block.pre.setAttribute(PROCESSED_ATTR, "true");
}

function findToolbar(container: HTMLElement, pre: HTMLPreElement): HTMLElement | undefined {
  const nativeButton = Array.from(container.querySelectorAll("button")).find(
    (button) => !button.closest(".cgpt-power-tools-actions"),
  );

  if (nativeButton?.parentElement instanceof HTMLElement) {
    return nativeButton.parentElement;
  }

  if (pre.previousElementSibling instanceof HTMLElement) {
    return pre.previousElementSibling;
  }

  return undefined;
}
