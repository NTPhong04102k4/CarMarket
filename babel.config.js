/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  plugins: [
    ['module:react-native-dotenv'],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
        extensions: ['.js', '.json'],
        root: ['./src'],
      },
    ],
    'inline-dotenv',
    'react-native-reanimated/plugin', // needs to be last
  ],
  presets: ['module:@react-native/babel-preset'],
};
