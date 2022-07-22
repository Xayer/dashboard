import { useQuery } from 'vue-query'
import { getCarDetails, getFuelStats } from '~/modules/apis/car'
import { CarDetails } from '~/types/car/carDetails'

export function useFetchCarDetails({
  gistGuid,
  enabled,
}: {
  gistGuid: string
  enabled: boolean
}) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<CarDetails>('carDetails', () => getCarDetails({ gistGuid }), {
      enabled,
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}

export function useFuelStats({
  gistGuid,
  enabled,
}: {
  gistGuid: string
  enabled: boolean
}) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<CarDetails>('fuelStats', () => getFuelStats({ gistGuid }), {
      enabled,
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
