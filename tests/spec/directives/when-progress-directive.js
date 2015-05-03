/*globals STATES */
describe('Directive: when-progress', function() {
  'use strict';
  var scope,
      parent,
      controller = {};

  beforeEach(module('promise-react'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    controller.status = STATES.IDLE;
    delete controller.state;

    parent = angular.element('<fake-parent><span when-progress>contentcontent</span></fake-parent>');
    parent.data('$promiseButtonController', controller);

    parent = $compile(parent)(scope);
    scope.$digest();

  }));

  it ('should show its content when status is loading', function(){
    controller.status = STATES.LOADING;
    scope.$digest();

    expect(parent.text()).toMatch('contentcontent');
  });

  it ('should show its content when status is intermediate', function(){
    controller.status = STATES.INTERMEDIATE;
    scope.$digest();

    expect(parent.text()).toMatch('contentcontent');
  });

  it ('should not show its content when status is idle, done or failed', function(){
    expect(parent.text()).not.toMatch('contentcontent');

    controller.status = STATES.DONE;
    scope.$digest();

    expect(parent.text()).not.toMatch('contentcontent');

    controller.status = STATES.FAILED;
    scope.$digest();

    expect(parent.text()).not.toMatch('contentcontent');
  });

  describe('used with a value',function(){

    beforeEach(inject(function($compile){

      parent = angular.element('<fake-parent><span when-progress="\'aaaa\'">contentcontent</span></fake-parent>');
      parent.data('$promiseButtonController', controller);
      parent = $compile(parent)(scope);
      scope.$digest();

    }));

    it('should show its content when status is intermediate and state is equal to the value', function(){
      controller.status = STATES.INTERMEDIATE;
      controller.state = 'aaaa';
      scope.$digest();

      expect(parent.text()).toMatch('contentcontent');
    });

    it('should not show its contents when state is not equal to the value', function(){
      controller.status = STATES.INTERMEDIATE;
      controller.state = 'bbbb';
      scope.$digest();

      expect(parent.text()).not.toMatch('contentcontent');
    });

    it ('should not show its content when status is not intermediate, even if state is equal', function(){
      controller.state = 'aaaa';
      scope.$digest();

      expect(parent.text()).not.toMatch('contentcontent');

      controller.status = STATES.LOADING;
      scope.$digest();

      expect(parent.text()).not.toMatch('contentcontent');

      controller.status = STATES.DONE;
      scope.$digest();

      expect(parent.text()).not.toMatch('contentcontent');

      controller.status = STATES.FAILED;
      scope.$digest();

      expect(parent.text()).not.toMatch('contentcontent');
    });


  });

});