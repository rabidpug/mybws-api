module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'server/**/*.js',
  ],
  coveragePathIgnorePatterns: [
    'src/index.jsx',
    'server/index.js',
  ],
  moduleFileExtensions: [
    '/index.js',
    '/index.jsx',
    'js',
    'jsx',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$'                                                                 : 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$' :
      '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(html|ico)$' : '<rootDir>/__mocks__/htmlMock.js',
    '^Common(/.*)$'     : '<rootDir>/src/common$1',
    '^Store(/.*)$'      : '<rootDir>/src/store$1',
  },
  modulePaths: [
    '<rootDir/src',
    '<rootDir>/node_modules',
  ],
  setupFiles                   : [ 'jest-localstorage-mock', ],
  setupTestFrameworkScriptFile : './testConfig.js',
};
