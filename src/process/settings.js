import { ipcMain } from "electron";
import { deepFreeze, observe } from "../tools/object.js";
import { readConfig, writeConfig } from "./config.js";

/**
 * @typedef {Object} Settings
 * @property {'light' | 'dark' | 'system' | 'tab'} theme
 * @property {Array<Instance>} instances
 *
 * @typedef {Object} Instance
 * @property {URL["origin"]} origin
 * @property {string =} label
 * @property {string =} color
 * @property {boolean =} isDefault
 */

const CONFIG_SETTINGS_NAME = "settings";
/** @type {Settings} */
const CONFIG_SETTINGS_DEFAULT = deepFreeze({
	theme: "system",
	instances: [],
});
const CONFIG_SETTINGS_ENTRY_NAMES = Object.freeze(
	Object.keys(CONFIG_SETTINGS_DEFAULT),
);

/** @type {Settings} */
export const settings = observe(
	{
		...CONFIG_SETTINGS_DEFAULT,
		...(await readConfig(CONFIG_SETTINGS_NAME)),
	},
	(newSettings) => {
		writeConfig(CONFIG_SETTINGS_NAME, newSettings);
	},
);

ipcMain.handle(
	"setting:get",
	/**
	 * @template {keyof Settings} S
	 *
	 * @function
	 * @param {import("electron").IpcMainInvokeEvent} _event
	 * @param {S} setting
	 *
	 * @returns {Settings[S] | undefined}
	 */
	(_event, setting) => {
		const isAllowedSetting = CONFIG_SETTINGS_ENTRY_NAMES.includes(setting);

		if (isAllowedSetting) {
			return settings[setting];
		}
	},
);

ipcMain.on(
	"setting:set",
	/**
	 * @template {keyof Settings} S
	 *
	 * @function
	 * @param {import("electron").IpcMainEvent} _event
	 * @param {S} setting
	 * @param {Settings[S]} value
	 */
	(_event, setting, value) => {
		const isAllowedSetting = CONFIG_SETTINGS_ENTRY_NAMES.includes(setting);

		if (isAllowedSetting) {
			settings[setting] = value;
		}
	},
);
