module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-flow',
      ],
    }],
  },
};
