import querystring from 'querystring'
import {
  ForecastsResponse,
  ForecastsOnDate,
  mappedForecasts,
} from '@/types/weather'

const host = 'https://api.openweathermap.org'
const version: string = '2.5'
const baseUrl: string = `${host}/data/${version}`
const token: string = process.env.NUXT_ENV_WEATHER_API as string

export const currentWeather = async (
  city: string,
  units: string = 'metric'
) => {
  const CURRENT_WEATHER_ENDPOINT = `${baseUrl}/weather`

  const response = await fetch(
    `${CURRENT_WEATHER_ENDPOINT}/?${querystring.stringify({
      q: city,
      appid: token,
      units,
    })}`
  )
  return response.json()
}

export const forecast = async (
  city: string,
  units: string = 'metric'
): Promise<mappedForecasts> => {
  const FORECAST_ENDPOINT = `${baseUrl}/forecast`

  const response = await fetch(
    `${FORECAST_ENDPOINT}/?${querystring.stringify({
      q: city,
      appid: token,
      units,
    })}`
  )
  const responseData: ForecastsResponse = await response.json()
  return {
    ...responseData,
    list: responseData.list
      ? responseData.list.reduce(
          (acc: { [key: string]: ForecastsOnDate }, currentForecast) => {
            const timestamp = new Date(currentForecast.dt_txt)
            const forecastKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`

            if (!acc[forecastKey]) {
              acc[forecastKey] = {
                ...currentForecast,
                date: timestamp,
                hours: [],
              }
            }
            // if the current temp is larger than the existing one, replace the data - we want to see the warmest part of the day! :D
            if (currentForecast.main.temp > acc[forecastKey].main.temp) {
              acc[forecastKey] = {
                ...acc[forecastKey],
                ...currentForecast,
              }
            }
            acc[forecastKey].hours = [
              ...acc[forecastKey].hours,
              {
                ...currentForecast,
                date: timestamp,
              },
            ]

            return acc
          },
          {}
        )
      : {},
  }
}
