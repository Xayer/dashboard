<template>
  <div class="hue-light">
    <template v-if="light">
      <i
        class="bulb bi"
        :class="light.state.on ? 'bi-lightbulb-fill' : 'bi-lightbulb-off-fill'"
        :style="{ color: light.state.on && light.state.hue ? hexColor : '' }"
        @click="light ? toggle(!light.state.on) : undefined"
      />
      <h3 class="name">{{ light.name }}</h3>

      <div v-if="!isNaN(light.state.bri)" class="settings">
        <input
          v-if="light.state.hue"
          ref="color"
          type="color"
          :value="hexColor"
          @change.stop="colour()"
        />
        <span>{{ Math.round((light.state.bri / 255) * 100) }} %</span>
      </div>
    </template>
    <template v-else>No light found.</template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { hexToRgb, rgbToHsl, rgbToXy } from '@/constants/color'

@Component({})
export default class HueBridges extends Vue {
  // Original code by github.com/pixelspark/huejs/
  $refs!: {
    color: HTMLInputElement
  }

  @Prop() private light!: {
    type: Object
    state: { bri: number; xy: Array<number> }
  }

  @Prop() private hueId!: { type: Object }

  toggle(on: boolean) {
    this.$store.dispatch('hue/toggleLight', { uniqueId: this.hueId, on })
  }

  colour() {
    const hex = (this.$refs.color as HTMLInputElement).value
    const { r, g, b } = hexToRgb(hex)
    const { l } = rgbToHsl({ r, g, b })
    const [x, y] = rgbToXy(r, g, b)

    this.$store.dispatch('hue/toggleLight', {
      uniqueId: this.hueId,
      on: true,
      xy: {
        x,
        y,
      },
      bri: l,
    })
  }

  get hexColor() {
    const { state } = this.light

    const x = state.xy[0] // the given x value
    const y = state.xy[1] // the given y value
    const z = 1.0 - x - y
    const Y = state.bri // The given brightness value
    const X = (Y / y) * x
    const Z = (Y / y) * z

    const red1 = X * 1.656492 - Y * 0.354851 - Z * 0.255038
    const green1 = -X * 0.707196 + Y * 1.655397 + Z * 0.036152
    const blue1 = X * 0.051713 - Y * 0.121364 + Z * 1.01153

    const red2 =
      red1 <= 0.0031308
        ? 12.92 * red1
        : (1.0 + 0.055) * red1 ** (1.0 / 2.4) - 0.055
    const green2 =
      green1 <= 0.0031308
        ? 12.92 * green1
        : (1.0 + 0.055) * green1 ** (1.0 / 2.4) - 0.055
    const blue2 =
      blue1 <= 0.0031308
        ? 12.92 * blue1
        : (1.0 + 0.055) * blue1 ** (1.0 / 2.4) - 0.055

    const correction = Math.max(red2, green2, blue2)

    const red = Math.floor(Math.max(red2 / correction, 0) * 255)
    const green = Math.floor(Math.max(green2 / correction, 0) * 255)
    const blue = Math.floor(Math.max(blue2 / correction, 0) * 255)

    const colourHex = `#${red.toString(16).padStart(2, '0')}${green
      .toString(16)
      .padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`

    return colourHex
  }
}
</script>

<style lang="scss">
.hue-light {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: calc(var(--padding) / 2) calc(var(--padding) / 2);
  border-radius: var(--radius);
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  cursor: pointer;
  &,
  .bulb {
    transition: var(--transition);
  }
}
h3 {
  padding: 0;
  margin: 0;
}

input[type='color'] {
  width: var(--padding);
  height: var(--padding);
  padding: calc(var(--padding) / 8);
}

.settings {
  display: flex;
  align-items: center;
}

.hue-light:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.hue-light.on {
  background-color: rgba(0, 155, 0, 0.3);
}
</style>
