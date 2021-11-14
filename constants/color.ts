export const hexToRgb = (h: string) => {
  let r = '0'
  let g = '0'
  let b = '0'

  // 3 digits
  if (h.length === 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]

    // 6 digits
  } else if (h.length === 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }

  return { r: Number.parseInt(r), g: Number.parseInt(g), b: Number.parseInt(b) }
}

export const EnhanceColor = (normalized: number) => {
  if (normalized > 0.04045) {
    return Math.pow((normalized + 0.055) / (1.0 + 0.055), 2.4)
  } else {
    return normalized / 12.92
  }
}

// code credit goes to: https://gist.github.com/NinjaBunny9000/fa81c231a9c205b5193bb76c95aeb75f
export const rgbToXy = (r: number, g: number, b: number) => {
  const rNorm = r / 255.0
  const gNorm = g / 255.0
  const bNorm = b / 255.0

  const rFinal = EnhanceColor(rNorm)
  const gFinal = EnhanceColor(gNorm)
  const bFinal = EnhanceColor(bNorm)

  const X = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109
  const Y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598
  const Z = rFinal * 0.0 + gFinal * 0.053077 + bFinal * 1.035763

  if (X + Y + Z === 0) {
    return [0, 0]
  } else {
    const xFinal = X / (X + Y + Z)
    const yFinal = Y / (X + Y + Z)

    return [xFinal, yFinal]
  }
}

export const rgbToHsl = ({
  r: red,
  g: green,
  b: blue,
}: {
  r: number
  g: number
  b: number
}) => {
  let { r, g, b } = {
    r: Number(red),
    g: Number(green),
    b: Number(blue),
  }

  // Make r, g, and b fractions of 1
  r /= 255
  g /= 255
  b /= 255

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  // Calculate hue
  // No difference
  if (delta === 0) h = 0
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2
  // Blue is max
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  // Make negative hues positive behind 360°
  if (h < 0) h += 360

  // Calculate lightness
  l = (cmax + cmin) / 2

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}
