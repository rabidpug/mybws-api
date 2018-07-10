module.exports = {
  collectCoverageFrom        : [ 'src/**/*.js', ],
  coveragePathIgnorePatterns : [
    'src/index.jsx',
    'server/index.js',
  ],
  moduleFileExtensions: [
    '/index.js',
    'js',
  ],
  modulePaths: [
    '<rootDir/src',
    '<rootDir>/node_modules',
  ],
}
