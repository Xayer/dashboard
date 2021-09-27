/* eslint-disable camelcase */
export interface GroupState {
  all_on: boolean
  any_on: boolean
}

export interface Action {
  on: boolean
  bri: number
  hue: number
  sat: number
  effect: string
  xy: number[]
  ct: number
  alert: string
  colormode: string
}

export interface HueGroup {
  name: string
  lights: string[]
  sensors: any[]
  type: string
  state: GroupState
  recycle: boolean
  class: string
  action: Action
}
