import { describe, expect, it } from 'vitest'

import { getInitials } from '../src/components/Avatar/helpers'

describe('getInitials', () => {
  it('takes the first letter of the first and last names', () => {
    expect(getInitials('Alice Martin', 'alice@example.com')).toBe('AM')
    expect(getInitials('Alice B. Martin', 'alice@example.com')).toBe('AM')
  })

  // The first "Élise" is decomposed ("E" and U+0301), the second composed
  it('keeps an accent with its letter, composed or decomposed', () => {
    expect(getInitials('Élise Dupont', 'elise@example.com')).toBe('ÉD')
    expect(getInitials('Élise Dupont', 'elise@example.com')).toBe('ÉD')
    expect(getInitials('Zoé', 'zoe@example.com')).toBe('ZO')
  })

  it('keeps a flag or an emoji with its skin tone whole', () => {
    expect(getInitials('🇫🇷 France', 'fr@example.com')).toBe('🇫🇷F')
    expect(getInitials('👍🏽 Alice', 'alice@example.com')).toBe('👍🏽A')
    expect(getInitials('👨‍👩‍👧', 'family@example.com')).toBe('👨‍👩‍👧')
  })

  it('falls back on the address without a name, and has one letter for one', () => {
    expect(getInitials('', 'alice@example.com')).toBe('AL')
    expect(getInitials('', '')).toBe('')
    expect(getInitials('A', 'a@example.com')).toBe('A')
  })
})
