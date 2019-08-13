const { ipcRenderer } = require('electron');

const { getData, saveData, formatDate, formatTime } = require("./helpers");

// Components
require("./components/DayBlock");
require("./components/EntryRow");
require("./components/NewEntryPopup");


let data = null;

document.addEventListener("DOMContentLoaded", function() {
  // Get data from local .json file
  data = getData();
  const today = formatDate(new Date());
  const isTimerRunning = (
    data.entries[today] &&
    data.entries[today].length &&
    !data.entries[today][data.entries[today].length - 1].timeEnd
  );


  const vue = new Vue({
    el: '#root',
    data: {
      ...data,
      showNewEntryPopup: false,
      isTimerRunning: isTimerRunning,
    },
    methods: {
      startAndSave: function() {
        const today = formatDate(new Date());
        const todayEntries = vue.entries[today] || [];

        // Get or create last entry
        todayEntries.push({
          timeStart: formatTime(new Date())
        });

        vue.entries[today] = todayEntries;
        vue.isTimerRunning = true;
        vue.showNewEntryPopup = true;

        new Notification('Teamdeck notes', { body: 'Start timer' });
      },
      stopAndSave: function() {
        const today = formatDate(new Date());
        const todayEntries = vue.entries[today];
        const targetEntry = todayEntries.pop();

        targetEntry.timeEnd = formatTime(new Date());

        todayEntries.push({ ...targetEntry });
        vue.entries[today] = todayEntries;
        vue.isTimerRunning = false;

        new Notification('Teamdeck notes', { body: 'Stop timer' });
      },
      addEntryDetails: function(data = {}) {
        const today = formatDate(new Date());
        const todayEntries = vue.entries[today];
        const targetEntry = todayEntries[todayEntries.length - 1];

        targetEntry.project = data.project || "p1";
        targetEntry.description = data.description || "d1";

        vue.showNewEntryPopup = false;
      }
    }
  });


  ipcRenderer.on("hotkey", () => {
    if (vue.isTimerRunning) vue.stopAndSave();
    else vue.startAndSave();
  })
});

window.addEventListener("beforeunload", saveData);
