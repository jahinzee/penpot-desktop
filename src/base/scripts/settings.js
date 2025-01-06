import {
	SlButton,
	SlDrawer,
} from "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";
import { getIncludedElement } from "./dom.js";

export async function initSettings() {
	const { toggleSettingsButton, openDocsButton, openSelfhostButton } =
		await getTriggers();

	toggleSettingsButton?.addEventListener("click", () => toggleSettings());
	openDocsButton?.addEventListener("click", () => window.api.send("OpenHelp"));
	openSelfhostButton?.addEventListener("click", () =>
		window.api.send("OpenOffline"),
	);
}

async function toggleSettings() {
	const settingsDrawer = await getIncludedElement(
		"#settings",
		"#include-settings",
		SlDrawer,
	);

	if (settingsDrawer?.open) {
		settingsDrawer?.hide();
		return;
	}

	settingsDrawer?.show();
}

async function getTriggers() {
	const toggleSettingsButton = await getIncludedElement(
		"#toggle-settings",
		"#include-controls",
		SlButton,
	);
	const openDocsButton = await getIncludedElement(
		"#open-docs",
		"#include-settings",
		SlButton,
	);
	const openSelfhostButton = await getIncludedElement(
		"#open-selfhost",
		"#include-settings",
		SlButton,
	);

	return { toggleSettingsButton, openDocsButton, openSelfhostButton };
}
