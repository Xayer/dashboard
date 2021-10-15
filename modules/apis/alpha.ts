import API from './client'

export default class AlphaVantage extends API {
  private apiKey = process.env.NUXT_ENV_ALPHA_API

  constructor() {
    super({
      protocol: 'https://',
      host: 'www.alphavantage.co',
      baseURL: '',
      version: 'query',
    })
  }

  getRecentStocks() {
    return this.get(
      `?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${this.apiKey}&outputsize=compact`
    )
  }
}
