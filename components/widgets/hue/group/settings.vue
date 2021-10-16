<template>
  <form @submit.stop.prevent="">
    <label for="hueGroup"
      >Hue Group
      <Select
        v-if="options"
        class="m-t"
        :value="group"
        :options="options"
        name="hueGroup"
        @input="updateValue('group', $event)"
      />
      <p v-else>no groups available</p>
    </label>
  </form>
</template>
<script lang="ts">
import { Component, Vue, VModel, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { Select } from '@/components/atoms'
import { Devices as HueDevices } from '@/types/hue'
import { WidgetSetting } from '~/types/widgets'
import { useFetchDevices } from '~/queries/hue/groups'
import { computed, defineComponent } from '@vue/composition-api'

@Component({
  components: {
    Select,
  },
  computed: {
    ...mapGetters({
      devices: 'hue/devices',
      token: 'hue/token',
      hueAvailable: 'hue/available',
    }),
  },
})
/* export default class HueGroupSettings extends Vue {
  devices!: HueDevices

  group = ''

  @VModel() readonly settings!: { [key: string]: WidgetSetting }

  @Prop() title!: string

  get groupFromSettings() {
    return this.settings.group ? this.settings.group : null
  }

  get options() {
    if (!this.devices.groups) {
      return []
    }
    return [
      {
        text: 'Select Group',
        value: '',
        disabled: true,
      },
      ...Object.values(this.devices.groups).map((lightGroup) => ({
        text: lightGroup.name,
        value: lightGroup.name,
      })),
    ]
  }

  mounted() {
    if (this.groupFromSettings) {
      this.group = this.settings.group
        ? (this.settings.group as unknown as string)
        : ''
    }
  }

  @Watch('options')
  setDefaultValueBasedOnOptions() {
    if (this.group === '' && this.options[0]) {
      // eslint-disable-next-line no-unused-expressions
      this.group = this.options[0].value
    }
  }

  updateValue(key: string, value: any) {
    this.$emit('input', { ...this.settings, [key]: value })
  }

  
} */

export default defineComponent({
  props: {
      settings: {
        type: Object,
        default: () => ({
          group: '',
        }),
      },
    },
  setup(props) {
    let groupFromSettings = ''
    if (props.settings.group) {
      groupFromSettings = props.settings.group as unknown as string
    }

    // TODO: fix enabled state to be based on if hue is available
    const { data } = useFetchDevices(true);

    console.log(data.value);

    const group = computed(() => {
      if (!groupFromSettings || !groups.value) {
        return null
      }
      return [...Object.values(groups.value)].find(
        (groupsToSearchIn) => groupsToSearchIn.name === groupFromSettings
      )
    })

    const options = computed(() => {
      if(!groups.value) {
        return [];
      }
      return [
        {
          text: 'Select Group',
          value: '',
          disabled: true,
        },
        ...Object.values(groups.value).map((lightGroup) => {
          return {
            text: lightGroup.name,
            value: lightGroup.name,
          }
        })
      ]
    })

    return { groupFromSettings, group, options };
  }
})
</script>
<style scoped>
form,
label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
