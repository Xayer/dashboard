<template>
  <client-only>
    <div>
      <div v-if="weatherData" class="wrapper">
        <transition-group name="fade">
          <div
            v-if="selectedDay"
            key="hours"
            class="overlay"
            @click="selectedDayIndex = null"
          >
            <h2>
              {{
                selectedDay.date.toLocaleString('default', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              }}
              <i class="bi bi-x-circle" @click="selectedDayIndex = null"></i>
            </h2>
            <div class="forecasts hours" :class="display">
              <div
                v-for="hourlyForecast in selectedDay.hours"
                :key="hourlyForecast.dt"
                class="day"
              >
                <div class="icon-temp">
                  <i
                    :class="`icon bi bi-${weatherIcon(
                      hourlyForecast.weather[0].main
                    )}`"
                  ></i>
                  <span v-if="hourlyForecast.main" class="temp"
                    >{{ Math.round(hourlyForecast.main.temp)
                    }}{{ temperatureUnit }}</span
                  >
                </div>

                <div class="day-date">
                  <h4 class="day-name">
                    {{
                      hourlyForecast.date.toLocaleTimeString([], {
                        hour: '2-digit',
                      })
                    }}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div
            key="forecasts"
            class="wrapper"
            :class="!!selectedDay ? 'blur' : undefined"
          >
            <h2 v-if="weatherData.city && showTitle">
              {{ weatherData.city.name }}
            </h2>
            <div v-if="weatherData.list" class="forecasts" :class="display">
              <div
                v-for="(forecastDate, forecastDateIndex) in weatherData.list"
                :key="forecastDate.date.toString()"
                class="day"
                @click="selectedDayIndex = forecastDateIndex"
              >
                <div class="icon-temp">
                  <i
                    :class="`icon bi bi-${weatherIcon(
                      forecastDate.weather[0].main
                    )}`"
                  ></i>
                  <span v-if="forecastDate.main" class="temp"
                    >{{ Math.round(forecastDate.main.temp)
                    }}{{ temperatureUnit }}</span
                  >
                </div>

                <div class="day-date">
                  <h4 class="day-name">
                    {{
                      forecastDate.date.toLocaleString('default', {
                        weekday: 'long',
                      })
                    }}
                  </h4>
                  <span class="date">{{
                    forecastDate.date.toLocaleString('default', {
                      month: 'long',
                      day: 'numeric',
                    })
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
      <Button
        class="refresh-button"
        :class="{ primary: isFetching }"
        @click="refetch"
        ><i class="bi bi-arrow-repeat" :class="{ spin: isFetching }"></i
      ></Button>
    </div>
  </client-only>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getWeatherIcon } from '@/constants/weather'
import { Button } from '@/components/atoms'
import { useWeatherForecastQuery } from '~/queries/weather'

export default defineComponent({
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
    dimensions: {
      type: Object,
      default: () => ({
        w: 0,
        h: 0,
      }),
    },
  },
  setup(props) {
    const { data, isFetching, refetch } = useWeatherForecastQuery(
      props.settings.city,
      props.settings.units
    )

    const temperatureUnit = props.settings.units === 'metric' ? '°C' : '°F'

    const display =
      !(props.dimensions.w === props.dimensions.h) &&
      (props.dimensions.w > 3 || props.dimensions.w % props.dimensions.h === 0)
        ? 'columns'
        : 'rows'

    const showTitle = computed(() => {
      if (!props.dimensions) {
        return false
      }
      const { w, h } = props.dimensions
      return h >= 3 || w >= 3
    })

    const weatherIcon = (weather: string) => {
      return weather ? getWeatherIcon(weather) : ''
    }

    const selectedDayIndex = ref('')

    const selectedDay = computed(() =>
      selectedDayIndex.value && data.value?.list[selectedDayIndex.value]
        ? data.value?.list[selectedDayIndex.value]
        : null
    )

    return {
      weatherData: data,
      temperatureUnit,
      showTitle,
      selectedDayIndex,
      selectedDay,
      display,
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
  flex-direction: column;
  position: relative;
  z-index: 1;
  transition: 250ms ease-out;
}

.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  transition: var(--transition);
  opacity: 0.85;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    content: '';
    transition: var(--transition);
  }
  z-index: 2 !important;
}
.open,
.close {
  cursor: pointer;
}

.blur {
  filter: blur(var(--blur));
  opacity: 0.25;
}
.forecasts {
  display: flex;
  width: 100%;
  height: 100%;
  // margin: calc(var(--padding) * -1);
  justify-content: space-between;
  align-items: center;
  .day-name {
    text-transform: capitalize;
  }
  &.columns {
    display: flex;
    justify-content: center;
    align-items: center;
    .day {
      height: 100%;
      width: 75%;
      padding: 0 1%;
      text-align: center;
      box-shadow: inset -1px 0px 0px var(--bg-color),
        1px 0px 0px var(--bg-color);
      &:last-of-type {
        box-shadow: none;
      }
      .icon-temp {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon {
          font-size: 48px;
          margin: 0;
        }
        .temp {
          font-size: 25px;
          margin-left: 10px;
        }
      }
      .day-name,
      .date {
        font-size: 12px;
      }

      @media screen and (min-width: 1400px) {
        padding: 0 2%;
        .temp {
          font-size: 32px;
          margin-left: 12px;
        }
        .icon {
          font-size: 32px;
        }
      }
    }
  }
  &.rows {
    flex-direction: column;
    height: 100%;
    .day {
      display: grid;
      grid-template-columns: 70px 1fr;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      box-shadow: inset 0px -1px 0px var(--bg-color);
      &:last-of-type {
        box-shadow: none;
      }
      .date {
        text-align: left;
      }
      .day-name {
        flex-grow: 1;
      }
      .temp {
        font-weight: bold;
      }
      .icon-temp {
        display: flex;
        justify-content: space-between;
        font-size: 23px;
        text-align: right;
      }
      .day-date {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  &.hours {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    &.columns {
      grid-template-columns: repeat(8, 1fr);
      width: 100%;
      .day {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      .icon {
        font-size: 25px !important;
      }
    }
  }
}
</style>
