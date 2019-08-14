const { timeDiff } = require("../helpers");

Vue.component('EntryRow', {
    props: ["data"],
    template: `
        <div class="entry-row">
            <p>
                {{data.project || ""}}
                <span>{{data.description || ""}}</span>
            </p>
        
            <div class="entry-row-values">
                <p>{{data.timeStart}}</p>
                <p>{{data.timeEnd || "--:--:--"}}</p>
                <p>{{time}}</p>
            </div>
        </div>
    `,
    computed: {
        time: function() {
            return timeDiff(this.data.timeStart, this.data.timeEnd)
        }
    }
});
