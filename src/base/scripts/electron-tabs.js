/**
 * @typedef {import("electron-tabs").TabGroup} TabGroup
 * @typedef {import("electron-tabs").Tab} Tab
 * @typedef {import("electron").WebviewTag} WebviewTag
 */

const instance = localStorage.getItem("Instance") || undefined;

const PRELOAD_PATH = "./scripts/webviews/preload.js";
const DEFAULT_TAB_OPTIONS = Object.freeze({
  src: instance,
  active: true,
  webviewAttributes: {
    preload: PRELOAD_PATH,
    allowpopups: true,
  },
  ready: tabReadyHandler,
});

window.addEventListener("DOMContentLoaded", async () => {
  const tabGroup = await getTabGroup();

  tabGroup?.on("tab-removed", () => {
    ATWC();
  });
  tabGroup?.setDefaultTab(DEFAULT_TAB_OPTIONS);
  tabGroup?.addTab();

  prepareTabReloadButton();
});

window.api.onOpenTab(async (href) => {
  const tabGroup = await getTabGroup();

  tabGroup?.addTab({
    ...DEFAULT_TAB_OPTIONS,
    src: href,
  });
});

async function prepareTabReloadButton() {
  const reloadButton = await getIncludedElement(
    "#reload-tab",
    "#include-controls"
  );
  const tabGroup = await getTabGroup();

  reloadButton?.addEventListener("click", () => {
    const tab = tabGroup?.getActiveTab();
    /** @type {WebviewTag} */ (tab?.webview).reload();
  });
}

/**
 * @param {Tab} tab
 */
function tabReadyHandler(tab) {
  const webview = /** @type {WebviewTag} */ (tab.webview);
  webview.addEventListener("page-title-updated", () => {
    const newTitle = webview.getTitle();
    tab.setTitle(newTitle);
  });
}

async function getTabGroup() {
  return /** @type {TabGroup | null} */ (
    await getIncludedElement("tab-group", "#include-tabs")
  );
}
