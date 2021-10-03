<template>
  <div class="hue-light" @click="toggle(!light.state.on)">
    <i
      class="bulb bi"
      :class="light.state.on ? 'bi-lightbulb-fill' : 'bi-lightbulb-off-fill'"
      :style="{ color: light.state.on && light.state.hue ? hexColor : '' }"
    />
    <h3 class="name">{{ light.name }}</h3>
    <span v-if="!isNaN(light.state.bri)">
      {{ Math.round((light.state.bri / 255) * 100) }} % <br />
    </span>
    <!-- <input
			ref="color"
			type="color"
			@change="colour(!light.state.on)"
			v-if="light.state.hue"
			:value="hexColor"
		> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

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

  colour(on: boolean) {
    const result: Array<string> | null =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        (this.$refs.color as HTMLInputElement).value
      )

    if (!result) return

    const red = parseInt(result[1], 16) / 255
    const green = parseInt(result[2], 16) / 255
    const blue = parseInt(result[3], 16) / 255

    const red2 =
      red > 0.04045 ? ((red + 0.055) / (1.0 + 0.055)) ** 2.4 : red / 12.92
    const green2 =
      green > 0.04045 ? ((green + 0.055) / (1.0 + 0.055)) ** 2.4 : green / 12.92
    const blue2 =
      blue > 0.04045 ? ((blue + 0.055) / (1.0 + 0.055)) ** 2.4 : blue / 12.92

    const X = red2 * 0.664511 + green2 * 0.154324 + blue2 * 0.162028
    const Y = red2 * 0.283881 + green2 * 0.668433 + blue2 * 0.047685
    const Z = red2 * 0.000088 + green2 * 0.07231 + blue2 * 0.986039

    const x = X / (X + Y + Z)
    const y = Y / (X + Y + Z)

    const colour = [x, y]
    this.$store.dispatch('hue/toggleLight', {
      uniqueId: this.hueId,
      on,
      colour,
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

.hue-light:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.hue-light.on {
  background-color: rgba(0, 155, 0, 0.3);
}
</style>
