import { getIncludedElement } from "./dom.js";
import { openTab, resetTabs, setDefaultTab } from "./electron-tabs.js";
import {
	SlButton,
	SlInput,
} from "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";

const INSTANCE_EVENTS = Object.freeze({
	REGISTER: "registerInstance",
	REMOVE: "removeInstance",
});

export async function initInstance() {
	const instances = await window.api.getInstances();
	const { origin } = instances[0] || {};

	await setDefaultTab(origin);
	openTab(origin);
	prepareForm(origin);
}

/**
 * @param {string =} origin
 */
async function prepareForm(origin) {
	const { instanceForm, instanceField } = await getInstanceSettingsForm();

	instanceForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		saveInstance();
	});

	if (instanceField && origin) {
		instanceField.value = origin;
	}
}

async function saveInstance() {
	const { instanceField, instanceSaveButton } = await getInstanceSettingsForm();
	const instance = instanceField?.value;

	if (instance) {
		window.api.send(INSTANCE_EVENTS.REGISTER, instance);
		await setDefaultTab(instance);
	} else {
		window.api.send(INSTANCE_EVENTS.REMOVE);
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
