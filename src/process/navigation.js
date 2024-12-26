import { app, ipcMain, shell, dialog } from "electron";
import { URL } from "url";
import { join } from "path";
import { toMultiline } from "./string.js";
import { getMainWindow } from "./window.js";

// Covered origins and URLs are scoped to the Penpot Desktop app (e.g. Penpot instances that can be opened) and the Penpot web app (e.g. links in the Menu > Help & info).
const OFFICIAL_INSTANCE_ORIGINS = Object.freeze([
	"https://design.penpot.app",
	"https://early.penpot.dev",
]);
const ALLOWED_INTERNAL_ORIGINS = Object.freeze([
	...OFFICIAL_INSTANCE_ORIGINS,
	"https://penpot.app",
	"https://help.penpot.app",
]);
const ALLOWED_AUTH_ORIGINS = Object.freeze([
	"https://accounts.google.com",
	"https://github.com",
	"https://gitlab.com",
]);
const ALLOWED_EXTERNAL_URLS = Object.freeze([
	"https://community.penpot.app/",
	"https://www.youtube.com/c/Penpot", // Tutorials
	"https://github.com/penpot/penpot",
]);

/** @type {Set<string>} */
const userInstances = new Set();

ipcMain.on("registerInstance", (event, instance) => {
	try {
		const url = new URL(instance);
		userInstances.clear();
		userInstances.add(url.origin);
	} catch (error) {
		console.error(`[ERROR] [IPC.registerInstance] Failed with: ${instance}`);
	}
});

ipcMain.on("removeInstance", (event, instance) => {
	try {
		const url = new URL(instance);
		userInstances.delete(url.origin);
	} catch (error) {
		console.error(`[ERROR] [IPC.removeInstance] Failed with: ${instance}`);
	}
});

