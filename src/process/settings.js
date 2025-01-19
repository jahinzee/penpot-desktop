import { observe } from "../tools/object.js";
import { readConfig, writeConfig } from "./config.js";

/**
 * @typedef {Object} Settings
 * @property {Array<Instance>} instances
 *
 * @typedef {Object} Instance
 * @property {URL["origin"]} origin
 */

const CONFIG_SETTINGS_NAME = "settings";
/** @type {Settings} */
const CONFIG_SETTINGS_DEFAULT = {
	instances: [],
};

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
