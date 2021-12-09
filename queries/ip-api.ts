// ip-api.com/json/

import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { IpInformation } from '~/types/ip-api/ipInformation'
import { ipInformation } from '~/modules/apis/ip-api'

export function useFetchIpInfo() {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<IpInformation>('ipInformation', () => ipInformation(), {
      enabled: true,
      staleTime: minutes(10),
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