app.on("web-contents-created", (event, contents) => {
	const mainWindow = getMainWindow();

	// Open links in a new tab or a browser, instead of a new window
	contents.setWindowOpenHandler(({ url }) => {
		const parsedUrl = new URL(url);
		const isAllowedOrigin = [
			...ALLOWED_INTERNAL_ORIGINS,
			...userInstances,
		].includes(parsedUrl.origin);
		const isAllowedExternal = ALLOWED_EXTERNAL_URLS.includes(parsedUrl.href);
		const isAllowedNavigation = isAllowedOrigin || isAllowedExternal;

		if (isAllowedOrigin) {
			mainWindow.webContents.send("open-tab", parsedUrl.href);
		} else {
			console.warn(
				`[WARNING] [app.web-contents-created.setWindowOpenHandler] Forbidden origin: ${parsedUrl.origin}`,
			);
		}

		if (isAllowedExternal) {
			shell.openExternal(parsedUrl.href);
		} else {
			console.warn(
				`[WARNING] [app.web-contents-created.setWindowOpenHandler] Forbidden external URL: ${parsedUrl.href}`,
			);
		}

		if (!isAllowedNavigation) {
			console.error(
				`[ERROR] [app.web-contents-created.setWindowOpenHandler] Forbidden navigation.`,
			);

			showNavigationQuestion(parsedUrl.href, {
				buttons: ["Open in a browser"],
				onAllow: () => shell.openExternal(parsedUrl.href),
				logLabel: "app.web-contents-created.setWindowOpenHandler",
			});
		}

		return { action: "deny" };
	});

	// Limit navigation within the app
	contents.on("will-navigate", (event, url) => {
		const parsedUrl = new URL(url);
		const isAllowedOrigin = [
			...ALLOWED_INTERNAL_ORIGINS,
			...ALLOWED_AUTH_ORIGINS,
			...userInstances,
		].includes(parsedUrl.origin);

		if (!isAllowedOrigin) {
			console.error(
				`[ERROR] [app.web-contents-created.will-navigate] Forbidden origin: ${parsedUrl.origin}`,
			);

			showNavigationQuestion(parsedUrl.href, {
				buttons: ["Open"],
				onCancel: () => event.preventDefault(),
				logLabel: "app.web-contents-created.will-navigate",
			});
		}
	});

	contents.on("will-redirect", (event) => {
		const internalOrigins = [...ALLOWED_INTERNAL_ORIGINS, ...userInstances];
		const currentUrl = contents.getURL();

		// A new/empty tab doesn't have a URL before redirect to its initial page.
		if (!currentUrl) {
			return;
		}

		const parsedCurrentUrl = new URL(currentUrl);
		const parsedUrl = new URL(event.url);
		const isFromInternalOrigin = internalOrigins.includes(
			parsedCurrentUrl.origin,
		);
		const isToInternalOrigin = internalOrigins.includes(parsedUrl.origin);

		if (!isFromInternalOrigin && isToInternalOrigin) {
			// Prevents Electron from holding sessions for external services e.g. OpenID providers.
			console.log("Clear non-instance origins data.");

			contents.session.clearData({
				excludeOrigins: [...OFFICIAL_INSTANCE_ORIGINS, ...userInstances],
			});
		}
	});

	contents.on("will-attach-webview", (event, webPreferences, params) => {
		webPreferences.allowRunningInsecureContent = false;
		webPreferences.contextIsolation = true;
		webPreferences.enableBlinkFeatures = "";
		webPreferences.experimentalFeatures = false;
		webPreferences.nodeIntegration = false;
		webPreferences.nodeIntegrationInSubFrames = false;
		webPreferences.nodeIntegrationInWorker = false;
		webPreferences.sandbox = true;
		webPreferences.webSecurity = true;

		const allowedPreloadScriptPath = join(
			app.getAppPath(),
			"src/base/scripts/webviews/preload.mjs",
		);
		const isAllowedPreloadScript =
			!webPreferences.preload ||
			webPreferences.preload === allowedPreloadScriptPath;

		if (!isAllowedPreloadScript) {
			console.warn(
				`[WARNING] [app.web-contents-created.will-attach-webview] Forbidden preload script.`,
			);

			delete webPreferences.preload;
		}

		const parsedSrc = new URL(params.src);
		const isAllowedOrigin = [
			...ALLOWED_INTERNAL_ORIGINS,
			...userInstances,
		].includes(parsedSrc.origin);

		if (!isAllowedOrigin) {
			console.error(
				`[ERROR] [app.web-contents-created.will-attach-webview] Forbidden origin: ${parsedSrc.origin}`,
			);

			event.preventDefault();
		}
	});
});

/**
 * Presents a question dialog about the given url and executes selected action.
 *
 * @typedef {() => void} Callback
 *
 * @param {string} url
 * @param {{ buttons: [string], onCancel?: Callback, onAllow?: Callback, logLabel?: string}} options
 */
function showNavigationQuestion(url, { buttons, onCancel, onAllow, logLabel }) {
	const mainWindow = getMainWindow();

	const DIALOG_NAVIGATION_ANSWERS = Object.freeze({
		CANCEL: 0,
		ALLOW: 1,
	});
	const decision = dialog.showMessageBoxSync(mainWindow, {
		type: "question",
		title: "Navigation request",
		message: `Do you want to open this website?`,
		detail: toMultiline(url),
		buttons: ["Cancel", ...buttons],
		defaultId: DIALOG_NAVIGATION_ANSWERS.CANCEL,
		cancelId: DIALOG_NAVIGATION_ANSWERS.CANCEL,
	});

	switch (decision) {
		case DIALOG_NAVIGATION_ANSWERS.ALLOW:
			console.log(`[INFO] [${logLabel}.navigation-question] Allow`);
			onAllow?.();
			break;
		case DIALOG_NAVIGATION_ANSWERS.CANCEL:
		default:
			console.log(`[INFO] [${logLabel}.navigation-question] Cancel`);
			onCancel?.();
	}
}
