Vue.component('DayBlock', {
    props: ["date", "entries"],
    data: function() {
        return {
            isOpen: false,
        }
    },
    template: `
      <div v-on:click="isOpen = !isOpen" v-bind:class="{ active: isOpen, accordion: true}">
          <div class="accordion-item">
              <p class="accordion-title">{{date}}</p>
  
              <div class="accordion-content">
                  <p>Panel 1. Lorem ipsum dolor</p>

                  <entry-row v-for="entry in entries" v-bind:data="entry"></entry-row>
              </div>
          </div>
      </div>
    `,
    methods: {
        toggleAccordion: function() {
            isOpen = !isOpen;
        }
    }
});