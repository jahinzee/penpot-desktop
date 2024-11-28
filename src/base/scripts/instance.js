function InstanceSave() {
  // If save button is clicked
  const instanceField = typedQuerySelector("input#InstanceField", HTMLInputElement)

  if (instanceField) {
    const instance = instanceField.value || "";
    localStorage.setItem("Instance", instance);
  }

  const instanceSaveButton = typedQuerySelector("#InstanceSaveButton", HTMLInputElement)
  if (instanceSaveButton) {
    instanceSaveButton.style.backgroundColor = "#00ff89";
    instanceSaveButton.setAttribute("value", "Saved!");
    setTimeout(() => {
      instanceSaveButton.style.backgroundColor = "#575151";
      instanceSaveButton.setAttribute("value", "Save");
    }, 1200);
  }
}

function InstanceGet() {
  // Runs on start
  const InstanceStore = localStorage.getItem("Instance");

  if (InstanceStore) {
    window.api.send("registerInstance", InstanceStore);
    setTimeout(() => {
      const instanceField = typedQuerySelector("input#InstanceField", HTMLInputElement)

      if (instanceField) {
        instanceField.value = InstanceStore;
      }
    }, 0o500);
  }
}

if (!localStorage.getItem("firstTime")) {
  localStorage.setItem("Instance", "https://design.penpot.app/"); // If not set, by default on first launch, the app will be blank (to fix issue #3)
  localStorage.setItem("firstTime", "true");
  // setTimeout(() => {welcome()}, 2500)
} else {
}

setTimeout(() => {
  const instanceField = typedQuerySelector("input#InstanceField", HTMLInputElement)

  if (instanceField) {
    instanceField.value = localStorage.getItem("Instance") || "";
  }
}, 0o500);

setTimeout(async () => {
  const tabGroup = await getTabGroup();
  const webview = /** @type {import("electron").WebviewTag | null} */ (
    tabGroup?.shadowRoot?.querySelector("div > div > webview")
  );
  const nav = typedQuerySelector("div > nav", HTMLElement, tabGroup?.shadowRoot)
  if (webview?.src === "") {
    webview.style.opacity = "0";
    if (nav) {
      nav.style.opacity = "0";
    }

    console.log("You need to set an instance.");

    const titlebarButton = typedQuerySelector("body > titlebar > div.actions > div > button:nth-child(2)", HTMLButtonElement);
    const tdmWarnings = typedQuerySelector(".tdm-warnings", HTMLElement);
    
    if (titlebarButton) {
      titlebarButton?.click();
    }
    
    if (tdmWarnings) {
      tdmWarnings.style.display = "inherit";
    }
  } else {
    console.log("An instance is set.");
  }
}, 1500);
