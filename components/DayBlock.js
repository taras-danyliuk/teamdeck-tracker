const { formatDate, timeDiffInSeconds, secondsToTime } = require("../helpers");

Vue.component('DayBlock', {
    props: ["date", "entries", "theme", "isEdit", "save"],
    data: function() {
        return {
            isOpen: this.date === formatDate(new Date()),
        }
    },
    template: `
      <div v-on:click="isOpen = !isOpen || isEdit" v-bind:class="{ active: isOpen || isEdit, acc: true, dark: theme === 'dark'}">
          <div class="acc-item">
              <p class="acc-title">{{date}} : {{totalTime}}</p>
  
              <div class="acc-content">
                  <entry-row
                    v-for="entry in entries"
                    v-bind:data="entry"
                    v-bind:theme="theme"
                    v-bind:is-edit="isEdit"
                    v-bind:save="save"
                  ></entry-row>
              </div>
          </div>
      </div>
    `,
    methods: {
        toggleAccordion: function() {
            isOpen = !isOpen;
        }
    },
    computed: {
        totalTime: function() {
            let total = 0;

            this.entries.forEach(entry => {
                total += timeDiffInSeconds(entry.timeStart, entry.timeEnd);
            });

            return secondsToTime(total)
        }
    }
});
