describe('Directive: promise-default', function() {
  var element,
  	  scope,
  	  SAMPLETEXT = 'transcluded text';

  var backups = {};
  beforeEach(function(){mockDirective.apply(this,['whenPromise', backups])});
  afterEach(function(){restoreDirective.apply(this,['whenPromise', backups])});

  beforeEach(module('promise-button'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    element = '<promise-default>'+SAMPLETEXT+'</promise-default>';

    element = $compile(element)(scope);
    scope.$digest();
  }));

  var states_and_checks = [
  	{ state: STATES.IDLE, check: SAMPLETEXT},
  	{ state: STATES.LOADING, check : 'icon-spin' },
  	{ state: STATES.INTERMEDIATE, check : 'icon-spin' },
  	{ state: STATES.DONE, check: 'fa-check' },
  	{ state: STATES.FAILED, check: 'fa-times' }
  ];

  var test_loading_state = function(state, check){ return function() {

  	var resulting_elements;

  	beforeEach(function(){
  		resulting_elements = element[0].querySelectorAll('[when-promise="'+state+'"]');
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