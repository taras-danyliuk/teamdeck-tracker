const { formatDate, timeDiffInSeconds, secondsToTime } = require("../helpers");

Vue.component('DayBlock', {
    props: ["date", "entries"],
    data: function() {
        return {
            isOpen: this.date === formatDate(new Date()),
        }
    },
    template: `
      <div v-on:click="isOpen = !isOpen" v-bind:class="{ active: isOpen, accordion: true}">
          <div class="accordion-item">
              <p class="accordion-title">{{date}} : {{totalTime}}</p>
  
              <div class="accordion-content">
                  <entry-row v-for="entry in entries" v-bind:data="entry"></entry-row>
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
