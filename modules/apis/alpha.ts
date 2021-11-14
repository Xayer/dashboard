import { StockPriceIntraDay } from '~/types/alpha-vantage/stock'
import { ValueProps } from '~/types/widgets/value'

export function parseStockPrice(response: StockPriceIntraDay) {
  const symbol = response['Meta Data']['2. Symbol']

  const prices = Object.values(response['Time Series (60min)'])
  const price = prices[0]['1. open']

  const formattedPrice = price
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price))
    : 0

  const timestamp = new Date(
    response['Meta Data']['3. Last Refreshed']
  ).toDateString()

  return {
    title: timestamp,
    state: 'success',
    value: formattedPrice,
    label: symbol,
  } as ValueProps
}

export async function getRecentStocks(stock: string, interval = '5min') {
  const response = await fetch(
    `https://www.alphavantage.co/query?${new URLSearchParams({
      function: 'TIME_SERIES_INTRADAY',
      symbol: stock,
      interval,
      apikey: process.env.NUXT_ENV_ALPHA_API as string,
      outputsize: 'compact',
    })}`
  )
  return parseStockPrice(await response.json())
}
