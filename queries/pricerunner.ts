import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { priceHistory } from '~/modules/apis/pricerunner'
import { ProductPriceHistoryResponse } from '~/types/pricerunner/history'
import { ValueProps } from '~/types/widgets/value'

export function parseProductInfo({
  productId,
  currencyCode,
  history,
}: ProductPriceHistoryResponse) {
  const latestPriceInfo = history[history.length - 1]

  const formattedPrice =
    Number.isNaN(latestPriceInfo.price) || !currencyCode
      ? ''
      : new Intl.NumberFormat('da-DK', {
          style: 'currency',
          currency: currencyCode,
        }).format(latestPriceInfo.price)

  const timestamp = new Date(latestPriceInfo.timestamp)
  return {
    value: latestPriceInfo ? formattedPrice : '',
    label: latestPriceInfo.merchantProductSku ?? productId,
    title:
      timestamp && latestPriceInfo
        ? `${latestPriceInfo.merchantName} (${timestamp.toLocaleDateString()})`
        : '',
    state: 'default',
    url: `//pricerunner.dk/pl/00-${productId}`,
  } as ValueProps
}

export function useFetchProductInfo(productId: string, country = 'dk') {
  const { isLoading, isError, isFetching, data, error, refetch } =
    useQuery<ProductPriceHistoryResponse>(
      [productId, 'productInfo'],
      () => priceHistory(productId, country),
      {
        enabled: true,
        staleTime: minutes(5),
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch }
}
