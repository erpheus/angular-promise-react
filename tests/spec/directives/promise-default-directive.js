/*globals STATES, mockDirective, restoreDirective */
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

  states_and_checks.forEach(function(sc) {
    it('should display '+sc.check+' on '+sc.state, function() {
      controller.status = sc.state;
      scope.$digest();

      expect(element.html()).toMatch(sc.check);
    });
  });
});