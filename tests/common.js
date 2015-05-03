/*jshint unused: false, strict: false */
var STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  INTERMEDIATE: 'intermediate',
  DONE: 'done',
  FAILED: 'failed'
};


function mockDirective(name, backups){
  angular.module('promise-react').config(function($provide){
    $provide.decorator(name+'Directive', ['$delegate', function($delegate) {
      //$delegate is array of all {name} directive
      backups[name] = $delegate.shift();
      return $delegate;
    }]);
  });
  angular.module('promise-react').directive(name, function() {
    return {
      link: function() {}
    };
  });
}

function restoreDirective(name, backups){
  angular.module('promise-react').config(function($provide){
    $provide.decorator(name+'Directive', ['$delegate', function($delegate) {
      //$delegate is array of all {name} directive
      $delegate.pop();
      $delegate.unshift(backups[name]);
      return $delegate;
    }]);
  });
}