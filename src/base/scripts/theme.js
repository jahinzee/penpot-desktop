/**
 * @typedef {Parameters<typeof window.api.setTheme>[0]} ThemeId
 */

const THEME_STORE_KEY = "theme";

window.addEventListener("DOMContentLoaded", () => {
  const themeId = /** @type {ThemeId | null} */ (
    localStorage.getItem(THEME_STORE_KEY)
  );

  if (themeId) {
    setTheme(themeId);
  }

  prepareForm();
});

async function prepareForm() {
  const { themeSelectLight, themeSelectDark } = await getThemeSettingsForm();

  themeSelectLight?.addEventListener("click", () => setTheme("light"));
  themeSelectDark?.addEventListener("click", () => setTheme("dark"));
}

/**
 * @param {ThemeId} themeId
 */
function setTheme(themeId) {
  localStorage.setItem(THEME_STORE_KEY, themeId);
  window.api.setTheme(themeId);
}

async function getThemeSettingsForm() {
  const themeSelectLight = await getIncludedElement(
    "#theme-select-light",
    "#include-settings",
    HTMLButtonElement
  );
  const themeSelectDark = await getIncludedElement(
    "#theme-select-dark",
    "#include-settings",
    HTMLButtonElement
  );

  return { themeSelectLight, themeSelectDark };
}
