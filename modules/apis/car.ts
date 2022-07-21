import { githubToken } from './github'
import { carDetails } from '~/types/car/carDetails'

const baseUrl = process.env.NUXT_ENV_GITHUB_API_URL

export const carDetailsGuidStorageKey = 'car-details-gist'
const gistGuid = () =>
  process.browser
    ? '488c52dd87d576305f6d6cd1a931841e'
    : // (localStorage.getItem(carDetailsGuidStorageKey) as string)
      null

export const getCarDetails = async () => {
  const guid = gistGuid()
  if (!guid) {
    throw new Error('missing gistUuuid')
  }

  const token = githubToken()

  if (!token) {
    throw new Error('missing token')
  }
  // 488c52dd87d576305f6d6cd1a931841e

  const response = await fetch(`${baseUrl}/${guid}`, {
    headers: {
      Authorization: `token ${process.browser ? token : ''}`,
    },
    method: 'GET',
  })

  return (await response.json()) as carDetails
}
