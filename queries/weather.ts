import { useQuery } from 'vue-query'
import { currentWeather } from '~/modules/apis/weather'
import { CurrentWeatherResponse } from '~/types/weather'
import { seconds } from '~/constants/time'

export function useCurrentWeatherQuery(city: string, units = 'metric') {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<CurrentWeatherResponse>(
      [city, 'currentWeather'],
      () => currentWeather(city, units),
      {
        enabled: true,
        staleTime: seconds(10),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}
