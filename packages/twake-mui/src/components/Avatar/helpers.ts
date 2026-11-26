import { darken, lighten } from '@mui/material/styles'

export const supportedColors = [
  'sunrise',
  'downy',
  'sugarCoral',
  'pinkBonnet',
  'blueMana',
  'nightBlue',
  'snowPea',
  'pluviophile',
  'cornflower',
  'paleGreen',
  'moonBlue'
] as const

export const colorMapping: Record<string, string> = {
  sunrise: 'linear-gradient(136deg, #F8D280 14.84%, #F2AC69 96.03%)',
  downy: 'linear-gradient(136deg, #81EAD4 14.84%, #62C6B7 96.03%)',
  sugarCoral: 'linear-gradient(136deg, #F19E86 14.84%, #F95967 96.03%)',
  pinkBonnet: 'linear-gradient(136deg, #E4ABF0 14.84%, #D96EED 96.03%)',
  blueMana: 'linear-gradient(136deg, #85D9FD 14.84%, #2A9EFC 96.03%)',
  nightBlue: 'linear-gradient(136deg, #80AEFF 39.32%, #883DFE 96.03%)',
  snowPea: 'linear-gradient(136deg, #BDF4A1 14.84%, #52CE64 96.03%)',
  pluviophile: 'linear-gradient(136deg, #A1D6F4 14.84%, #52CEC2 96.03%)',
  cornflower: 'linear-gradient(135deg, #86D9D3 0%, #1CCFB4 100%)',
  paleGreen: 'linear-gradient(135deg, #E2FA17 0%, #75D8CB 100%)',
  moonBlue: 'linear-gradient(136deg, #6DCFFF 14.84%, #3D88F8 96.03%)'
}

const colors = supportedColors.filter(Boolean)

const makeKey = (colors: readonly string[], name: string): number => {
  return (
    Array.from(name.toUpperCase())
      .map(letter => letter.charCodeAt(0))
      .reduce((sum, number) => sum + number, 0) % colors.length
  )
}

/**
 * Generate color from name
 * @param name - Name string to generate color from
 * @returns Color key from supportedColors
 */
export const nameToColor = (name: string = ''): string | undefined => {
  if (!name) return undefined
  const key = makeKey(colors, name)
  return colors[key]
}

const segmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

// A letter with its accents, a whole emoji (skin tone, family, flag)
const firstCharacters = (text: string, count: number): string => {
  // Without Intl.Segmenter (Firefox < 125) a letter keeps its accents but an
  // emoji sequence may be cut
  const characters =
    segmenter === null
      ? (text.match(/\P{M}\p{M}*|\p{M}+/gu) ?? [])
      : Array.from(segmenter.segment(text), ({ segment }) => segment)
  return characters.slice(0, count).join('')
}

/**
 * Extract initials from a name (first letter of first name + first letter of last name)
 * If only one name is provided, returns first 2 letters
 * Falls back to first 2 letters of email local-part if no name provided
 * A character is never cut (an accent, an emoji), and the initials are the
 * same whether the accents are composed or not
 * @param name - Display name
 * @param email - Email address (fallback source for initials)
 * @returns Uppercase initials string
 */
export const getInitials = (name: string, email: string): string => {
  const initials = (): string => {
    if (!name || name === email) {
      return firstCharacters(email.split('@')[0], 2)
    }
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return firstCharacters(parts[0], 2)
    return (
      firstCharacters(parts[0], 1) + firstCharacters(parts[parts.length - 1], 1)
    )
  }
  return initials().toUpperCase().normalize('NFC')
}

/**
 * Make an avatar gradient from a color, as the supported colors are
 * @param color - Hex color, as `#RRGGBB`
 * @returns CSS linear gradient
 */
export const colorToGradient = (color: string): string =>
  `linear-gradient(136deg, ${lighten(color, 0.17)} 14.84%, ${darken(color, 0.15)} 96.03%)`
