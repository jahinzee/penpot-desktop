import "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";
import "../../../node_modules/electron-tabs/dist/electron-tabs.js";

import { initTabs } from "./electron-tabs.js";
import { initInstance } from "./instance.js";
import { initTheme } from "./theme.js";
import { initToggles } from "./toggles.js";

window.addEventListener("DOMContentLoaded", () => {
	initTabs();
	initInstance();
	initTheme();
	initToggles();
});
