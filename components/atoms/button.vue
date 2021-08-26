<template>
  <button class="btn" @click="emitClick"><slot /></button>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Button extends Vue {
  emitClick(event: Event) {
    this.$emit('click', event)
  }
}
</script>
<style lang="scss" scoped>
.btn {
  --button-bg: var(--accent-secondary);
  --button-shadow: var(--accent-secondary);
  border: 0;
  border-radius: var(--radius);
  padding: calc(var(--padding) / 2) calc(var(--padding) / 2);
  font-size: 0.65rem;
  text-transform: uppercase;
  // MUTED
  background-color: var(--button-bg);
  color: var(--button-text-color);
  &:hover {
    cursor: pointer;
    box-shadow: var(--button-shadow);
  }
  &.primary {
    --button-shadow: var(--button-box-shadow) var(--accent-primary);
    --button-bg: var(--accent-primary);
  }
  &.danger {
    --button-shadow: var(--button-box-shadow) var(--accent-danger);
    --button-bg: var(--accent-danger);
  }
  &.warning {
    --button-shadow: var(--button-box-shadow) var(--accent-warning);
    --button-bg: var(--accent-warning);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
