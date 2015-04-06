describe('Directive: promise-default', function() {
  var element,
  	  scope;

  beforeEach(function(){mockDirective.apply(this,['ngSwitchDefault'])});
  beforeEach(function(){mockDirective.apply(this,['ngSwitchWhen'])});



  beforeEach(module('promise-button-default-directive'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    element = '<promise-default>Start</promise-default>';

    element = $compile(element)(scope);
    scope.$digest();
  }));

  describe('default element', function(){

  	var resulting_elements;

  	beforeEach(function(){
  		resulting_elements = element[0].querySelectorAll('[ng-switch-default]');
  	});

  	it('should exist', function(){
  		expect(resulting_elements.length).toBe(1);
  	});

  	it('should have the text inside the original element', function(){
  		expect(angular.element(resulting_elements[0]).text()).toBe('Start');
  	});

  });

  var states_and_checks = [
  	{ state: STATES.LOADING, check : 'icon-spin' },
  	{ state: STATES.INTERMEDIATE, check : 'icon-spin' },
  	{ state: STATES.DONE, check: 'fa-check' },
  	{ state: STATES.FAILED, check: 'fa-times' }
  ];

  var test_loading_state = function(state, check){ return function() {

  	var resulting_elements;

  	beforeEach(function(){
  		resulting_elements = element[0].querySelectorAll('[ng-switch-when="'+state+'"]');
  	});

  	it('should exist', function(){
  		expect(resulting_elements.length).toBe(1);
  	});

  	it('should include '+check, function(){
  		expect(resulting_elements[0].outerHTML).toMatch(check);
  	});

  }};

  for (var i = 0; i < states_and_checks.length; i++) {
  	var sc = states_and_checks[i];
  	describe(sc.state + ' element', test_loading_state(sc.state, sc.check));

  };

});