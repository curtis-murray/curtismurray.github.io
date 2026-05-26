// Theme toggle via event delegation, wired once. Any element with
// [data-theme-toggle] anywhere on the page flips the theme — so the mobile
// Header button and the desktop StoryNav button both work without duplicate IDs.
// Drives the DaisyUI [data-theme] token set + the legacy `dark` class together,
// persisting to localStorage key "theme" ("light"/"dark"). The no-flash
// bootstrap in Layout.astro sets the initial value before paint; icon
// visibility is handled in pure CSS off [data-theme] (see global.css), so there
// is nothing to sync here.
export function themeToggler() {
  if (typeof window === "undefined" || window.__themeWired) return;
  window.__themeWired = true;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-theme-toggle]");
    if (!btn) return;
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    root.dataset.theme = dark ? "catppuccin" : "autumn-day";
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
}
