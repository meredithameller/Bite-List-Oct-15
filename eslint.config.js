import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      prettier,
    ],
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Components and hooks must go through src/api/index.ts, never the mock layer directly.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/api/mock', '**/api/mock/*', '@/api/mock', '@/api/mock/*'],
              message:
                'Import from "@/api" instead. Only src/api/index.ts may touch the mock layer.',
            },
          ],
        },
      ],
    },
  },
  {
    // The single swap point for Supabase later, plus the mock layer itself and its tests.
    files: ['src/api/index.ts', 'src/api/mock/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
