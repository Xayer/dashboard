import { HueLight } from '@/types/hue/light'
import { HueGroup } from '@/types/hue/group'

export interface Devices {
  config: Object
  groups: {
    [key: string]: HueGroup
  }
  lights: {
    [key: string]: HueLight
  }
  resourcelinks: Object
  rules: Object
  scenes: Object
  schedules: Object
  sensors: Object
}
