const {app} = require('electron')
const {autoUpdater} = require("electron-updater")

// Import Files
require('./navigation')
let MainWindow = require('./window')

app.enableSandbox()
// Launch
app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify()
    MainWindow.create()
})