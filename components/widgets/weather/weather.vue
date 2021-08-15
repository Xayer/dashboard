<template>
  <div class="wrapper">
    <div v-if="weatherData" class="weather">
      <div v-if="weatherData.main">
        <h1 v-if="weatherData.main" class="temp">
          <i
            :class="`weather-icon bi bi-${weatherIcon(weatherData.weather)}`"
          ></i>
          {{ Math.round(weatherData.main.temp) }} {{ temperatureUnit }}
        </h1>
        <h3>{{ weatherData.name }}</h3>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { currentWeather } from '@/modules/apis/weather'
import { getWeatherIcon } from '@/constants/weather'

@Component
export default class WeatherWidget extends Vue {
  @Prop() private settings!: { city: string; units: string }

  weatherData: {
    main?: {
      temp: number
      // eslint-disable-next-line camelcase
      temp_min: number
      // eslint-disable-next-line camelcase
      temp_max: number
    }
    weather?: {
      main: string
      description: string
    }[]
  } = {}

  // eslint-disable-next-line class-methods-use-this
  async mounted() {
    this.weatherData = await currentWeather(
      this.settings.city,
      this.settings.units
    )
  }

  get temperatureUnit() {
    return this.settings.units === 'metric' ? '°C' : '°F'
  }

  // eslint-disable-next-line class-methods-use-this
  weatherIcon(weather: { main: string }[]) {
    return weather ? getWeatherIcon(weather[0].main) : ''
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  .temps {
    height: auto;
    display: flex;
    justify-items: center;
    align-items: center;
    gap: 15px;
    .min-max {
      height: inherit;
      display: flex;
      flex-direction: column;
      > * {
        display: block;
      }
    }
  }

  h1 {
    margin: 0;
    padding: 0;
    &,
    .weather-icon {
      display: flex;
      align-items: flex-start;
    }
  }
}
</style>
