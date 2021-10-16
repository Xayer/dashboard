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
import { computed, defineComponent } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import HueLight from '@/components/widgets/hue/light.vue'
import { Devices } from '@/types/hue'
import { WidgetSetting } from '~/types/widgets'
import { useFetchDevices } from '~/queries/hue/groups'

export default defineComponent({
  props: {
      settings: {
        type: Object,
        default: () => ({
          testGroup: {} as WidgetSetting,
        }),
      },
    },
  setup(props) {
    let groupName = ''
    if (props.settings.group) {
      groupName = props.settings.group as unknown as string
    }

    // TODO: fix enabled state to be based on if hue is available
    const { data: groups } = useFetchDevices(true);


    const group = computed(() => {
      if (!groupName || !groups.value) {
        return null
      }
      return [...Object.values(groups.value)].find(
        (groupNameToSearchIn) => groupNameToSearchIn.name === groupName
      )
    })

    return { groupName, group };
  }
})
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
