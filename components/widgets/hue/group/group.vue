<template>
  <div>
    <section v-if="hueAvailable && devices && group" class="light-group">
      <h2 v-text="group.name"></h2>
      <HueLight
        v-for="(light, lightid) in group.lights"
        :key="lightid"
        :light="devices.lights[light]"
        :hue-id="light"
      />
    </section>
    <p v-if="!group">Group was not found.</p>
    <p v-if="!hueAvailable || !devices">no active connection to Hue Bridge</p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import HueLight from '@/components/widgets/hue/light.vue'
import { Devices } from '@/types/hue'
import { WidgetSetting } from '~/types/widgets'

@Component({
  components: { HueLight },
  computed: {
    ...mapGetters({
      devices: 'hue/devices',
      token: 'hue/token',
      hueAvailable: 'hue/available',
    }),
  },
})
export default class HuegroupNameWidget extends Vue {
  token!: string

  groupName = ''

  devices!: Devices

  hueAvailable!: boolean

  @Prop() private settings!: { [key: string]: WidgetSetting }

  created() {
    if (this.settings.group) {
      this.groupName = this.settings.group as unknown as string
    }
  }

  get group() {
    if (!this.groupName || !this.devices.groups) {
      return null
    }
    return [...Object.values(this.devices.groups)].find(
      (groupNameToSearchIn) => groupNameToSearchIn.name === this.groupName
    )
  }
}
</script>

<style lang="scss" scoped>
section {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
}

article {
  background-color: #263238;
  border-radius: 4px;
}

.error {
  padding: 5px 7px;
  margin: 0;
  background-color: darken(#853838, 25);
  color: #853838;
}

.light-group {
  display: flex;
  flex-direction: column;
}
</style>
