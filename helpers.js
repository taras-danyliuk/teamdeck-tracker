const fs = require("fs");

function getData() {
  try {
    const fileContent = fs.readFileSync("./data.json", "utf-8");

    return JSON.parse(fileContent);
  } catch (err) {
    console.log("Error reading the file: " + JSON.stringify(err));

    return {}
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

module.exports = {
  getData,
  saveData,
  formatDate,
  formatTime
};
