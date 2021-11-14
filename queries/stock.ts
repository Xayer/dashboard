import { useQuery } from 'vue-query'
import { minutes } from '~/constants/time'
import { getRecentStocks } from '~/modules/apis/alpha'
import { StockPriceDaily } from '~/types/alpha-vantage/stock'

export function useFetchStockPrice(stock: string, interval = '5min') {
  const { isLoading, isError, isFetching, isSuccess, data, error, refetch } =
    useQuery<StockPriceDaily>(
      [stock, `stockPrice-interval-${interval}`],
      () => getRecentStocks(stock, interval),
      {
        enabled: true,
        staleTime: minutes(5),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1,
      }
    )

  return { isLoading, isError, isFetching, data, error, refetch, isSuccess }
}
