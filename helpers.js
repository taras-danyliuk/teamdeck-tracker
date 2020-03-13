const storage = require("electron-json-storage-sync");
const moment = require("moment");
const { ipcRenderer } = require('electron');


function formatDate(date) {
  date = new Date(date);

  const m = `0${date.getMonth() + 1}`.substr(-2);
  const d = `0${date.getDate()}`.substr(-2);

  return `${date.getFullYear()}-${m}-${d}`;
}

function formatTime(date) {
  date = new Date(date);

  let hours = date.getHours();
  if (hours.toString().length === 1) hours = `0${hours}`;
  const minutes = `0${date.getMinutes()}`.substr(-2);
  const seconds = `0${date.getSeconds()}`.substr(-2);

  return `${hours}:${minutes}:${seconds}`;
}

function timeDiff(timeStart, timeEnd, shouldRound = false) {
  if (!timeEnd) {
    timeEnd = formatTime(new Date());
    shouldRound = false;
  }

  const timeStartArray = timeStart.split(":");
  const timeStartInSeconds = (+timeStartArray[0] * 3600) + (+timeStartArray[1] * 60) + +timeStartArray[2];

  const timeEndArray = timeEnd.split(":");
  const timeEndInSeconds = (+timeEndArray[0] * 3600) + (+timeEndArray[1] * 60) + +timeEndArray[2];

  let diffInSeconds = timeEndInSeconds - timeStartInSeconds;
  if (shouldRound) {
    const slug = diffInSeconds % 300;
    // If slug is lower than 2 minutes - lower to the bottom
    if (slug <= 120) diffInSeconds = diffInSeconds - slug;
    else diffInSeconds = diffInSeconds + (300 - slug);
  }

  let hours = Math.floor(diffInSeconds / 3600);
  if (hours.toString().length === 1) hours = `0${hours}`;
  const minutes = `0${Math.floor((diffInSeconds - (hours * 3600)) / 60)}`.substr(-2);
  const seconds = `0${diffInSeconds - (hours * 3600) - (minutes * 60)}`.substr(-2);

  return `${hours}:${minutes}:${seconds}`
}

function timeDiffInSeconds(timeStart, timeEnd, shouldRound = false) {
  if (!timeEnd) {
    timeEnd = formatTime(new Date());
    shouldRound = false;
  }

  const timeStartArray = timeStart.split(":");
  const timeStartInSeconds = (+timeStartArray[0] * 3600) + (+timeStartArray[1] * 60) + +timeStartArray[2];

  const timeEndArray = timeEnd.split(":");
  const timeEndInSeconds = (+timeEndArray[0] * 3600) + (+timeEndArray[1] * 60) + +timeEndArray[2];

  let diffInSeconds = timeEndInSeconds - timeStartInSeconds;
  if (shouldRound) {
    const slug = diffInSeconds % 300;
    // If slug is lower than 2 minutes - lower to the bottom
    if (slug <= 120) diffInSeconds = diffInSeconds - slug;
    else diffInSeconds = diffInSeconds + (300 - slug);
  }

  return diffInSeconds;
}

function secondsToTime(seconds) {
  let prefix = "";
  if (seconds < 0) {
    prefix = "-";
    seconds = Math.abs(seconds);
  }

  let h = Math.floor(seconds / 3600);
  if (h.toString().length === 1) h = `0${h}`;
  const m = `0${Math.floor((seconds - (h * 3600)) / 60)}`.substr(-2);
  const s = `0${seconds - (h * 3600) - (m * 60)}`.substr(-2);

  return `${prefix}${h}:${m}:${s}`
}

function timeToSeconds(time) {
  const timeArray = time.split(":");

  return (+timeArray[0] * 3600) + (+timeArray[1] * 60) + +timeArray[2];
}

function workingDaysBetweenDates(start, end, daysOff = daysOff) {
  start = moment(start).startOf("day");
  end = moment(end).startOf("day");
  end.add(1, "days");

  let counter = 0;
  while(!start.isSame(end, "day")) {
    const day = start.toDate().getDay();
    const formattedDate = formatDate(start.toDate());

    if (day !== 6 && day !== 0 && !daysOff.includes(formattedDate)) counter++;
    start.add(1, "days");
  }

  return counter;
}

function getMonthStartEndTotal() {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  start.setDate(27);
  end.setDate(26);

  if (now.getDate() > 26) end.setMonth(now.getMonth() + 1);
  else start.setMonth(now.getMonth() - 1);

  const totalWorkingDays = workingDaysBetweenDates(start, end, daysOff);

  return { start, end, totalWorkingDays };
}

function getEntries() {
  try {
    const entries = {};
    const bdEntries = ipcRenderer.sendSync("get-entries", { user: user.user });

    // Group based on date
    bdEntries.forEach(entry => {
      if (!entry.date) return;

      if (!(entry.date in entries)) entries[entry.date] = [];
      entries[entry.date].push(entry);
    });


    // Order keys by date
    const orderedEntriesKeys = Object.keys(entries).sort((a, b) => {
      if (new Date(a) > new Date(b)) return -1;
      else if (new Date(a) < new Date(b)) return 1;

      return 0;
    });

    // Order Entries by timeStart
    const resultEntries = {};
    orderedEntriesKeys.forEach(key => {
      const sortedEntries = entries[key].sort((a, b) => {
        if (timeToSeconds(a.timeStart) > timeToSeconds(b.timeStart)) return 1;
        else if (timeToSeconds(a.timeStart) < timeToSeconds(b.timeStart)) return -1;

        return 0;
      });

      resultEntries[key] = sortedEntries;
    });

    return { entries: resultEntries };
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return { entries: {}}
  }
}

function saveEntry(date, timeStart) {
  ipcRenderer.sendSync("save-entry", {
    user: user.user,
    date,
    timeStart
  });
}

function updateEntry(_id, dataToSet) {
  ipcRenderer.sendSync("update-entry", {
    user: user.user,
    _id,
    ...dataToSet
  });
}

function getProjects() {
  try {
    const fileContent = storage.get("teamdeck-projects");
    if (fileContent.status ) return fileContent.data;

    return [];
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return []
  }
}

function getDaysOff() {
  try {
    const fileContent = storage.get("teamdeck-daysoff");
    if (fileContent.status ) return fileContent.data;

    return [];
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return []
  }
}

function getUser() {
  try {
    const fileContent = storage.get("teamdeck-user");
    if (fileContent.status ) return fileContent.data;

    return { user: "default@coaxsoft.com" };
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return { user: "default@coaxsoft.com" };
  }
}


module.exports = {
  getEntries,
  saveEntry,
  updateEntry,
  getProjects,
  getDaysOff,
  getUser,
  formatDate,
  formatTime,
  timeDiff,
  timeDiffInSeconds,
  secondsToTime,
  timeToSeconds,
  workingDaysBetweenDates,
  getMonthStartEndTotal,
  daysText: ["днів", "день", "дні", "дні", "дні", "днів", "днів", "днів", "днів", "днів"]
};
