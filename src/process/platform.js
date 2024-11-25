const {app} = require('electron')

module.exports = {
    CSS: function () {
        if (process.platform === 'darwin') {
            setTimeout(() => {
                mainWindow.webContents.executeJavaScript(`document.querySelector("body").style.backgroundColor = 'transparent'`)
                mainWindow.webContents.executeJavaScript(`document.querySelector("tab-group").shadowRoot.querySelector("nav").style.left = '80px'`)
                mainWindow.webContents.executeJavaScript(`document.querySelector(".controls").style.left = '75px'`)
            }, 1500);
        }
        if (process.platform === 'linux') {
            setTimeout(() => {
                mainWindow.webContents.executeJavaScript(`document.querySelector(".linux-titlebar").style.display = 'block'`)
            }, 1500);
        }
        if (process.platform === 'win32') {
            setTimeout(() => {
                mainWindow.webContents.executeJavaScript(`document.querySelector(".titlebar").style.right = '145px'`)
            }, 1500);
        }
    }
}