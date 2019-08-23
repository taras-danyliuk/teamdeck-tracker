const { timeDiff } = require("../helpers");

Vue.component('EntryRow', {
    props: ["data", "theme"],
    template: `
        <div v-bind:class="{ 'entry-row': true, dark: theme === 'dark' }">
            <p>
                <b>{{data.project || ""}}: </b>
                <span>{{data.description || ""}}</span>
            </p>
        
            <div class="entry-row-values">
                <div class="entry-row-time">
                    <p><b>{{data.timeStart}}</b></p>
                    <p> - </p>
                    <p><b>{{data.timeEnd || "--:--:--"}}</b></p>
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
