import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { addressBalance, etherPrice } from '~/modules/apis/etherscan'
import { AddressBalance } from '~/types/etherscan/address'
import { EtherPrice } from '~/types/etherscan/stats'
import { ValueProps } from '~/types/widgets/value'

export function parseAccountBalance(
  { result }: AddressBalance,
  { result: etherPriceResult }: EtherPrice
) {
  const parsedPrice = Number.parseFloat(result)

  const calculatedEtherValue = Number.isNaN(parsedPrice)
    ? 0
    : parsedPrice / 1000000000000000000
  const usd = etherPriceResult
    ? Number.parseFloat(etherPriceResult?.ethusd)
    : NaN
  const convertedPrice = Number.isNaN(usd)
    ? ''
    : new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'USD',
      }).format(usd / calculatedEtherValue)
  return {
    value: convertedPrice,
    label: `${calculatedEtherValue} ETH`,
    state: 'default',
  } as ValueProps
}

export function useFetchAddressBalance(address: string) {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<AddressBalance>(
      [address, 'addressBalance'],
      () => addressBalance(address),
      {
        enabled: true,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}

export function useFetchEtherPrice() {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<EtherPrice>('etherUsdPrice', () => etherPrice(), {
      enabled: true,
      staleTime: minutes(5),
    })

  return { isLoading, isError, isFetching, data, error, refetch }
}
