/*globals mockDirective, restoreDirective, injectStates, STATES */
describe('Directive: promise-default', function() {
  'use strict';
  var element,
      parent,
      scope,
      SAMPLETEXT = 'transcluded text',
      controller = {};

  var backups = {};
  beforeEach(function(){mockDirective.apply(this,['whenPromise', backups]);});
  afterEach(function(){restoreDirective.apply(this,['whenPromise', backups]);});

  beforeEach(module('promise-react'));

  injectStates();

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    controller.status = STATES.IDLE;

    parent = angular.element('<fake-parent><promise-default>'+SAMPLETEXT+'</promise-default></fake-parent>');
    parent.data('$promiseButtonController', controller);

    element = $compile(parent)(scope);
    scope.$digest();
  }));

  var states_and_checks = [
    { state: 'IDLE', check: SAMPLETEXT},
    { state: 'LOADING', check : 'fa-spin' },
    { state: 'INTERMEDIATE', check : 'fa-spin' },
    { state: 'DONE', check: 'fa-check' },
    { state: 'FAILED', check: 'fa-times' }
  ];

  states_and_checks.forEach(function(sc) {
    it('should display '+sc.check+' on '+sc.state, function() {
      controller.status = STATES[sc.state];
      scope.$digest();

      expect(element.html()).toMatch(sc.check);
    });
  });
});