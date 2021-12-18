<template>
  <div class="widget"><slot /></div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class Widget extends Vue {}
</script>
<style lang="scss">
.widget {
  height: 100%;
}
.vue-grid-item {
  --widget-bg: var(--accent-50);
  background-color: var(--widget-bg);
  padding: var(--widget-padding);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border-radius: var(--radius);
  .refresh-button {
    position: absolute;
    bottom: 0;
    right: 0;
    transition: var(--transition);
  }
}
</style>
