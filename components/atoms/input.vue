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
  font-family: var(--font-display);
  border: 1px solid var(--accent-100);
  border-radius: var(--radius);
  padding: calc(var(--padding) / 2) calc(var(--padding) / 2);
  transition: var(--transition);
  background-color: var(--input-bg);
  color: var(--input-text-color);
  &::placeholder {
    color: var(--input-text-color);
  }
  &:focus {
    outline: none;
    --input-box-shadow: var(--box-shadow-general);
    box-shadow: var(--accent-primary) var(--input-box-shadow);
  }
}
</style>
