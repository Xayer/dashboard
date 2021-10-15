import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { priceHistory } from '~/modules/apis/pricerunner'
import { ProductPriceHistoryResponse } from '~/types/pricerunner/history'

export function parseProductInfo({
  lowest: lowestPrice,
  productId,
  currencyCode,
  history,
}: ProductPriceHistoryResponse) {
  const formattedPrice = Number.isNaN(lowestPrice)
    ? ''
    : new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: currencyCode,
      }).format(lowestPrice)
  return {
    value: formattedPrice,
    label: history ? history[0].merchantProductSku : productId,
    active: true,
  }
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
