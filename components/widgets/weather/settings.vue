<template>
  <form @submit.stop.prevent="">
    <label for="City"
      >City
      <Input class="m-t" :value="city" @input="updateValue('city', $event)" />
    </label>
    <label for="Unit"
      >Unit
      <Select
        class="m-t"
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
<style scoped>
form,
label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
