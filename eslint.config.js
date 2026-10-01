import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** Banned everywhere — repeated into every layer rule, because in flat config a later
 *  `no-restricted-imports` entry REPLACES an earlier one instead of merging with it. */
const BANNED_PATHS = [
  {
    name: '@tanstack/react-query',
    message:
      '🚫 Do not use React Query. ' +
      'Use Dexie useLiveQuery() for reactive local data. ' +
      'See harness/BOUNDARIES.md.',
  },
  {
    name: 'zustand',
    message:
      '🚫 Do not use Zustand. ' +
      'Dexie live queries + React state is our state management. ' +
      'See harness/BOUNDARIES.md.',
  },
  {
    name: '@reduxjs/toolkit',
    message:
      '🚫 Do not use Redux. ' +
      'See harness/BOUNDARIES.md.',
  },
  {
    name: 'react-query',
    message: '🚫 Do not use React Query. Use Dexie useLiveQuery(). See harness/BOUNDARIES.md.',
  },
  {
    name: 'redux',
    message: '🚫 Do not use Redux. See harness/BOUNDARIES.md.',
  },
  {
    name: 'react-redux',
    message: '🚫 Do not use Redux. See harness/BOUNDARIES.md.',
  },
  {
    name: 'recoil',
    message: '🚫 Do not use Recoil. See harness/BOUNDARIES.md.',
  },
  {
    name: 'jotai',
    message:
      '🚫 Do not use Jotai. ' +
      'See harness/BOUNDARIES.md.',
  },
]

const BANNED_PATTERNS = [
  {
    group: ['@radix-ui/*', '@headlessui/*', '@mui/*', '@chakra-ui/*', '@shadcn/*', '@ark-ui/*'],
    message:
      '🚫 No third-party UI libraries. Every primitive already exists in src/components/. ' +
      'See harness/BOUNDARIES.md.',
  },
]

/** `no-restricted-imports` with the global bans plus layer-specific patterns. */
function restrict(patterns = []) {
  return ['error', { paths: BANNED_PATHS, patterns: [...BANNED_PATTERNS, ...patterns] }]
}

// =============================================================================
// Architectural boundary rules
// These enforce the dependency flow defined in harness/BOUNDARIES.md:
//   types → data → db → services → hooks → components → pages
// =============================================================================

