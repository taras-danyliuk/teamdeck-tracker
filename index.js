const { app, BrowserWindow, globalShortcut, Menu, MenuItem } = require("electron");
const storage = require("electron-json-storage-sync");


function setup() {
  try {
    const resultProjects = storage.has("teamdeck-projects");
    if (resultProjects.status && !resultProjects.data) {
      storage.set("teamdeck-projects", ["COAX // ESTIMATION"]);
    }

    const resultDaysOff = storage.has("teamdeck-daysoff");
    if (resultDaysOff.status && !resultDaysOff.data) {
      storage.set("teamdeck-projects", ["2018-12-31"]);
    }

  } catch (err) {}
}
setup();


const menu = new Menu();
let win = null;
let willQuitApp = false;
let appOpened = false;


/** Local Hotkeys */
menu.append(new MenuItem({
  label: "Hide",
  accelerator: "Cmd+H",
  click: () => {
    appOpened = false;
    app.hide();
  }
}));


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    fullscreen: false,
    transparent: true,
    backgroundColor: '#88ffffff',
    webPreferences: {
      nodeIntegration: true,
      // devTools: false
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
  appOpened = true;

  win.on('close', (e) => {
    if (willQuitApp) window = null;
    else {
      e.preventDefault();
      app.hide();
      appOpened = false;
    }
  });

  globalShortcut.register('Ctrl+Option+Cmd+T', () => {
    app.show();
    win.show();

    win.webContents.send('hotkey', 'whoooooooh!')
  });

  globalShortcut.register('Ctrl+Option+Cmd+H', () => {
    if (appOpened) app.hide();
    else {
      app.show();
      win.show();
    }

    appOpened = !appOpened;
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
});

app.on('before-quit', () => willQuitApp = true);

app.on("activate", () => {
  if (win === null) createWindow();
  else app.show();

  appOpened = true;
});
