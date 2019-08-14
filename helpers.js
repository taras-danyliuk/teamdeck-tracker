const fs = require("fs");
const storage = require("electron-json-storage-sync");


function getData() {
  try {
    // const fileContent = fs.readFileSync("./data/data.json", "utf-8");

    // return JSON.parse(fileContent);

    let data = { entries: {}};

    const fileContent = storage.get("teamdeck-data");
    if (fileContent.status && fileContent.data && fileContent.data.entries) {
      data = fileContent.data;
    }

    return data;
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return {}
  }
}

function getProjects() {
  try {
    // const fileContent = fs.readFileSync("./data/projects.json", "utf-8");

    // return JSON.parse(fileContent);

    const fileContent = storage.get("teamdeck-projects");
    if (fileContent.status ) return fileContent.data;

    return [];
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return []
  }
}

function saveData() {
  if (!data) return;

  try {
    storage.set("teamdeck-data", data);
    // fs.writeFile("./data/data.json", data, function (err) {
    //   if (err) console.log(err, "err");
    // });
  } catch (err) {
    console.log("Error writing file the file: " + JSON.stringify(err));
  }
}

function formatDate(date) {
  date = new Date(date);

  const m = `0${date.getMonth() + 1}`.substr(-2);
  const d = `0${date.getDate()}`.substr(-2);

  return `${date.getFullYear()}-${m}-${d}`;
}

function formatTime(date) {
  date = new Date(date);

  const hours = `0${date.getHours()}`.substr(-2);
  const minutes = `0${date.getMinutes()}`.substr(-2);
  const seconds = `0${date.getSeconds()}`.substr(-2);

  return `${hours}:${minutes}:${seconds}`;
}

function timeDiff(timeStart, timeEnd) {
  if (!timeEnd) timeEnd = formatTime(new Date());

  const timeStartArray = timeStart.split(":");
  const timeStartInSeconds = (+timeStartArray[0] * 3600) + (+timeStartArray[1] * 60) + +timeStartArray[2];

  const timeEndArray = timeEnd.split(":");
  const timeEndInSeconds = (+timeEndArray[0] * 3600) + (+timeEndArray[1] * 60) + +timeEndArray[2];

  const diffInSeconds = timeEndInSeconds - timeStartInSeconds;
  const hours = `0${Math.floor(diffInSeconds / 3600)}`.substr(-2);
  const minutes = `0${Math.floor((diffInSeconds - (hours * 3600)) / 60)}`.substr(-2);
  const seconds = `0${diffInSeconds - (hours * 3600) - (minutes * 60)}`.substr(-2);

  return `${hours}:${minutes}:${seconds}`
}

function timeDiffInSeconds(timeStart, timeEnd) {
  if (!timeEnd) timeEnd = formatTime(new Date());

  const timeStartArray = timeStart.split(":");
  const timeStartInSeconds = (+timeStartArray[0] * 3600) + (+timeStartArray[1] * 60) + +timeStartArray[2];

  const timeEndArray = timeEnd.split(":");
  const timeEndInSeconds = (+timeEndArray[0] * 3600) + (+timeEndArray[1] * 60) + +timeEndArray[2];

  return timeEndInSeconds - timeStartInSeconds;
}

function secondsToTime(seconds) {
  const h = `0${Math.floor(seconds / 3600)}`.substr(-2);
  const m = `0${Math.floor((seconds - (h * 3600)) / 60)}`.substr(-2);
  const s = `0${seconds - (h * 3600) - (m * 60)}`.substr(-2);

  return `${h}:${m}:${s}`
}

module.exports = {
  getData,
  getProjects,
  saveData,
  formatDate,
  formatTime,
  timeDiff,
  timeDiffInSeconds,
  secondsToTime
};
