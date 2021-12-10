import { proxyUrl } from '~/constants/proxy'

const baseUrl = `${proxyUrl}https://www.pricerunner.dk/public/`

export const priceHistory = async (productId: string, country = 'dk') => {
  const priceHistoryEndpoint = `${baseUrl}pricehistory/product/${productId}/${country}`

  const response = await fetch(
    `${priceHistoryEndpoint}?${new URLSearchParams({
      filter: 'national',
      merchantId: '',
      selectedInterval: 'THREE_MONTHS',
    })}`
  )
  return await response.json()

  // return mockedResponse
}
