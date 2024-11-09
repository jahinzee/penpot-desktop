const { contextBridge, ipcRenderer} = require("electron")
const path = require('path')

contextBridge.exposeInMainWorld( "api", { send: (channel, data) => {let validChannels = [
  "updateApp",
  "ReloadApp",
  "MaximizeWindow",
  "UnmaximizeWindow",
  "MinimizeWindow",
  "OpenHelp",
  "OpenOffline"
]
if (validChannels.includes(channel)) {ipcRenderer.send(channel, data)}}})