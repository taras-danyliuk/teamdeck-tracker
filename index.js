const { app, BrowserWindow, globalShortcut, Menu, MenuItem, ipcMain } = require("electron");
const storage = require("electron-json-storage-sync");
const MongoClient = require('mongodb').MongoClient;

const env = require("./env");


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

/** Electron Setup **/
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 700,
    height: 600,
    fullscreen: false,
    transparent: true,
    backgroundColor: '#88ffffff',
    webPreferences: {
      nodeIntegration: true,
      devTools: false
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

// Start Electron threads
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    client.close();
    app.quit()
  }
});

app.on('before-quit', () => willQuitApp = true);

app.on("activate", () => {
  if (win === null) createWindow();
  else app.show();

  appOpened = true;
});


/** Local Hotkeys */
menu.append(new MenuItem({
  label: "Hide",
  accelerator: "Cmd+H",
  click: () => {
    appOpened = false;
    app.hide();
  }
}));


/** MongoDB Setup **/
// Create a new MongoClient
const client = new MongoClient(env.MONGO_URL, { useNewUrlParser: true });

client.connect(function(err) {
  if (err) return console.log("Error connection to DB", err);

  const db = client.db("teamdeck");
  const entriesCollection = db.collection("entries");
  const projectsCollection = db.collection("projects");

  // Listener for saving in DB
  ipcMain.on("save-entry", async (event, arg) => {
    event.returnValue = await entriesCollection.insertOne(arg);
  });

  // Listener for saving in DB
  ipcMain.on("update-entry", async (event, arg) => {
    event.returnValue = await entriesCollection.updateOne({ user: arg.user, _id: arg._id }, { $set: arg });
  });

  // Listener for getting all entries
  ipcMain.on("get-entries", async (event, arg) => {
    event.returnValue = await entriesCollection.find({ user: arg.user }).toArray();
  });
});





