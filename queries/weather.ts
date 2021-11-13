import { useQuery } from 'vue-query'
import { currentWeather, forecast } from '~/modules/apis/weather'
import { CurrentWeatherResponse, mappedForecasts } from '~/types/weather'
import { minutes } from '~/constants/time'

export function useCurrentWeatherQuery(city: string, units = 'metric') {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<CurrentWeatherResponse>(
      [city, 'currentWeather'],
      () => currentWeather(city, units),
      {
        enabled: true,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}

export function useWeatherForecastQuery(city: string, units = 'metric') {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<mappedForecasts>([city, 'forecast'], () => forecast(city, units), {
      enabled: true,
      staleTime: minutes(10),
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
