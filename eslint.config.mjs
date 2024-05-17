import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
    },
    {
        rules: {
            'no-unused-vars': ['warn', { args: 'none' }],
        },
    },
]
