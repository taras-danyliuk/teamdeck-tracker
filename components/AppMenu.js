Vue.component("AppMenu", {
  props: ["onOpenTarget", "onClose"],
  template: `
      <div v-on:click="onClose" class="menu-overlay">
          <div class="menu-block" @click="onOpenTarget('totalBreakdown')">
              <p class="menu-row">Total Breakdown</p>
          </div>
      </div>
    `
});
