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
          <div class="new-entry-row">
              <p>Choose Project</p>
              <select v-model="project">
                <option v-for="p in availableProjects" v-bind:value="p">{{p}}</option>
              </select>
          </div>
          
          <div class="new-entry-row">
              <p>Description</p>
              <input type="text" v-model="description"/>
          </div>
          
          <button type="submit">Done</button>
      </div>
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
