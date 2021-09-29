<template>
  <form @submit.stop.prevent="">
    <label for="City"
      >City
      <Input :value="city" @input="updateValue('city', $event)" />
    </label>
    <label for="Unit"
      >Unit
      <Select
        :value="unit"
        :options="options"
        name="Unit"
        @input="updateValue('units', $event)"
      />
    </label>
  </form>
</template>
<script lang="ts">
import { Component, Vue, VModel, Prop } from 'nuxt-property-decorator'
import { Select, Input } from '@/components/atoms'
import { WidgetSetting } from '~/types/widgets'

@Component({
  components: {
    Select,
    Input,
  },
})
export default class WeatherSettings extends Vue {
  unit = 'metric'

  city = 'Odense'

  @VModel() readonly settings!: { [key: string]: WidgetSetting }

  @Prop() title!: string

  options = [
    { text: 'metric', value: 'metric' },
    { text: 'imperial', value: 'imperial' },
  ]

  mounted() {
    if (this.settings.units) {
      this.unit = this.settings.units as unknown as string
    }
    if (this.settings.city) {
      this.city = this.settings.city as unknown as string
    }
  }

  updateValue(key: string, value: any) {
    this.$emit('input', { ...this.settings, [key]: value })
  }
}
</script>
<style lang="scss">
form {
  label {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: var(--padding);
    & + label {
      margin-top: var(--padding);
    }

    .form-field {
      margin-left: 0;
    }
  }
}
</style>
