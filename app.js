const { getData, saveData, formatDate, formatTime } = require("./helpers");


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


// Components
Vue.component('TestRow', {
  props: ["k"],
  template: `<div class="box">- {{k}}</div>`
});

Vue.component('DayBlock', {
  props: ["date", "entries"],
  template: `
    <div class="accordion">
        <div class="accordion-item is-active">
            <!-- Accordion tab title -->
            <p class="accordion-title">{{date}}</p>

            <!-- Accordion tab content: it would start in the open state due to using the \`is-active\` state class. -->
            <div class="accordion-content" style="display: block">
                <p>Panel 1. Lorem ipsum dolor</p>
                <p>{{JSON.stringify(entries)}}</p>
            </div>
        </div>
    </div>
  `
});
