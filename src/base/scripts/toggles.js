/**
 * @typedef {import('@shoelace-style/shoelace').SlAlert} SlAlert
 */

// Settings
function ToggleSettings() {
  const settingsUi = typedQuerySelector("#settings", HTMLElement);
  if (settingsUi) {
    const isVisible = settingsUi.style.display === "flex";
    settingsUi.style.display = isVisible ? "none" : "flex";
  }
}

// Detect if there are no tabs
setTimeout(async () => {
  const tabGroup = await getTabGroup();
  const tabClose = tabGroup?.shadowRoot?.querySelector(
    "div > nav > div.tabs > div > span.tab-close"
  );
  const button = tabGroup?.shadowRoot?.querySelector(
    "div > nav > div.buttons > button"
  );
  tabClose?.addEventListener("click", () => ATWC());
  button?.addEventListener("click", () => ATWC());
}, 2000);

async function ATWC() {
  const tabGroup = await getTabGroup();
  const tabs = tabGroup?.shadowRoot?.querySelector("div > nav > div.tabs > *");
  const hasTabs = typeof tabs != "undefined" && tabs != null;

  const noTabsExistPage = typedQuerySelector(".no-tabs-exist", HTMLElement);
  const tabClose = tabGroup?.shadowRoot?.querySelector(
    "div > nav > div.tabs > div > span.tab-close"
  );

  if (noTabsExistPage) {
    noTabsExistPage.style.display = hasTabs ? "none" : "inherit";
  }
  tabClose?.addEventListener("click", () => ATWC());
}

// Alerts
/// Docs: https://shoelace.style/getting-started/usage#methods
/// No Instance
function ShowNoInstance() {
  const noInstanceAlert = getNoInstanceAlert();
  if (noInstanceAlert) {
    noInstanceAlert.show();
  }
}

function HideNoInstance() {
  const noInstanceAlert = getNoInstanceAlert();
  if (noInstanceAlert) {
    noInstanceAlert.hide();
  }
}

function getNoInstanceAlert() {
  // Type guard would require a type import. As a compromise, we use a type guard for a HTMLElement and assume the type as SlAlert.
  return /** @type {SlAlert | null}*/ (
    typedQuerySelector("#noinstance", HTMLElement)
  );
}

setTimeout(() => {
  const instanceField = typedQuerySelector("#InstanceField", HTMLInputElement);
  const isInstanceFieldEmpty = instanceField?.value === "";
  if (isInstanceFieldEmpty) {
    ShowNoInstance();
  }
}, 1000);
