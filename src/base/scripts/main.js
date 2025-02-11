import "../../../node_modules/@shoelace-style/shoelace/cdn/shoelace.js";
import { setBasePath } from "../../../node_modules/@shoelace-style/shoelace/cdn/utilities/base-path.js";
import "../../../node_modules/electron-tabs/dist/electron-tabs.js";

import { initTabs } from "./electron-tabs.js";
import { initInstance } from "./instance.js";
import { initSettings } from "./settings.js";
import { initTheme } from "./theme.js";
import { initToggles } from "./toggles.js";

setBasePath("../../node_modules/@shoelace-style/shoelace/cdn");

window.addEventListener("DOMContentLoaded", () => {
	initTabs();
	initInstance();
	initTheme();
	initToggles();
	initSettings();
});
