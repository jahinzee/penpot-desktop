import { getIncludedElement, typedQuerySelector } from "./dom.js";
import { openTab, setDefaultTab } from "./electron-tabs.js";
import {
	SlButton,
	SlColorPicker,
} from "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";
import { isNonNull } from "../../tools/value.js";
import { isParentNode } from "../../tools/element.js";

/**
 * @typedef {Awaited<ReturnType<typeof window.api.getSetting<"instances">>>} Instances
 */

export const DEFAULT_INSTANCE = Object.freeze({
	id: crypto.randomUUID(),
	origin: "https://design.penpot.app",
	label: "Official",
	color: "#48c393",
	isDefault: false,
});
const INSTANCE_EVENTS = Object.freeze({
	REGISTER: "registerInstance",
	REMOVE: "removeInstance",
});

export async function initInstance() {
	const instances = await window.api.getSetting("instances");

	const { origin, color } =
		instances.find(({ isDefault }) => isDefault) ||
		instances[0] ||
		DEFAULT_INSTANCE;

	await setDefaultTab(origin, {
		accentColor: color,
	});
	openTab(origin, {
		accentColor: color,
	});

	updateInstanceList();
	prepareInstanceControls();
}

async function prepareInstanceControls() {
	const { instanceButtonAdd } = await getInstanceSettingsElements();

	instanceButtonAdd?.addEventListener("click", addInstance);
}

function addInstance() {
	window.api.send("registerInstance", DEFAULT_INSTANCE);
	updateInstanceList();
}

/**
 * Fill instance list with instance items.
 */
async function updateInstanceList() {
	const { instanceList, instancePanelTemplate } =
		await getInstanceSettingsElements();

	if (!instanceList || !instancePanelTemplate) {
		return;
	}

	const instances = await window.api.getSetting("instances");
	const instancePanels = instances
		.map((instance) => createInstancePanel(instance, instancePanelTemplate))
		.filter(isNonNull);

	instanceList?.replaceChildren(...instancePanels);
}

/**
 * Creates an instance panel element.
 *
 * @param {Instances[number]} instance
 * @param {HTMLTemplateElement} template
 */
function createInstancePanel({ id, origin, label, color }, template) {
	const instancePanel = document.importNode(template.content, true);

	if (!instancePanel || !isParentNode(instancePanel)) {
		return;
	}

	const colorPickerEl = typedQuerySelector(
		"sl-color-picker",
		SlColorPicker,
		instancePanel,
	);
	if (colorPickerEl) {
		colorPickerEl.value = color || "";
	}

	const labelEl = typedQuerySelector(
		".label",
		HTMLParagraphElement,
		instancePanel,
	);
	if (labelEl) {
		labelEl.innerText = label || "";
	}

	const hintEl = typedQuerySelector(
		".hint",
		HTMLParagraphElement,
		instancePanel,
	);
	if (hintEl) {
		hintEl.innerText = origin;
	}

	const buttonDeleteEl = typedQuerySelector(
		"sl-button",
		SlButton,
		instancePanel,
	);
	if (buttonDeleteEl) {
		buttonDeleteEl.addEventListener("click", () => {
			window.api.send(INSTANCE_EVENTS.REMOVE, id);
			updateInstanceList();
		});
	}

	return instancePanel;
}

async function getInstanceSettingsElements() {
	const instanceList = await getIncludedElement(
		"#instance-list",
		"#include-settings",
		HTMLDivElement,
	);
	const instancePanelTemplate = await getIncludedElement(
		"#template-instance-panel",
		"#include-settings",
		HTMLTemplateElement,
	);
	const instanceButtonAdd = await getIncludedElement(
		"#instance-add",
		"#include-settings",
		SlButton,
	);

	return { instanceList, instancePanelTemplate, instanceButtonAdd };
}
