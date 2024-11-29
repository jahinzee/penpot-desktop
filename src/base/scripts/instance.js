const INSTANCE_STORE_KEY = "Instance";
const INSTANCE_EVENTS = Object.freeze({
  REGISTER: "registerInstance",
  REMOVE: "removeInstance",
});

window.addEventListener("DOMContentLoaded", async () => {
  const savedInstance = await registerSavedInstance();

  await setDefaultTab(savedInstance);
  openTab(savedInstance);
  prepareSaveButton();
});

async function prepareSaveButton() {
  const { instanceSaveButton } = await getInstanceSettingsForm();

  instanceSaveButton?.addEventListener("click", (event) => {
    const target = event.target;
    const element = target instanceof HTMLElement ? target : null;
    saveInstance(element);
  });
}

/**
 * @param {HTMLElement | null} trigger
 */
async function saveInstance(trigger) {
  const isInputButton = trigger instanceof HTMLInputElement;
  const { instanceField } = await getInstanceSettingsForm();
  const instance = instanceField?.value;

  if (instance) {
    localStorage.setItem(INSTANCE_STORE_KEY, instance);
    window.api.send(INSTANCE_EVENTS.REGISTER, instance);
    await setDefaultTab(instance);
  } else {
    const savedInstance = localStorage.getItem(INSTANCE_STORE_KEY);
    
    if (savedInstance) {
      window.api.send(INSTANCE_EVENTS.REMOVE, savedInstance);
    }
    
    localStorage.removeItem(INSTANCE_STORE_KEY);
    await setDefaultTab();
  }

  resetTabs();

  if (isInputButton) {
    trigger.style.backgroundColor = "#00ff89";
    trigger.setAttribute("value", "Saved!");
    setTimeout(() => {
      trigger.style.backgroundColor = "#575151";
      trigger.setAttribute("value", "Save");
    }, 1200);
  }
}

async function registerSavedInstance() {
  const savedInstance = localStorage.getItem(INSTANCE_STORE_KEY);

  if (savedInstance) {
    const { instanceField } = await getInstanceSettingsForm();

    window.api.send(INSTANCE_EVENTS.REGISTER, savedInstance);

    if (instanceField) {
      instanceField.value = savedInstance;
    }

    return savedInstance;
  }
}

async function getInstanceSettingsForm() {
  const instanceField = await getIncludedElement(
    "#instance-field",
    "#include-settings",
    HTMLInputElement
  );
  const instanceSaveButton = await getIncludedElement(
    "#instance-save",
    "#include-settings",
    HTMLInputElement
  );

  return { instanceField, instanceSaveButton };
}
