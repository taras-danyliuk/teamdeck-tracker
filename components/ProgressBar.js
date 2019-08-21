const { timeDiff } = require("../helpers");

Vue.component('ProgressBar', {
  props: ["textLeft", "textRight", "percents"],
  template: `
        <div class="progress-wrapper">
            <div class="progress-text-holder">
                <span class="progress-text">{{textLeft}}</span>
                <span class="progress-text">{{textRight}}</span>
            </div>
            
            <div class="progress-background">
                <div class="progress-foreground" v-bind:style="{width: percents + '%'}"></div>
            </div>
        </div>
    `,
  computed: {
    time: function() {
      return timeDiff(this.data.timeStart, this.data.timeEnd)
    }
  }
});
