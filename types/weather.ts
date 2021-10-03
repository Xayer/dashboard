/* eslint-disable camelcase */

export interface Units {
  units: 'metric' | 'imperial'
}

export interface WeatherWidgetSettings extends Units {
  city: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
  temp_kf: number
}

export interface WeatherEntity {
  id: number
  main: string
  description: string
  icon: string
}

export interface Clouds {
  all: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Sys {
  pod: string
}

export interface Rain {
  [key: string]: number
}

export interface Coord {
  lat: number
  lon: number
}

export interface Forecast {
  dt: number
  main: Main
  weather?: WeatherEntity[] | null
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number
  sys: Sys
  dt_txt: string
  rain?: Rain | null
  date?: Date
}

export interface CurrentWeatherResponse {
  coord: Coord
  weather?: WeatherEntity[] | null
  base: string
  main: Main
  visibility: number
  wind: Wind
  rain: Rain
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface City {
  id: number
  name: string
  coord: Coord
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface ForecastsResponse {
  cod: string
  message: number
  cnt: number
  list?: Forecast[] | null
  city: City
}

export interface ForecastsOnDate extends Forecast {
  date: Date
  hours: Forecast[]
}

export interface mappedForecasts extends Omit<ForecastsResponse, 'list'> {
  list: {
    [key: string]: ForecastsOnDate
  }
}
