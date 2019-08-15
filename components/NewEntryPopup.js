const { getProjects } = require("../helpers");

Vue.component('NewEntryPopup', {
  props: ["done"],
  data: function() {
    return {
      availableProjects: getProjects(),
      project: "",
      description: "",
    }
  },
  template: `
      <form class="new-entry-popup" v-on:submit="finish">
        <div class="new-entry-popup-content">
            <div class="new-entry-row">
                <p class="new-entry-popup-label">Choose Project</p>
                <select v-model="project" class="new-entry-popup-field">
                    <option v-for="p in availableProjects" v-bind:value="p">{{p}}</option>
                </select>
            </div>
          
            <div class="new-entry-row">
                <p class="new-entry-popup-label">Description</p>
                <input type="text" v-model="description" class="new-entry-popup-field"/>
            </div>
          
            <button type="submit" class="button new-entry-popup-button">Done</button>
        </div>
      </form>
    `,
  methods: {
    finish: function(event) {
      event.preventDefault();

      this.done({ project: this.project, description: this.description });

      this.project = "";
      this.description = "";
    }
  }
});
