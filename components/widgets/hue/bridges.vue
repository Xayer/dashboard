<template>
  <div>
    <section v-if="hueAvailable && devices">
      <article v-for="(group, index) in devices.groups" :key="index">
        <h2 v-text="group.name"></h2>
        <hue-light
          v-for="(light, lightid) in group.lights"
          :key="lightid"
          :light="devices.lights[light]"
          :hue-id="light"
        />
      </article>
    </section>
    <p v-else>no active connection to Hue Bridge</p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import HueLight from '@/components/widgets/hue/light.vue'

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
export default class HueBridges extends Vue {
  token!: string

  hueAvailable!: boolean

  @Prop() private settings!: string
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
</style>
