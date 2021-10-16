import { useQuery } from 'vue-query'
import { seconds } from '~/constants/time'
import { getDevices } from '~/modules/apis/hue'
import { Devices } from '~/types/hue'

export function useFetchDevices(enabled: boolean) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<Devices>(['hue', 'devices'], () => getDevices(), {
      enabled,
      staleTime: seconds(5),
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
