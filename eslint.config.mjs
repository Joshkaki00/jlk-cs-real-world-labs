import airbnb from 'eslint-config-flat-airbnb';

export default airbnb(
  { typescript: true },
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  },
);
