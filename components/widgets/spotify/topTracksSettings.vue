<template>
  <form @submit.stop.prevent="">
    <label for="Range"
      >Time Range
      <Select
        :value="range"
        :options="options"
        name="Range"
        @input="updateValue('range', $event)"
      />
    </label>
  </form>
</template>
<script lang="ts">
import { Component, Vue, VModel, Prop } from 'nuxt-property-decorator'
import { Select, Input } from '@/components/atoms'
import { WidgetSetting } from '~/types/widgets'
import { TopTimeRange } from '~/types/spotify/topTracks'

@Component({
  components: {
    Select,
    Input,
  },
})
export default class TopTracksrSettings extends Vue {
  range: TopTimeRange = 'medium_term'

  @VModel() readonly settings!: { [key: string]: WidgetSetting }

  @Prop() title!: string

  options = [
    { text: '4 weeks', value: 'short_term' },
    { text: '6 months', value: 'medium_term' },
    { text: 'several years', value: 'long_term' },
  ]

  mounted() {
    if (this.settings.range) {
      this.range = (this.settings.range as unknown) as TopTimeRange
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
