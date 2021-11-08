export interface HistoryEntity {
  merchantId: string
  merchantProductSku: string
  timestamp: string
  timestampEpoch: string
  price: number
  merchantName: string
}

export interface MerchantsEntity {
  id: number
  name: string
}

export interface ProductPriceHistoryResponse {
  productId: string
  lowest: number
  highest: number
  currencyCode: string
  history?: HistoryEntity[] | null
  merchants?: MerchantsEntity[] | null
}
