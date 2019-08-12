const { getData, saveData, formatDate, formatTime } = require("./helpers");

// Components
require("./components/DayBlock");
require("./components/EntryRow");


let data = null;

document.addEventListener("DOMContentLoaded", function() {
  // Get data from local .json file
  data = getData();

  new Vue({
    el: '#root',
    data: {
      ...data,
      check: "yeap!"
    }
  });
});

window.addEventListener("beforeunload", saveData);
