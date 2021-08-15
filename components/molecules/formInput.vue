<template>
  <div>
    <component v-bind="$attrs" :is="settingType" v-model="setting" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, VModel } from 'nuxt-property-decorator'
import { Input, Select } from '@/components/atoms'

@Component({
  inheritAttrs: false,
  components: {
    Input,
    Select,
  },
})
export default class FormInput extends Vue {
  @VModel() readonly setting!: {
    [key: string]: any | null
  }

  // eslint-disable-next-line class-methods-use-this
  get settingType() {
    if (typeof this.setting === 'object') {
      return 'Select'
    }
    return 'Input'
  }
}
</script>
