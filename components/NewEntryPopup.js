Vue.component('NewEntryPopup', {
  props: ["done"],
  data: {
    project: "",
    description: "",
  },
  template: `
      <div class="new-entry-popup">
          <div class="new-entry-row">
              <p>Choose Project</p>
              <input type="text"/>
          </div>
          
          <div class="new-entry-row">
              <p>Description</p>
              <input type="text"/>
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
