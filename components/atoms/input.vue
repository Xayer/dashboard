<template>
  <input v-model="name" />
</template>
<script lang="ts">
import { Vue, Component, VModel } from 'nuxt-property-decorator'

@Component({})
export default class Input extends Vue {
  @VModel({ type: String }) name!: string
}
</script>
<style lang="scss">
input,
textarea {
  border: 1px solid var(--secondary);
  border-radius: var(--radius);
  padding: calc(var(--padding) * 0.75) calc(var(--padding) * 1.5);
  transition: var(--transition-global);
  background-color: var(--input-bg);
  color: var(--input-text-color);
  &::placeholder {
    color: var(--input-text-color);
  }
  &:focus {
    outline: none;
    box-shadow: var(--primary) var(--input-box-shadow);
  }
}
</style>
