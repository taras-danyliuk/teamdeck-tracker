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
                <div class="entry-row-time">
                    <p>{{data.timeStart}}</p>
                    <p> - </p>
                    <p>{{data.timeEnd || "--:--:--"}}</p>
                </div>
                
                <p>time spent: <b>{{time}}</b></p>
            </div>
        </div>
    `,
    computed: {
        time: function() {
            return timeDiff(this.data.timeStart, this.data.timeEnd)
        }
    }
});
