const TOAST_CLASS = "cgpt-power-tools-toast";
const DEFAULT_DURATION_MS = 3200;

let currentToast: HTMLElement | undefined;
let timeoutId: number | undefined;

export function showToast(message: string, durationMs = DEFAULT_DURATION_MS): void {
  currentToast?.remove();

  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId);
  }

  const toast = document.createElement("div");
  toast.className = TOAST_CLASS;
  toast.textContent = message;
  toast.setAttribute("role", "status");

  document.body.append(toast);
  currentToast = toast;

  timeoutId = window.setTimeout(() => {
    toast.remove();

    if (currentToast === toast) {
      currentToast = undefined;
    }
  }, durationMs);
}
