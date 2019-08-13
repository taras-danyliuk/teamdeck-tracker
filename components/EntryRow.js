const { timeDiff } = require("../helpers");

Vue.component('EntryRow', {
    props: ["data"],
    template: `
      <div class="entry-row">
          <p>{{data.timeStart}}</p>
          <p>{{time}}</p>
          <p>{{data.timeEnd || "--:--:--"}}</p>
      </div>
    `,
    computed: {
        time: function() {
            return timeDiff(this.data.timeStart, this.data.timeEnd)
        }
    }
});
