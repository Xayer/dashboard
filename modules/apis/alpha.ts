import { StockPriceDaily } from '~/types/alpha-vantage/stock'
import { ValueProps } from '~/types/widgets/value'

export function parseStockPrice(response: StockPriceDaily) {
  if (!response['Meta Data']) {
    return {
      title: 'invalid data',
      state: 'danger',
      value: '0',
      label: 'API unavailable',
    } as ValueProps
  }
  const symbol = response['Meta Data']['2. Symbol']

  const prices = Object.values(response['Time Series (Daily)'])
  const price = Number.parseFloat(prices[0]['4. close'])
  const yesterdayPrice = Number.parseFloat(prices[1]['4. close'])

  const diff = price - yesterdayPrice
  const diffPercentage = (diff * 100) / yesterdayPrice

  const formattedPrice = price
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price))
    : 0

  const formattedDiff = diff
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(Number(diff))
    : 0

  const timestamp = new Date(
    response['Meta Data']['3. Last Refreshed']
  ).toLocaleDateString()

  return {
    title: `${symbol} - ${timestamp}`,
    state: diffPercentage >= 0 ? 'success' : 'danger',
    value: formattedPrice,
    label: `${formattedDiff} (${diffPercentage.toFixed(2)}%)`,
  } as ValueProps
}

export async function getRecentStocks(stock: string, _interval = '5min') {
  const response = await fetch(
    `https://www.alphavantage.co/query?${new URLSearchParams({
      // function: 'TIME_SERIES_INTRADAY',
      function: 'TIME_SERIES_DAILY',
      symbol: stock,
      // interval,
      apikey: process.env.NUXT_ENV_ALPHA_API as string,
      outputsize: 'compact',
    })}`
  )
  return await response.json()
}
