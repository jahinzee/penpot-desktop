const { app } = require("electron");

app.on("web-contents-created", (event, contents) => {
  // Open links in a new tab instead of a new window
  contents.setWindowOpenHandler(({ url }) => {
    mainWindow.webContents.send("open-tab", url);

    return { action: "deny" };
  });
});
