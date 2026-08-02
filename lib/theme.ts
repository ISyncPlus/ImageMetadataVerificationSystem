export type ThemePreference = "light" | "system" | "dark";

export const THEME_KEY = "imvs-theme";

/**
 * Inlined in the document and run before first paint, so the page never flashes
 * the wrong theme. Kept free of React so the server layout can import it.
 * Sets both `data-theme` (this app's tokens) and the `dark` class (what the
 * shadcn baseline and the view-transition CSS key off).
 */
export const THEME_BOOTSTRAP = `(function(){try{var p=localStorage.getItem("${THEME_KEY}")||"system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.classList.toggle("dark",d);}catch(e){}})();`;

export const resolveTheme = (preference: ThemePreference): "light" | "dark" => {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (preference: ThemePreference) => {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.classList.toggle("dark", resolved === "dark");
};
