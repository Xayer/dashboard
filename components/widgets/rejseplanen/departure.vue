<template>
  <div>
    <iframe :src="departureBoardUrl" frameborder="0"></iframe>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class RejseplanenDeparture extends Vue {
  @Prop() private settings!: {
    stationId: string
  }

  get departureBoardUrl() {
    return `//www.rejseplanen.dk/bin/help.exe/mn?L=vs_tus.vs_new&tpl=monitor&station=${this.settings.stationId}&display=horizontal`
  }
}
</script>
<style lang="scss" scoped>
div,
iframe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
