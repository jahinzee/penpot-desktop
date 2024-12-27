import { getIncludedElement, typedQuerySelector } from "./dom.js";
import { openTab } from "./electron-tabs.js";

export async function initToggles() {
	const { toggleSettingsButton, openTabButton } = await getToggles();

	toggleSettingsButton?.addEventListener("click", () => toggleSettings());
	openTabButton?.addEventListener("click", () => openTab());
}

function toggleSettings() {
	const settingsUi = typedQuerySelector("#settings", HTMLElement);
	if (settingsUi) {
		const isVisible = settingsUi.style.display === "flex";
		settingsUi.style.display = isVisible ? "none" : "flex";
	}
}

async function getToggles() {
	const toggleSettingsButton = await getIncludedElement(
		"#toggle-settings",
		"#include-titlebar",
		HTMLButtonElement,
	);

	const openTabButton = typedQuerySelector("#open-tab", HTMLButtonElement);

	return { toggleSettingsButton, openTabButton };
}
