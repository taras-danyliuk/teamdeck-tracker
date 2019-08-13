const { app, BrowserWindow, globalShortcut, Menu, MenuItem } = require("electron");
// const { menubar } = require('menubar');


const menu = new Menu();

menu.append(new MenuItem({
  label: 'Hide',
  accelerator: 'Cmd+H',
  click: app.hide
}));

// const mb = menubar();

// mb.on("ready", () => {
//   console.log("app is ready");
//   // your app code here
// });


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    // fullscreen: true,
    transparent: true,
    backgroundColor: '#aaffffff',
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    win = null
  })
}

app.on("ready", () => {
  createWindow();

  globalShortcut.register('Ctrl+Option+Cmd+T', () => {
    app.show();
    win.show();

    win.webContents.send('hotkey', 'whoooooooh!')
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
});
