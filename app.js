const { ipcRenderer } = require('electron');

const { getData, getDaysOff, saveData, formatDate, formatTime, timeDiffInSeconds, secondsToTime, workingDaysBetweenDates, getMonthStartEndTotal } = require("./helpers");

// Components
require("./components/DayBlock");
require("./components/EntryRow");
require("./components/NewEntryPopup");
require("./components/AppMenu");
require("./components/TotalBreakdown");
require("./components/ProgressBar");


let data = null;
let daysOff = [];

document.addEventListener("DOMContentLoaded", function() {
  // Get data from local .json file
  data = getData();
  daysOff = getDaysOff();

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
      showMenu: false,
      showTotalBreakdown: false,

      isTimerRunning: isTimerRunning,
      today: formatDate(new Date()),
      timeWorked: "00:00:00",
      timeLeft: "00:00:00",
    },
    computed: {
      todaysEntries: function() {
        return this.entries[this.today] || [];
      },
      projectsSummary: function() {
        const entries = this.entries[this.today] || [];
        const result = {};

        // Sum time per project
        entries.forEach(entry => {
          if (!(entry.project in result)) result[entry.project] = 0;

          result[entry.project] += timeDiffInSeconds(entry.timeStart, entry.timeEnd)
        });

        // Format time
        Object.keys(result).forEach(key => {
          result[key] = secondsToTime(result[key]);
        });

        return result;
      }
    },
    methods: {
      totalTimeToday: function() {
        let total = 0;

        (this.entries[this.today] || []).forEach(entry => {
            total += timeDiffInSeconds(entry.timeStart, entry.timeEnd);
        });

        return secondsToTime(total);
      },
      timeLeftToday: function() {
        let total = 0;
        Object.values(this.entries).forEach(value => {
          value.forEach(entry => total += timeDiffInSeconds(entry.timeStart, entry.timeEnd));
        });

        const { start } = getMonthStartEndTotal();
        const days = workingDaysBetweenDates(start, new Date(), daysOff);

        const idealTime = days * 8 * 3600;

        return secondsToTime(idealTime - total);
      },
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
      },
      onOpenTarget: function(target) {
        if (target === "totalBreakdown") vue.showTotalBreakdown = true;
      },
      closeTotalBreakdown: function() {
        vue.showTotalBreakdown = false;
      },
      toggleMenu: function() {
        vue.showMenu = !vue.showMenu;
      },
      onCloseMenu: function() {
        vue.showMenu = false;
      }
    },
    mounted: function() {
      this.timeWorked = this.totalTimeToday();
      this.timeLeft = this.timeLeftToday();

      this.interval = setInterval(function () {
        this.timeWorked = this.totalTimeToday();
        this.timeLeft = this.timeLeftToday();
      }.bind(this), 1000);
    },
    beforeDestroy: function(){
      clearInterval(this.interval);
    }
  });


  ipcRenderer.on("hotkey", () => {
    if (vue.isTimerRunning) vue.stopAndSave();
    else vue.startAndSave();
  })
});

window.addEventListener("beforeunload", saveData);
