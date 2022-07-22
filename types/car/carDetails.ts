export type CarDetails = {
  tankSize: number
  name: string
}

type FuelStat = {
  drivenDistance: number
  refillAmount: number
}

export type FuelStats = FuelStat[]
