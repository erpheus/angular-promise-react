// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/promise-react.js',
      'src/*.js',
      'src/**/*.js',
      'tmp/promise-react-templates.js',
      'tests/common.js',
      'tests/spec/**/*.js'
    ],

    plugins: ['karma-jasmine','karma-jasmine-html-reporter','karma-phantomjs-launcher'],

    reporters: ['html']
  });
};