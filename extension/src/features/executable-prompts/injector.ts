import { showToast } from "../../ui/toast";
import { executablePromptActions } from "./actions";
import {
  ACTIONS_ATTR,
  findLikelyCodeBlockContainer,
  markExecutablePromptBlockProcessed,
} from "./detect";
import type { ExecutablePromptBlock } from "./types";

const ACTIONS_CLASS = "cgpt-power-tools-actions";
const BUTTON_CLASS = "cgpt-power-tools-button";
const FALLBACK_CLASS = "cgpt-power-tools-actions--fallback";

export function addExecutablePromptActions(block: ExecutablePromptBlock): void {
  try {
    const container = findLikelyCodeBlockContainer(block.pre);

    if (container.querySelector(`[${ACTIONS_ATTR}]`)) {
      markExecutablePromptBlockProcessed(block.pre);
      return;
    }

    const wrapper = buildActionGroup(block);
    const toolbar = findToolbar(container, block.pre);

    if (toolbar) {
      toolbar.append(wrapper);
    } else {
      wrapper.classList.add(FALLBACK_CLASS);
      block.pre.before(wrapper);
    }

    markExecutablePromptBlockProcessed(block.pre);
  } catch {
    // Fail silently. ChatGPT can change or replace code block DOM at any time.
  }
}

function buildActionGroup(block: ExecutablePromptBlock): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = ACTIONS_CLASS;
  wrapper.setAttribute(ACTIONS_ATTR, "true");
  wrapper.setAttribute("aria-label", "Executable prompt actions");

  for (const action of executablePromptActions) {
    const control = document.createElement("button");
    control.type = "button";
    control.className = BUTTON_CLASS;
    control.textContent = action.label;
    control.dataset.actionId = action.id;

    control.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      void action.run(block).catch(() => {
        showToast("ChatGPT Power Tools action failed.");
      });
    });

    wrapper.append(control);
  }

  return wrapper;
}

function findToolbar(container: HTMLElement, pre: HTMLPreElement): HTMLElement | undefined {
  const nativeButtons = Array.from(container.querySelectorAll<HTMLButtonElement>("button")).filter(
    (button) => !button.closest(`[${ACTIONS_ATTR}]`) && !pre.contains(button),
  );

  const toolbar = nativeButtons
    .map((button) => button.parentElement)
    .find((parent): parent is HTMLElement => parent instanceof HTMLElement && !parent.matches("pre, code"));

  if (toolbar) {
    return toolbar;
  }

  const previousSibling = pre.previousElementSibling;

  if (previousSibling instanceof HTMLElement && !previousSibling.matches("pre, code")) {
    return previousSibling;
  }

  return undefined;
}
