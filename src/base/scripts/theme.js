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

  prepareForm(themeId);
});

/**
 * @param {ThemeId | null} themeId
 */
async function prepareForm(themeId) {
  const { themeSelect } = await getThemeSettingsForm();

  if (themeSelect && themeId) {
    themeSelect.value = themeId;
  }

  themeSelect?.addEventListener("change", (event) => {
    const { target } = event;
    const value = target instanceof HTMLSelectElement && target.value;

    if (isThemeId(value)) {
      setTheme(value);
    }
  });
}

/**
 * @param {ThemeId} themeId
 */
function setTheme(themeId) {
  localStorage.setItem(THEME_STORE_KEY, themeId);
  window.api.setTheme(themeId);
}

async function getThemeSettingsForm() {
  const themeSelect = await getIncludedElement(
    "#theme-select",
    "#include-settings",
    HTMLSelectElement
  );

  return { themeSelect };
}

/**
 *
 * @param {unknown} value
 * @returns {value is ThemeId}
 */
function isThemeId(value) {
  return (
    typeof value === "string" && ["light", "dark", "system"].includes(value)
  );
}
