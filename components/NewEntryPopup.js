Vue.component('NewEntryPopup', {
  props: ["done"],
  data: function() {
    return {
      project: "",
      description: "",
    }
  },
  template: `
      <div class="new-entry-popup">
          <div class="new-entry-row">
              <p>Choose Project</p>
              <input type="text" v-model="project"/>
          </div>
          
          <div class="new-entry-row">
              <p>Description</p>
              <input type="text" v-model="description"/>
          </div>
          
          <button @click="finish">Done</button>
      </div>
    `,
  methods: {
    finish: function() {
      this.done({ project: this.project, description: this.description });

      this.project = "";
      this.description = "";
    }
  }
});
