const baseUrl = 'https://api.etherscan.io/api'

export const addressBalance = async (address: string) => {
  const response = await fetch(
    `${baseUrl}?${new URLSearchParams({
      module: 'account',
      action: 'balance',
      address,
      apikey: process.env.NUXT_ENV_ETHERSCAN_API as string,
    })}`
  )
  return response.json()
}

export const etherPrice = async () => {
  const response = await fetch(
    `${baseUrl}?${new URLSearchParams({
      module: 'stats',
      action: 'ethprice',
      apikey: process.env.NUXT_ENV_ETHERSCAN_API as string,
    })}`
  )
  return response.json()
}
