import { getIncludedElement } from "./dom.js";

const instance = localStorage.getItem("Instance");

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
  const tabGroup = await getIncludedElement("tab-group", "#include-tabs");

  tabGroup?.on("tab-removed", () => {
    ATWC();
  });
  tabGroup?.setDefaultTab(DEFAULT_TAB_OPTIONS);
  tabGroup?.addTab();

  prepareTabReloadButton();
});

window.api.onOpenTab(async (href) => {
  const tabGroup = await getIncludedElement("tab-group", "#include-tabs");

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
  const tabGroup = await getIncludedElement("tab-group", "#include-tabs");

  reloadButton?.addEventListener("click", () => {
    const tab = tabGroup?.getActiveTab();
    tab?.webview.reload();
  });
}

function tabReadyHandler(tab) {
  const webview = tab.webview;
  webview.addEventListener("page-title-updated", () => {
    const newTitle = webview.getTitle();
    tab.setTitle(newTitle);
  });
}
