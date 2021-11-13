export const getWeatherIcon = (weatherDescription?: string) => {
  if (!weatherDescription) {
    return ''
  }
  switch (weatherDescription) {
    case 'Thunderstorm':
      return 'cloud-lightning-rain'
    case 'Drizzle':
      return 'cloud-drizzle'
    case 'Rain':
      return 'cloud-rain'
    case 'Snow':
      return 'cloud-snow'
    case 'Clouds':
      return 'cloudy'
    case 'Clear':
      return 'sun'
    default:
      return ''
  }
}
