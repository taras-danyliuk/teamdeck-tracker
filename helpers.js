const fs = require("fs");

function getData() {
  try {
    const fileContent = fs.readFileSync("./data/data.json", "utf-8");

    return JSON.parse(fileContent);
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return {}
  }
}

function getProjects() {
  try {
    const fileContent = fs.readFileSync("./data/projects.json", "utf-8");

    return JSON.parse(fileContent);
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return []
  }
}

function saveData() {
  if (!data) return;

  try {
    fs.writeFile("./data.json", JSON.stringify(data), function (err) {
      if (err) console.log(err, "err");
    });
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));
  }
}

function formatDate(date) {
  date = new Date(date);

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(date) {
  date = new Date(date);

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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

module.exports = {
  getData,
  getProjects,
  saveData,
  formatDate,
  formatTime,
  timeDiff
};
