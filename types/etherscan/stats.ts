export type EtherPrice = {
  status: string
  message: string
  result: {
    ethbtc: string
    // eslint-disable-next-line camelcase
    ethbtc_timestamp: string
    ethusd: string
    // eslint-disable-next-line camelcase
    ethusd_timestamp: string
  }
}
