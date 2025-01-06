import { typedQuerySelector } from "./dom.js";
import { openTab } from "./electron-tabs.js";

export async function initToggles() {
	const { openTabButton } = await getToggles();

	openTabButton?.addEventListener("click", () => openTab());
}

async function getToggles() {
	const openTabButton = typedQuerySelector("#open-tab", HTMLButtonElement);

	return { openTabButton };
}
