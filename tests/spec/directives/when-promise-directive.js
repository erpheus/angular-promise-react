/*globals injectStates, STATES */
describe('Directive: when-promise', function() {
  'use strict';
  var scope,
      parent,
      SAMPLECONTENT = 'contentcontent',
      controller = {};

  beforeEach(module('promise-react'));

  injectStates();

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    controller.status = STATES.IDLE;

    parent = angular.element('<fake-parent><span when-promise="'+STATES.LOADING+'">'+SAMPLECONTENT+'</span></fake-parent>');
    parent.data('$promiseButtonController', controller);

    parent = $compile(parent)(scope);
    scope.$digest();
  }));

  it ('should not show its content when current status doesn\'t match its value', function(){
    expect(parent.text()).not.toMatch(SAMPLECONTENT);
  });

  it ('should show its content when current status matches its value', function(){
    controller.status = STATES.LOADING;
    scope.$digest();

    expect(parent.text()).toMatch(SAMPLECONTENT);
  });


  describe('with no value specified', function(){

    beforeEach(inject(function($compile){
      parent = angular.element('<fake-parent><span when-promise>'+SAMPLECONTENT+'</span></fake-parent>');
      parent.data('$promiseButtonController', controller);

      parent = $compile(parent)(scope);
      scope.$digest();
    }));

    it ('should show its content if status is not idle', function(){
      controller.status = STATES.LOADING;
      scope.$digest();

      expect(parent.text()).toMatch(SAMPLECONTENT);

      controller.status = STATES.DONE;
      scope.$digest();

      expect(parent.text()).toMatch(SAMPLECONTENT);
    });

    it ('should not show its content if status is idle', function(){
      expect(parent.text()).not.toMatch(SAMPLECONTENT);
    });

  });

});