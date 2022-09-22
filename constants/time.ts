export const seconds = (seconds: number) => 1000 * seconds
export const minutes = (minutes: number) => 1000 * 60 * minutes
const milisecondsPerDay = 1000 * 60 * 60 * 24

export function dateDiffInDays(from: string, to: string) {
  const dateFrom = Date.parse(from)
  const dateTo = Date.parse(to)

  return Math.floor((dateTo - dateFrom) / milisecondsPerDay)
}
