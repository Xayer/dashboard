const baseUrl = 'https://api.etherscan.io/api'

export const addressBalance = async (address: string) => {
  const response = await fetch(
    `${baseUrl}?${new URLSearchParams({
      module: 'account',
      action: 'balance',
      address,
      apikey: 'DKDHB344FMFXF3IG19EE26MVXBEMKEQZ4B',
    })}`
  )
  return response.json()
}

export const etherPrice = async () => {
  const response = await fetch(
    `${baseUrl}?${new URLSearchParams({
      module: 'stats',
      action: 'ethprice',
      apikey: 'DKDHB344FMFXF3IG19EE26MVXBEMKEQZ4B',
    })}`
  )
  return response.json()
}
