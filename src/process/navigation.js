const { app, ipcMain, shell } = require("electron");
const { URL } = require("url");
const { join } = require("path");

// Covered origins and URLs are scoped to the Penpot Desktop app (e.g. Penpot instances that can be opened) and the Penpot web app (e.g. links in the Menu > Help & info).
const ALLOWED_INTERNAL_ORIGINS = Object.freeze([
  "https://penpot.app",
  "https://help.penpot.app",
  "https://design.penpot.app",
  "https://early.penpot.dev",
]);
const ALLOWED_EXTERNAL_URLS = Object.freeze([
  "https://community.penpot.app/",
  "https://www.youtube.com/c/Penpot", // Tutorials
  "https://github.com/penpot/penpot",
]);

/** @type {string[]} */
const userInstances = [];

ipcMain.on("registerInstance", (event, instance) => {
  try {
    const url = new URL(instance);
    userInstances.push(url.origin);
  } catch (error) {
    console.error(`[ERROR] [IPC.registerInstance] Failed with: ${instance}`);
  }
});

app.on("web-contents-created", (event, contents) => {
  // Open links in a new tab or a browser, instead of a new window
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const isAllowedOrigin = [
      ...ALLOWED_INTERNAL_ORIGINS,
      ...userInstances,
    ].includes(parsedUrl.origin);
    
    if (isAllowedOrigin) {
      mainWindow.webContents.send("open-tab", parsedUrl.href);
    }

    const isAllowedExternal = ALLOWED_EXTERNAL_URLS.includes(parsedUrl.href);
    if (isAllowedExternal) {
      shell.openExternal(parsedUrl.href);
    }

    return { action: "deny" };
  });

  // Limit navigation within the app
  contents.on("will-navigate", (event, url) => {
    const parsedUrl = new URL(url);
    const isAllowedOrigin = [
      ...ALLOWED_INTERNAL_ORIGINS,
      ...userInstances,
    ].includes(parsedUrl.origin);

    if (!isAllowedOrigin) {
      event.preventDefault();
    }
  });

  contents.on('will-attach-webview', (event, webPreferences, params) => {
    webPreferences.allowRunningInsecureContent = false
    webPreferences.contextIsolation = true
    webPreferences.enableBlinkFeatures = ''
    webPreferences.experimentalFeatures = false
    webPreferences.nodeIntegration = false
    webPreferences.nodeIntegrationInSubFrames = false
    webPreferences.nodeIntegrationInWorker = false
    webPreferences.sandbox = true
    webPreferences.webSecurity = true

    const allowedPreloadScriptPath = join(app.getAppPath(), "src/base/scripts/webviews/preload.js")
    const isAllowedPreloadScript = !webPreferences.preload || webPreferences.preload === allowedPreloadScriptPath
    
    if (!isAllowedPreloadScript) {
      console.warn(`[WARNING] [app.will-attach-webview] Forbidden preload script.`);
      delete webPreferences.preload
    }

    const parsedSrc = new URL(params.src)
    const isAllowedOrigin = [
      ...ALLOWED_INTERNAL_ORIGINS,
      ...userInstances,
    ].includes(parsedSrc.origin);

    if (!isAllowedOrigin) {
      console.warn(`[ERROR] [app.will-attach-webview] Forbidden origin.`);
      event.preventDefault()
    }
  })
});
