module.exports = {
  verbose: true,
  testEnvironment: './jest-environment-jsdom.js',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['./test/helpers/setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!lit-html).+\\.js'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  },
  moduleNameMapper: {
    '^ui-forms/autocomplete/(.+)$': '<rootDir>/src/autocomplete/$1',
    '^ui-forms/(.+)$': '<rootDir>/src/$1',
    '^ui-forms$': '<rootDir>/src/index.js',
    '^solid-ui-core/(.+)$': '<rootDir>/node_modules/solid-ui-core/lib/$1',
    '^solid-ui-core$': '<rootDir>/node_modules/solid-ui-core/lib/index.js',
    '^solid-logic$': '<rootDir>/node_modules/solid-logic',
    '^rdflib$': '<rootDir>/node_modules/rdflib'
  },
  testEnvironmentOptions: {
    customExportConditions: ['node']
  }
}