/** Components must not import from db/ or services/ directly. Use hooks. */
const componentBoundaries = {
  files: ['src/components/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: ['**/db', '**/db/**'],
        message:
          '🚫 Components must not import from db/ directly. ' +
          'Create or use a custom hook in hooks/ instead. ' +
          'See harness/BOUNDARIES.md.',
      },
      {
        group: ['**/services', '**/services/**'],
        message:
          '🚫 Components must not import from services/ directly. ' +
          'Business logic should be accessed through hooks/. ' +
          'See harness/BOUNDARIES.md.',
      },
      {
        group: ['**/pages', '**/pages/**'],
        message:
          '🚫 Components must not import from pages/. ' +
          'Components are reusable UI — they should not depend on route-level views. ' +
          'See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** Pages must not import from db/ or services/ directly. Use hooks. */
const pageBoundaries = {
  files: ['src/pages/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: ['**/db', '**/db/**'],
        message:
          '🚫 Pages must not import from db/ directly. ' +
          'Use a custom hook from hooks/ to access data. ' +
          'See harness/BOUNDARIES.md.',
      },
      {
        group: ['**/services', '**/services/**'],
        message:
          '🚫 Pages must not import from services/ directly. ' +
          'Wrap service calls in a custom hook. ' +
          'See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** Services must not import React or UI layer code. Pure business logic only. */
const serviceBoundaries = {
  files: ['src/services/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: ['react', 'react-dom', 'react/**', 'react-dom/**'],
        message:
          '🚫 Services must not import React. ' +
          'Services are pure business logic with no React dependency. ' +
          'If you need reactive data, move the logic to a hook in hooks/. ' +
          'See harness/BOUNDARIES.md.',
      },
      {
        group: ['**/hooks', '**/hooks/**'],
        message:
          '🚫 Services must not import hooks. ' +
          'Hooks depend on services, not the other way around. ' +
          'See harness/BOUNDARIES.md.',
      },
      {
        group: ['**/components', '**/components/**', '**/pages', '**/pages/**'],
        message:
          '🚫 Services must not import UI code. ' +
          'Services sit below the UI layer. See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** db/ may import only types/ and lib/ (BOUNDARIES.md) — not data/, services/, hooks/, components/ or pages/. */
const dbBoundaries = {
  files: ['src/db/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: [
          '**/hooks', '**/hooks/**',
          '**/components', '**/components/**',
          '**/pages', '**/pages/**',
          '**/services', '**/services/**',
          '**/data', '**/data/**',
        ],
        message:
          '🚫 The db/ layer must not import from data/, services/, hooks/, components/ or pages/. ' +
          'db/ imports only types/ and lib/. ' +
          'See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** Hooks sit below the UI: no components/ or pages/. */
const hookBoundaries = {
  files: ['src/hooks/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: ['**/components', '**/components/**', '**/pages', '**/pages/**'],
        message:
          '🚫 Hooks must not import from components/ or pages/. ' +
          'Hooks feed the UI, not the other way around. See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** lib/ is static, leaf-level helpers: types/ and other lib/ files only. */
const libBoundaries = {
  files: ['src/lib/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: [
          '**/db', '**/db/**',
          '**/services', '**/services/**',
          '**/hooks', '**/hooks/**',
          '**/components', '**/components/**',
          '**/pages', '**/pages/**',
          '**/data', '**/data/**',
          'react', 'react-dom', 'react/**', 'react-dom/**',
        ],
        message:
          '🚫 lib/ may import only types/ and other lib/ files. ' +
          'See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** data/ is static bundled data: types/ only. */
const dataBoundaries = {
  files: ['src/data/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: [
          '**/db', '**/db/**',
          '**/services', '**/services/**',
          '**/hooks', '**/hooks/**',
          '**/components', '**/components/**',
          '**/pages', '**/pages/**',
          '**/lib', '**/lib/**',
        ],
        message: '🚫 data/ may import only types/. See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** The OFF client is a pure HTTP boundary — caching into Dexie is foodSources.ts's job. */
const offClientBoundaries = {
  files: ['src/services/off/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: ['**/db', '**/db/**', 'react', 'react-dom', 'react/**', 'react-dom/**', '**/hooks', '**/hooks/**', '**/components', '**/components/**', '**/pages', '**/pages/**'],
        message:
          '🚫 services/off/ must not import db/ (or React/hooks). ' +
          'Persisting OFF results is services/foodSources.ts\'s job. See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

/** Types must have zero project imports. They are leaf nodes. */
const typesBoundaries = {
  files: ['src/types/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': restrict([
      {
        group: [
          '**/db', '**/db/**',
          '**/hooks', '**/hooks/**',
          '**/components', '**/components/**',
          '**/pages', '**/pages/**',
          '**/services', '**/services/**',
          '**/data', '**/data/**',
          '**/lib', '**/lib/**',
        ],
        message:
          '🚫 Types must not import from any project directory. ' +
          'Type files are pure type definitions with zero dependencies. ' +
          'See harness/BOUNDARIES.md.',
      },
    ]),
  },
}

// =============================================================================
// Main config
// =============================================================================

export default defineConfig([
  globalIgnores(['dist', 'dev-dist', 'reference']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Enforce strict TypeScript
      '@typescript-eslint/no-explicit-any': 'error',

      // Prevent accidental global state libraries
      'no-restricted-imports': restrict(),
    },
  },

  // Layer-specific boundary rules
  componentBoundaries,
  pageBoundaries,
  serviceBoundaries,
  offClientBoundaries,
  hookBoundaries,
  libBoundaries,
  dataBoundaries,
  dbBoundaries,
  typesBoundaries,
])
