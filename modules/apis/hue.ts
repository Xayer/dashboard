import { AxiosResponse } from 'axios'
import API, { get } from './client'
import { Devices } from '@/types/hue'
import { hueTokenStorageKey, hueBridgeAddressStorageKey } from '~/constants/hue'

const protocol: string = 'http://'
const baseUrl: string = '/api'
const appName = 'iot-dashboard'
const device = 'dashboard'

export default class HueAPI extends API {
  private token!: string

  constructor(bridgeAddress: string) {
    super({
      protocol,
      host: bridgeAddress,
      baseURL: baseUrl,
      version: '',
    })
  }

  registerToken() {
    return new Promise((resolve, reject) => {
      if (this.findExistingToken()) {
        resolve(this.token)
      }
      this.post('', {
        devicetype: `${appName}#${device}`,
      })
        .then((response: AxiosResponse) => {
          if (
            'success' in response.data[0] &&
            'username' in response.data[0].success
          ) {
            localStorage.setItem(
              hueTokenStorageKey,
              response.data[0].success.username
            )
            this.token = localStorage.hue
            resolve(response.data[0].success.username)
          }

          reject(response.data[0].error)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })
  }

  findExistingToken() {
    if (!process.browser) {
      return
    }
    if (
      !this.token &&
      localStorage &&
      typeof localStorage.getItem(hueTokenStorageKey) !== 'undefined'
    ) {
      this.token = localStorage.getItem(hueTokenStorageKey) as string
    }
    // eslint-disable-next-line no-extra-boolean-cast
    return !!(
      this.token &&
      typeof this.token !== 'undefined' &&
      this.token !== 'undefined'
    )
      ? this.token
      : false
  }

  getDevices() {
    return new Promise((resolve, reject) => {
      if (!this.findExistingToken()) {
        reject(Error('token missing'))
      }
      try {
        this.get(`${this.token}`)
          .then((response: AxiosResponse<Devices>) => {
            resolve(response.data)
          })
          .catch((error: Error) => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  toggleLight(uniqueid: string, on: boolean, colour?: Array<number>) {
    return new Promise(async (resolve, reject) => {
      if (!this.findExistingToken()) {
        reject(Error('token missing'))
      }

      const toggleData: { on: boolean; colour?: Array<number> } = {
        on,
      }

      if (colour) {
        toggleData.colour = colour
      }

      await this.put(`${this.token}/lights/${uniqueid}`, 'state', toggleData)
        .then((response: AxiosResponse<Devices>) => {
          resolve(response.data)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })
  }

  lightOn(uniqueid: string) {
    this.toggleLight(uniqueid, true)
  }

  lightOff(uniqueid: string) {
    this.toggleLight(uniqueid, false)
  }
}

function getHueEndpoint() {
  const host = localStorage.getItem(hueBridgeAddressStorageKey)
  if (!host) {
    throw new Error('unable to find hue host')
  }
  return `${protocol}${host}${baseUrl}`
}

function getToken() {
  const token = localStorage.getItem(hueTokenStorageKey)
  if (!token) {
    throw new Error('unable to find hue token')
  }
  return token
}

export function validate() {
  const host = getHueEndpoint()
  return get<Devices>(host)
}

export function getDevices() {
  const host = getHueEndpoint()
  const token = getToken()
  return get<Devices>(`${host}/${token}`)
}
