<template>
  <div class="card">
    <div class="header">
      <div class="title"><slot name="title" /></div>
      <div class="action"><slot name="action" /></div>
    </div>
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({})
export default class Card extends Vue {}
</script>
<style lang="scss" scoped>
.card {
  /** variables */
  --card-bg: var(--accent-50);
  --card-title-size: 12px;

  background-color: var(--card-bg);
  padding: var(--padding);
  border-radius: var(--radius);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: var(--card-title-size);
    text-transform: uppercase;
  }

  + .card {
    margin-top: var(--padding);
  }
}
</style>
