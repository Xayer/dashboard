import { githubToken } from './github'
import { CarDetails, FuelStats } from '~/types/car/carDetails'

const baseUrl = process.env.NUXT_ENV_GIST_API_URL

export const carDetailsGuidStorageKey = 'car-details-gist'

export const getCarDetails = async ({ gistGuid }: { gistGuid: string }) => {
  if (!gistGuid) {
    throw new Error('missing gistUuid')
  }

  const token = githubToken()

  if (!token) {
    throw new Error('missing token')
  }

  const response = await fetch(`${baseUrl}/${gistGuid}/car-details`, {
    headers: {
      Authorization: token,
    },
    method: 'GET',
  })

  return (await response.json()) as CarDetails
}

export const createOrUpdateCarDetails = async ({
  gistGuid,
  details,
}: {
  gistGuid?: string
  details: CarDetails
}) => {
  const token = githubToken()

  if (!token) {
    throw new Error('missing token')
  }

  const response = await fetch(
    `${baseUrl}${gistGuid ? `/${gistGuid}` : ''}/car-details`,
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: gistGuid ? 'PATCH' : 'POST',
      body: JSON.stringify(details, undefined, 2),
    }
  )

  return (await response.json()) as CarDetails
}

export const getFuelStats = async ({ gistGuid }: { gistGuid: string }) => {
  if (!gistGuid) {
    throw new Error('missing gistUuid')
  }

  const token = githubToken()

  if (!token) {
    throw new Error('missing token')
  }

  const response = await fetch(`${baseUrl}/${gistGuid}/fuel-stats`, {
    headers: {
      Authorization: token,
    },
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('not found')
  }

  return (await response.json()) as FuelStats
}

export const createOrUpdateFuelStats = async ({
  gistGuid,
  stats,
  createNew = false,
}: {
  gistGuid?: string
  stats: FuelStats
  createNew: boolean
}) => {
  const token = githubToken()

  if (!token) {
    throw new Error('missing token')
  }

  const response = await fetch(
    `${baseUrl}${gistGuid ? `/${gistGuid}` : ''}/fuel-stats`,
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      method: createNew ? 'POST' : 'PATCH',
      body: JSON.stringify(stats, undefined, 2),
    }
  )

  return (await response.json()) as FuelStats
}
