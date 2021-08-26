<template>
  <form @submit.stop.prevent="">
    <div
      v-for="(settingValue, settingName) in settings"
      :key="`${settingName}:${settingValue}`"
    >
      <label :for="settingName"
        >{{ settingName }}:
        <FormInput
          class="form-field"
          :value="settings[settingName]"
          :name="settingName"
          @input="updateValue(settingName, $event)"
        />
      </label>
    </div>
  </form>
</template>
<script lang="ts">
import { Component, Vue, VModel, Prop } from 'vue-property-decorator'
import { FormInput } from '@/components/molecules'
import WidgetWrapper from '@/components/widgets/widget.vue'
import { WidgetSetting } from '~/types/widgets'

@Component({
  components: {
    FormInput,
    WidgetWrapper,
  },
})
export default class WidgetSettingEditor extends Vue {
  @VModel() readonly settings!: WidgetSetting[]

  @Prop() title!: string

  updateValue(key: string, value: any) {
    this.$emit('input', { ...this.settings, [key]: value })
  }
}
</script>
<style lang="scss"></style>
