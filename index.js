const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const storage = require("electron-json-storage-sync");
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const log = require('electron-log');


const env = require("./env");


function getMonthStart() {
  const now = new Date();
  const start = new Date();

  start.setDate(27);
  if (now.getDate() <= 26) start.setMonth(now.getMonth() - 1);

  return start;
}

function formatDate(date) {
  date = new Date(date);

  const m = `0${date.getMonth() + 1}`.substr(-2);
  const d = `0${date.getDate()}`.substr(-2);

  return `${date.getFullYear()}-${m}-${d}`;
}

function setup() {
  try {
    const resultProjects = storage.has("teamdeck-projects");
    if (resultProjects.status && !resultProjects.data) {
      storage.set("teamdeck-projects", ["COAX // ESTIMATION"]);
    }

    const resultDaysOff = storage.has("teamdeck-daysoff");
    if (resultDaysOff.status && !resultDaysOff.data) {
      storage.set("teamdeck-daysoff", ["2018-12-31"]);
    }

    const resultUser = storage.has("teamdeck-user");
    if (resultUser.status && !resultUser.data) {
      storage.set("teamdeck-user", { user: "default@coaxsoft.com" });
    }
  } catch (err) {}
}
setup();

let win = null;
let willQuitApp = false;
let appOpened = false;
let client = null;

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
  win.loadFile(path.join(__dirname, 'index.html'));

  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => win = null);

  win.on('close', (e) => {
    if (willQuitApp) window = null;
    else {
      e.preventDefault();
      app.hide();
      appOpened = false;
    }
  });
}

// Start Electron threads
app.on("ready", () => {
  /** MongoDB Setup **/
  client = new MongoClient(env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(function(err) {
    if (err) return console.log("Error connection to DB", err);

    // Create Electron Window
    createWindow();
    appOpened = true;

    const db = client.db("tracker");
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
      const startDate = getMonthStart();

      const result = await entriesCollection.find({ user: arg.user, date: { $gte: formatDate(startDate) } }).toArray();

      event.returnValue = result;
    });
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
  log.info("window-all-closed");

  if (process.platform !== "darwin") {
    client.close();
    app.quit();
    log.info("app.quit()");
  }
});

app.on('before-quit', () => {
  log.info("willQuitApp = true;");
  willQuitApp = true;
});

app.on("activate", () => {
  if (win === null) createWindow();
  else app.show();

  appOpened = true;
});
