const { app, ipcMain, shell } = require("electron");
const { URL } = require("url");

// Covered origins and URLs are scoped to the Penpot Desktop app (e.g. Penpot instances that can be opened) and the Penpot web app (e.g. links in the Menu > Help & info).
const ALLOWED_INTERNAL_ORIGINS = Object.freeze([
  "https://penpot.app",
  "https://help.penpot.app",
  "https://design.penpot.app",
  "https://early.penpot.app",
]);
const ALLOWED_EXTERNAL_URLS = Object.freeze([
  "https://community.penpot.app/",
  "https://www.youtube.com/c/Penpot", // Tutorials
  "https://github.com/penpot/penpot",
]);

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
});
