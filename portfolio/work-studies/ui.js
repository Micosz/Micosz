export const safe = globalThis.esc;
export const option = (value, label) => `<option value="${safe(value)}">${safe(label)}</option>`;
export function buttons(container, selected) {
  for (const button of container.querySelectorAll('button[data-value]')) {
    button.setAttribute('aria-pressed', String(button.dataset.value === String(selected)));
  }
}
// Keep the same button reachable after a filtered list or task row is redrawn.
export function updateList(host, html) {
  const active = host.contains(document.activeElement) ? document.activeElement.dataset.key : null;
  host.innerHTML = html;
  if (active) {
    const next = Array.from(host.querySelectorAll('[data-key]')).find(el => el.dataset.key === active);
    (next || host.querySelector('button'))?.focus({preventScroll:true});
  }
}
