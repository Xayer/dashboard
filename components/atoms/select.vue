<template>
  <select v-model="selectedValue">
    <option
      v-for="option in options"
      :key="`${option.text}:${option.value}`"
      :value="option.value"
      :disabled="option.disabled || false"
      v-text="option.text"
    ></option>
  </select>
</template>
<script lang="ts">
import { Vue, Component, Prop, VModel } from 'nuxt-property-decorator'

@Component({})
export default class Select extends Vue {
  @Prop() options!: { text: string; value: string }[]

  @VModel() readonly selectedValue!: string
}
</script>
<style lang="scss" scoped>
select {
  border: 1px solid var(--accent-100);
  border-radius: var(--radius);
  box-sizing: border-box;
  padding: calc(var(--padding) / 2) calc(var(--padding) / 2);
  transition: var(--transition);
  background-color: var(--input-bg);
  color: var(--input-text-color);
  &:focus {
    outline: none;
    box-shadow: var(--accent-primary) var(--input-box-shadow);
  }
}
</style>
