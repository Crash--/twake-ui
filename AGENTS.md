# AGENTS.md - Twake UI Monorepo

## Quick Commands

```bash
# Install dependencies
npm ci

# Build all packages
npm run build

# Lint all packages
npm run lint

# Lint specific package
npx rs lint packages/twake-mui/src

# Format all files
npm run fmt

# Test dry-run release (safe, no publish)
npm run release:dry
```

## Critical Rules

**⚠️ NEVER run `npm run release` locally** - it publishes to npm for real. Releases only happen via GitHub Actions on merge to main.

**⚠️ Always use Node 24** - specified in `.nvmrc`. Other versions will fail.

## Architecture

- **Monorepo**: npm workspaces with independent versioning
- **Packages location**: `packages/*` (currently `twake-css`, `twake-mui` and
  `twake-icons`)
- **Package naming**: All packages use `@linagora/` scope
- **Build output**: Each package outputs to `dist/` (TypeScript compilation)
- **Dependency versions**: exact versions for external packages
  (`npm install --save-exact`), caret ranges for internal ones (`@linagora/*`,
  `cozy-*`, `twake-*`); `peerDependencies` keep their ranges. See "Dependency
  versions" in the README.

## Colors

Every Twake app reads its colours from this repo, so a colour changed here
changes everywhere, in light and dark mode. These rules apply to the code you
write; older literals (avatar gradients, `ColorList`, some overrides) predate
them.

- Write a new colour value in the base palette,
  `packages/twake-css/palette.json`, and nowhere else.
- Map palette values to semantic roles in both
  `packages/twake-mui/src/lib/makePalette.ts` and
  `packages/twake-css/src/vars.scss`, for each mode. `test/vars.test.ts` in
  twake-mui only checks that each variable of `vars.css` matches the theme: a
  role missing from `vars.scss` passes, so write both sides yourself.
- In components, stories and apps, use roles only: `theme.vars.palette.*`
  (`primary.main`, `text.secondary`, `action.hover`, `divider`, `border.main`…)
  or the `--twake-palette-*` CSS variables. A hex or `rgba()` literal there
  escapes the palette and the dark mode.
- To add a colour, add a palette entry and a role that reads it. Name them like
  the existing ones: a PascalCase ramp with numeric keys in `palette.json`,
  camelCase roles with `light`, `main`, `dark` and `contrastText` when it is a
  colour family.
- Derive a new hover, selected, focus or disabled tint from the `action.*`
  opacity tokens (`theme.alpha(color, theme.vars.palette.action.selectedOpacity)`),
  so state tints follow one value.

## Conventions

These rules apply to the code you write; older code predates some of them.

### API and scope

- When cozy-ui already has an API for the need, reuse it (prop name, values,
  default) and extend it so existing values keep their meaning. Open the
  matching change on cozy-ui in its own PR, for the apps still on it.
- Add a variant to a component only when more than one screen uses it, or when
  the Figma library makes it a component of its own. A look for a single screen
  comes from the designer as an asset (an illustration) passed in as is.
- Build on what MUI and MUI X already do, themed here (overrides,
  `defaultProps`, a provider), before writing a component of your own. A
  wrapper earns its place only for a real composition (a date and a time
  sharing one value).
- Put a context-based library in `peerDependencies`, so the app and twake-mui
  share one copy, and mount its provider apart from `ThemeProvider`, so apps
  that do not use it do not load it. Make it optional (`peerDependenciesMeta`)
  only when its provider has its own subpath export: from the `"."` entry, apps
  without the library would rely on tree-shaking. This is the target for
  `@mui/x-date-pickers` and `date-fns`, today in `devDependencies` with no
  provider.
- Fix a bug everywhere it occurs: move the fix into a shared helper and call it
  from each place.

### Code

- Default-export each new component, and export it from its own file in
  `src/index.ts` rather than through another component's `index.tsx`.
- Export only what other files import.
- Put callback props (`onX`) last, grouped, in the props interface, the
  destructuring and every call site.
- Name the variant classes the overrides target bare (`.square`, `.small`).
- Hold a class name repeated in a component's styles in a constant, like
  `ICON_CLASS_NAME` in `Empty`, so a typo cannot break the look silently.
- Read `event.currentTarget` before an `await`, and pass the element to a
  callback that runs after it.
- Set `aria-hidden="true"` on decorative icons in every render branch.

### Comments

- Comment a constraint the code cannot show (why a lookup goes through the
  element's frame, why a `minWidth`). Delete a comment that restates the code.

### Tests

- Test behaviour that can break. Leave rendering (class names, which branch
  renders, props passed through to MUI such as `open`, `onClose`, `aria-modal`)
  to the Argos stories.
- In jsdom, `ownerDocument.defaultView` is `window`: mount a test of
  frame-dependent code in an iframe, so it fails if the code uses the app's
  window.
- Restore every global you mock (`navigator.clipboard`) after the test, and
  move a setup shared by several test files into one helper.

## Release Flow (Automated)

```text
PR merged to main
    ↓
CI runs `multi-semantic-release`
    ↓
MSR detects changed packages since their last tag
    ↓
For each changed package:
    - Bumps version (conventional commits)
    - Updates CHANGELOG.md
    - Publishes to npm
    - Creates git tag (e.g. @linagora/twake-mui@2.0.1)
    - Creates separate GitHub release
```

## Adding New Packages

1. Create package in `packages/<name>/`
2. Required in `package.json`:
   - `"name": "@linagora/<name>"`
   - `"version": "1.0.0"` — the first release is always `1.0.0`; a sibling
     workspace depending on it must declare `^1.0.0`, or npm stops linking the
     workspace after the release bot bumps the version (ranges are not rewritten,
     `--deps.bump=ignore`)
   - `"publishConfig": { "access": "public" }`
   - `"files": ["dist", "CHANGELOG.md", "README.md"]`
3. No per-package config needed — the root `.releaserc.json` applies to all workspaces

## Adding Icons

To add one or more icons to `twake-icons`, follow
[How to add an icon](packages/twake-icons/README.md#how-to-add-an-icon) in the package README.

## Storybook

Inside `packages` folder:

```bash
# Start Storybook development server
npm run doc

# Build static Storybook for deployment
npm run build:doc

# Run visual regression tests with Argos
npm run screenshots
```

Stories are located in:

- `packages/twake-mui/src/components/**/*.stories.tsx` - Component stories (e.g., Avatar)
- `packages/twake-mui/src/stories/*.stories.tsx` - Override showcase stories

When you write or change a story:

- Show a new prop or look in the existing stories: a control in `Default` and a
  section in `Screenshot`, rather than a new story per feature.
- When twake-mui has its own component, render it in its stories, not the MUI
  one it wraps.

### Visual Regression Testing

The project uses Argos for visual regression testing. Screenshots are automatically
captured from Storybook stories during CI and compared against baselines.

To add a story to visual regression tests, add `argos` tag to your story:

```typescript
export const MyStory = {
  tags: ['argos']
}
```

## CI/CD Notes

- **Runs on**: PRs and push to main
- **Order**: install → lint → format check → build → test → bundle test
  (`npm run test:bundle` in twake-mui: builds, then bundles a consumer of
  `dist/`) → browser test (`npm run test:browser` in twake-mui, Chromium) →
  release (main only)
- **Secrets required**: `NODE_AUTH_TOKEN` (NPM token, set in GitHub repo settings)
- **Uses**: `secrets.GITHUB_TOKEN` (auto-provided, no setup needed)

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning:

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
