import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { getCarDetails } from '~/modules/apis/car'
import { carDetails } from '~/types/car/carDetails'

export function useFetchCarDetails() {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<carDetails>('carDetails', () => getCarDetails(), {
      enabled: true,
      staleTime: minutes(5),
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
