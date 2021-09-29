<template>
  <form @submit.stop.prevent="">
    <label
      v-for="(settingValue, settingName) in settings"
      :key="`${settingName}:${settingValue}`"
      :for="settingName"
      >{{ settingName }}:
      <FormInput
        class="form-field"
        :value="settings[settingName]"
        :name="settingName"
        @input="updateValue(settingName, $event)"
      />
    </label>
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
