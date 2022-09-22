export type CarDetails = {
  tankSize: number
  name: string
}

export type FuelStat = {
  drivenDistance: number
  refillAmount: number
  refillDate: string
}

export type FuelStats = FuelStat[]
