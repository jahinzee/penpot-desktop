import { app } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * @typedef {Object} Config
 */

/**
 * @param {string} configName
 *
 * @returns {Promise<Config | undefined>}
 */
export async function getConfig(configName) {
	const configFilePath = getConfigFilePath(configName);

	try {
		const configData = await readFile(configFilePath, "utf8");
		const config = configData && JSON.parse(configData);

		return config;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to get the config.";
		console.error(`[ERROR] [config:get:${configName}] ${message}`);
	}
}

/**
 * @param {string} configName
 * @param {Partial<Config>} config
 *
 * @returns
 */
export function updateConfig(configName, config) {
	const configFilePath = getConfigFilePath(configName);
	const currentConfig = getConfig(configName);

	try {
		const configJSON = JSON.stringify(
			{
				...currentConfig,
				...config,
			},
			null,
			"\t",
		);
		writeFile(configFilePath, configJSON, "utf8");
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to save the  config.";
		console.error(`[ERROR] [config:update:${configName}] ${message}`);
	}
}

/**
 * @param {string} configName
 *
 * @returns
 */
function getConfigFilePath(configName) {
	const configDir = app.getPath("userData");

	return join(configDir, `${configName}.json`);
}
