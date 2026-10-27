import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

import { makeTheme } from '../src/lib/makeTheme'

type Declarations = Record<string, string>

// `selector { --name: value; }` blocks, the media query wrapper left aside.
const parseCss = (css: string): [string, Declarations][] =>
  Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g), ([, selector, body]) => [
    selector.trim(),
    Object.fromEntries(
      Array.from(body.matchAll(/(--[\w-]+):\s*([^;]+);/g), ([, name, value]) => [
        name,
        value
      ])
    )
  ])

const normalize = (value: unknown): string =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// twake-css 1.2.0 moves these ahead of the theme; twake-mui follows in
// linagora/twake-ui#204, which removes this list.
const AHEAD_OF_THE_THEME = new Set([
  'light --twake-palette-secondary-light',
  'light --twake-palette-action-selectedOpacity',
  'dark --twake-palette-action-selectedOpacity'
])

describe('twake-css/dist/vars.css', () => {
  const require = createRequire(import.meta.url)
  const vars = parseCss(
    readFileSync(require.resolve('@linagora/twake-css/dist/vars.css'), 'utf8')
  )

  const emitted: Record<'light' | 'dark', Declarations> = { light: {}, dark: {} }
  for (const sheet of makeTheme().generateStyleSheets()) {
    for (const [selector, decls] of Object.entries(sheet)) {
      if (!selector.includes('dark')) Object.assign(emitted.light, decls)
      if (!selector.includes('light')) Object.assign(emitted.dark, decls)
    }
  }

  it('declares every variable with the value TwakeMuiThemeProvider emits', () => {
    let checked = 0
    for (const [selector, decls] of vars) {
      // Sass drops the quotes: [data-theme=dark] and :root:not([data-theme=light]).
      const mode = /dark|:not\(/.test(selector) ? 'dark' : 'light'
      for (const [name, value] of Object.entries(decls)) {
        if (AHEAD_OF_THE_THEME.has(`${mode} ${name}`)) continue
        expect(normalize(emitted[mode][name]), `${name} in ${mode} mode`).toBe(
          normalize(value)
        )
        checked += 1
      }
    }
    expect(checked).toBeGreaterThan(200)
  })
})
