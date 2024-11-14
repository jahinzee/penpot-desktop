const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = [
      "updateApp",
      "ReloadApp",
      "MaximizeWindow",
      "UnmaximizeWindow",
      "MinimizeWindow",
      "OpenHelp",
      "OpenOffline",
    ];

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  onOpenTab: (callback) => ipcRenderer.on('open-tab', (_event, value) => callback(value))
});
