const { timeDiff } = require("../helpers");

Vue.component('EntryRow', {
    props: ["data", "theme", "isEdit", "save"],
    data: function() {
        return {
            availableProjects: availableProjects,
            project: this.data.project || "",
            description: this.data.description || "",
            timeStart: this.data.timeStart,
            timeEnd: this.data.timeEnd
        }
    },
    template: `
        <div v-bind:class="{ 'entry-row': true, dark: theme === 'dark' }">
            <p class="entry-row-header">
                <select v-if="isEdit" v-model="project" class="new-entry-popup-field">
                    <option v-for="p in availableProjects" v-bind:value="p">{{p}}</option>
                </select>
                <b v-if="!isEdit">{{data.project || ""}}: </b>
                
                <input v-if="isEdit" type="text" v-model="description" class="new-entry-popup-field"/>
                <span class="entry-row-description" v-if="!isEdit">{{data.description || ""}}</span>
            </p>
        
            <div class="entry-row-values">
                <div class="entry-row-time">
                    <input v-if="isEdit" type="text" v-model="timeStart" class="new-entry-popup-field"/>
                    <p v-if="!isEdit"><b>{{data.timeStart}}</b></p>
                    
                    <p> - </p>
                    
                    <input v-if="isEdit" type="text" v-model="timeEnd" class="new-entry-popup-field"/>
                    <p v-if="!isEdit"><b>{{data.timeEnd || "--:--:--"}}</b></p>
                </div>
                
                <p>time spent: <b>{{time}}</b></p>
                
                <div v-if="isEdit" @click="saveChanges" class="entry-row-save">Save</div>
            </div>
        </div>
    `,
    computed: {
        time: function() {
            return timeDiff(this.data.timeStart, this.data.timeEnd, true)
        }
    },
    methods: {
        saveChanges: function (event) {
            event.stopPropagation();

            this.save(this.data._id, { project: this.project, description: this.description, timeStart: this.timeStart, timeEnd: this.timeEnd });
        }
    }
});
