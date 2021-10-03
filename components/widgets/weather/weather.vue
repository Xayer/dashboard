<template>
  <div class="wrapper">
    <div class="weather">
      <template v-if="data">
        <h1 class="temp">
          <i
            v-if="weatherIcon"
            class="weather-icon bi"
            :class="`bi-${weatherIcon}`"
          ></i>
          <span v-if="temperature">{{ temperature }}</span>
          <span>{{ temperatureUnit }}</span>
        </h1>
        <h3 v-if="label">{{ label }}</h3>
      </template>
      <Button
        class="refresh-button"
        :class="{ primary: isFetching }"
        @click="refetch"
        ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
      ></Button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { getWeatherIcon } from '@/constants/weather'
import { useCurrentWeatherQuery } from '~/queries/weather'
import { Button } from '~/components/atoms'

export default defineComponent({
  name: 'Weather',
  components: {
    Button,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        city: '',
        units: 'metric',
      }),
    },
  },
  setup(props) {
    const { data, isFetching, refetch } = useCurrentWeatherQuery(
      props.settings.city,
      props.settings.units
    )

    const temperatureUnit = props.settings.units === 'metric' ? '°C' : '°F'

    const label = data.value?.name ?? props.settings.city
    const temperature = computed(() =>
      data.value?.main?.temp ? Math.round(data.value.main.temp) : ''
    )
    const weatherIcon = computed(() =>
      data.value?.weather ? getWeatherIcon(data.value?.weather[0].main) : ''
    )

    return {
      data,
      temperatureUnit,
      temperature,
      label,
      weatherIcon,
      isFetching,
      refetch,
    }
  },
})
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
  .temps {
    height: auto;
    display: flex;
    justify-items: center;
    align-items: center;
    gap: var(--padding);
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
      gap: calc(var(--padding) / 4);
    }
  }
}
</style>
