const { timeDiffInSeconds, secondsToTime, getMonthStartEndTotal, workingDaysBetweenDates, daysText } = require("../helpers");

Vue.component("TotalBreakdown", {
  props: ["onClose", "isEdit", "save"],
  data: function() {
    const orderedKeys = Object.keys(data.entries).sort((a, b) => {
      if (new Date(a) > new Date(b)) return -1;
      else if (new Date(a) < new Date(b)) return 1;

      return 0;
    });

    const entries = {};
    orderedKeys.forEach(key => {
      entries[key] = data.entries[key];
    });

    return {
      entries,
      timeWorked: "00:00:00",
      workingDays: 0,
      daysLeft: 0,
      idealTimeWorked: "00:00:00",
      progressPercents: 0,
      daysLeftProgress: 0,
      daysText
    }
  },
  template: `
      <div class="total-wrapper">
        <div class="header" @click="onClose">
            <p class="total-header-text">Відпрацьовано {{timeWorked}} з {{idealTimeWorked}}</p>
            <progress-bar v-bind:percents="progressPercents"></progress-bar>
            
            <p class="total-header-text">Залишилось {{daysLeft}} {{daysText[daysLeft]}} з {{workingDays}}</p>
            <progress-bar v-bind:percents="daysLeftProgress"></progress-bar>
        </div>
            
      
        <div class="days-breakdown">
            <day-block v-for="(value, name) in entries" v-bind:date="name" v-bind:entries="value" theme="dark" v-bind:is-edit="isEdit" v-bind:save="save"></day-block>
        </div>
      </div>
    `,
  methods: {
    onRowClick: function(target) {
      this.onOpenTarget(target)
    },
    totalTimeToday: function() {
      let total = 0;
      Object.values(this.entries).forEach(value => {
        value.forEach(entry => total += timeDiffInSeconds(entry.timeStart, entry.timeEnd, true));
      });

      return total;
    },
  },
  mounted: function() {
    const { end, totalWorkingDays } = getMonthStartEndTotal();
    const workedInSeconds = this.totalTimeToday();
    const shouldWorkInSeconds = 8 * 3600 * (totalWorkingDays);
    const daysLeft = workingDaysBetweenDates(new Date(), end, daysOff);


    this.timeWorked = secondsToTime(workedInSeconds);
    this.idealTimeWorked = secondsToTime(shouldWorkInSeconds);
    this.workingDays = totalWorkingDays;
    this.daysLeft = daysLeft;
    this.progressPercents = (100 * workedInSeconds / shouldWorkInSeconds).toFixed(4);
    this.daysLeftProgress = (100 * (totalWorkingDays - daysLeft) / totalWorkingDays).toFixed(4);
  },
});
