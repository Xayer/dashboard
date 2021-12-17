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
  const yesterdaysPriceInfo = history[history.length - 2]

  const diff = latestPriceInfo.price - yesterdaysPriceInfo.price
  const diffPercentage = (diff * 100) / latestPriceInfo.price

  const formattedPrice =
    Number.isNaN(latestPriceInfo.price) || !currencyCode
      ? ''
      : new Intl.NumberFormat('da-DK', {
          style: 'currency',
          currency: currencyCode,
        }).format(latestPriceInfo.price)

  const formattedDiff = diff
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
      }).format(Number(diff))
    : 0

  return {
    value: latestPriceInfo ? formattedPrice : '',
    label:
      diffPercentage !== 0
        ? `${formattedDiff} (${diffPercentage.toFixed(2)}%)`
        : '',
    title: productId,
    state:
      diffPercentage === 0
        ? 'default'
        : diffPercentage >= 0
        ? 'success'
        : 'danger',
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
