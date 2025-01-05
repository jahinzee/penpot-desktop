import { getIncludedElement } from "./dom.js";
import { openTab, resetTabs, setDefaultTab } from "./electron-tabs.js";
import {
	SlButton,
	SlInput,
} from "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";

const INSTANCE_STORE_KEY = "Instance";
const INSTANCE_EVENTS = Object.freeze({
	REGISTER: "registerInstance",
	REMOVE: "removeInstance",
});

export async function initInstance() {
	const savedInstance = await registerSavedInstance();

	await setDefaultTab(savedInstance);
	openTab(savedInstance);
	prepareForm();
}

async function prepareForm() {
	const { instanceForm } = await getInstanceSettingsForm();

	instanceForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		saveInstance();
	});
}

async function saveInstance() {
	const { instanceField, instanceSaveButton } = await getInstanceSettingsForm();
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

	if (instanceSaveButton) {
		instanceSaveButton.setAttribute("variant", "success");
		instanceSaveButton.innerText = "Saved!";
		setTimeout(() => {
			instanceSaveButton.removeAttribute("variant");
			instanceSaveButton.innerText = "Save";
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
	const instanceForm = await getIncludedElement(
		"#instance-form",
		"#include-settings",
		HTMLFormElement,
	);
	const instanceField = await getIncludedElement(
		"#instance-field",
		"#include-settings",
		SlInput,
	);
	const instanceSaveButton = await getIncludedElement(
		"#instance-save",
		"#include-settings",
		SlButton,
	);

	return { instanceForm, instanceField, instanceSaveButton };
}
