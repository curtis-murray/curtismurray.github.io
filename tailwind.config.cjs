/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', "ui-sans-serif", "system-ui", "sans-serif"],
        slab: ['"Roboto Slab"', "ui-serif", "Georgia", "serif"],
      },
      colors: {
        // ── Dark mode = Catppuccin Mocha ──────────────────────────────
        "dark-primary": "#1e1e2e", // base — card / panel surface
        "dark-mobile-primary": "#181825", // mantle
        "dark-bg": "#181825", // mantle
        "dark-bg-two": "#313244", // surface0
        "dark-bg-three": "#45475a", // surface1
        "dark-border": "#313244", // surface0
        "dark-borde-secondary": "#45475a", // surface1
        "dark-border-two": "#45475a", // surface1
        "dark-text": "#cdd6f4", // text
        "main-text": "#a6adc8", // subtext0 (dark-mode body copy)
        "dark-focus-border": "#cba6f7", // mauve
        // ── Light mode = "autumn day" ─────────────────────────────────
        "text-primary": "#1f3611", // base-content — dark forest green
        "light-title": "#1f3611",
        "light-text": "#5c5238", // muted olive-brown (secondary text)
        "light-bg": "#f3e3d7", // base-200 pale peach
        "light-bg-secondary": "#f6e6d8",
        "light-bg-three": "#f7e3d5",
        "light-bg-four": "#efe0cf",
        "light-bg-five": "#f3e3d7",
        "light-bg-six": "#eaddc9",
        "light-border": "#d9d4d8", // base-300
        "light-border-two": "#e6d8cb",
        "light-icon": "#bb2034", // accent burgundy
        "modal-text": "#bb2034",
        // brand gradient: burnt orange → burgundy
        "btn-primary": "#c98133", // primary burnt orange (also link text)
        "btn-secondary": "#b35a36", // muted terracotta — calmer gradient end
        "btn-test": "rgb(201 129 51 / 0)",
        "gradient-to": "#b35a36",
        // focus-area accents
        "focus-border-one": "rgb(201,129,51)",
        "focus-text-one": "#c98133",
        "focus-border-two": "#bb2034",
        // icon accents (autumn spread)
        "icon-color-one": "#bb2034", // burgundy
        "icon-color-two": "#969f83", // sage
        "icon-color-three": "#d17204", // bright orange
        "icon-color-four": "#938a5d", // olive
        // skill / focus card tints
        "skill-bg-one": "#f7ece0",
        "skill-bg-two": "#f9efdd",
        "skill-bg-three": "#f7e8dd",
        "skill-bg-four": "#f6e6d8",
        "skill-bg-five": "#eef0e2",
        // progress bars
        "progress-bg-one": "#c98133",
        "progress-bg-two": "#969f83",
        "progress-bg-three": "#d17204",
        "progress-bg-four": "#bb2034",
        // education / experience cards
        "edu-card-one": "#f7e8dd",
        "edu-card-two": "#f6e6d8",
        "exp-card-one": "#eef0e2",
        "exp-card-two": "#f0e9da",
        // social brand colors (unchanged)
        "fb-icon": "#1773EA",
        "twitter-icon": "#1C9CEA",
        "dribble-icon": "#e14a84",
        "linkedin-icon": "#0072b1",
      },
      backgroundImage: {
        "bg-gradient-to-r":
          "linear-gradient(to right, var(--tw-gradient-stops))",
        "home-bg": "url('/src/images/light-bg.jpg')",
        "close-light": "url('/src/images/close-light.jpg')",
        "home-bg-dark": "url('/src/images/dark-bg.jpg')",
        "close-dark": "url('/src/images/close-dark.png')",
      },
    },
  },
  plugins: [require("daisyui")],
  darkMode: "class",
  daisyui: {
    // base:false — don't let DaisyUI paint :root background/color. The site's
    // backdrop is the fixed MountainScene; the body stays transparent so the
    // mountains show through. This also keeps legacy pages untouched during the
    // page-by-page migration off the old `dark:`-class color map above.
    base: false,
    styled: true,
    utilities: true,
    logs: false,
    darkTheme: "catppuccin",
    themes: [
      {
        // ── Light: "autumn day" — warm fall-afternoon palette (Curtis's OKLCH table) ──
        "autumn-day": {
          "color-scheme": "light",
          primary: "#c98133", // burnt orange
          "primary-content": "#fae0ca", // cream
          secondary: "#d8b2a8", // muted rose
          "secondary-content": "#1f3611", // dark forest green
          accent: "#bb2034", // rich burgundy
          "accent-content": "#fae0ca", // cream
          neutral: "#938a5d", // olive-brown
          "neutral-content": "#fae0ca", // cream (legible on olive)
          "base-100": "#fae0ca", // lightest cream — page background
          "base-200": "#f3e3d7", // pale peach — raised surfaces
          "base-300": "#d9d4d8", // soft gray-lavender — borders/deepest
          "base-content": "#1f3611", // dark forest green — body text
          info: "#969f83", // sage
          "info-content": "#1f3611",
          success: "#474c32", // dark olive
          "success-content": "#fae0ca",
          warning: "#d17204", // bright orange
          "warning-content": "#fae0ca",
          error: "#7a1825", // deep burgundy
          "error-content": "#fae0ca",
          "--rounded-box": "0.9rem",
          "--rounded-btn": "0.6rem",
        },
      },
      {
        // ── Dark: Catppuccin Mocha ──
        catppuccin: {
          "color-scheme": "dark",
          primary: "#cba6f7", // mauve
          "primary-content": "#1e1e2e",
          secondary: "#f5c2e7", // pink
          "secondary-content": "#1e1e2e",
          accent: "#fab387", // peach (keeps the warm brand echo)
          "accent-content": "#1e1e2e",
          neutral: "#313244", // surface0
          "neutral-content": "#cdd6f4",
          "base-100": "#1e1e2e", // base — page background
          "base-200": "#181825", // mantle — raised surfaces
          "base-300": "#11111b", // crust — borders/deepest
          "base-content": "#cdd6f4", // text
          info: "#89b4fa", // blue
          "info-content": "#1e1e2e",
          success: "#a6e3a1", // green
          "success-content": "#1e1e2e",
          warning: "#f9e2af", // yellow
          "warning-content": "#1e1e2e",
          error: "#f38ba8", // red
          "error-content": "#1e1e2e",
          "--rounded-box": "0.9rem",
          "--rounded-btn": "0.6rem",
        },
      },
    ],
  },
};
