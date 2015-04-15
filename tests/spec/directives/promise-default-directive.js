describe('Directive: promise-default', function() {
  var element,
  	  scope,
  	  SAMPLETEXT = 'transcluded text',
      controller = {};

  var backups = {};
  beforeEach(function(){mockDirective.apply(this,['whenPromise', backups])});
  afterEach(function(){restoreDirective.apply(this,['whenPromise', backups])});

  beforeEach(module('promise-react'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    controller.status = STATES.IDLE;

    parent = angular.element('<fake-parent><promise-default>'+SAMPLETEXT+'</promise-default></fake-parent>');
    parent.data('$promiseButtonController', controller);

    element = $compile(parent)(scope);
    scope.$digest();
  }));

  var states_and_checks = [
  	{ state: STATES.IDLE, check: SAMPLETEXT},
  	{ state: STATES.LOADING, check : 'fa-spin' },
  	{ state: STATES.INTERMEDIATE, check : 'fa-spin' },
  	{ state: STATES.DONE, check: 'fa-check' },
  	{ state: STATES.FAILED, check: 'fa-times' }
  ];

  for (var i = 0; i < states_and_checks.length; i++) {
    var sc = states_and_checks[i];
    it('should display '+sc.check+' on '+sc.state, function(sc){ return function(){
      controller.status = sc.state;
      scope.$digest();

      expect(element.html()).toMatch(sc.check);
    }}(sc));
  };

});