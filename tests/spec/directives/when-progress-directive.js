describe('Directive: when-progress', function() {
  var element,
  	  scope,
      trigger = '',
      action,
      startAction;

  beforeEach(module('promise-button'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.status = STATES.IDLE;

    element = angular.element('<fake-parent><span when-progress>contentcontent</span></fake-parent>');

    element.data('$PromiseButtonController', {});

    var parent = $compile(element)(scope);
    scope.$digest();
    element = angular.element(parent.children()[0]);
  }));

  it ('should show its content when status is loading', function(){
    scope.status = STATES.LOADING;
    scope.$digest();

    expect(element.text()).toMatch('contentcontent');
  });

  it ('should show its content when status is intermediate', function(){
    scope.status = STATES.INTERMEDIATE;
    scope.$digest();

    expect(element.text()).toMatch('contentcontent');
  });

  it ('should not show its content when status is idle, done or failed', function(){
    expect(element.text()).not.toMatch('contentcontent');

    scope.status = STATES.DONE;
    scope.$digest();

    expect(element.text()).not.toMatch('contentcontent');

    scope.status = STATES.FAILED;
    scope.$digest();

    expect(element.text()).not.toMatch('contentcontent');
  });

  describe('used with a value',function(){

    beforeEach(inject(function($compile){

      element = angular.element('<fake-parent><span when-progress="\'aaaa\'">contentcontent</span></fake-parent>');
      var parent = $compile(element)(scope);
      scope.$digest();
      element = angular.element(parent.children()[0]);

    }));

    it('should show its content when status is intermediate and state is equal to the value', function(){
      scope.status = STATES.INTERMEDIATE;
      scope.state = 'aaaa';
      scope.$digest();

      expect(element.text()).toMatch('contentcontent');
    });

    it('should not show its contents when state is not equal to the value', function(){
      scope.status = STATES.INTERMEDIATE;
      scope.state = 'bbbb';
      scope.$digest();

      expect(element.text()).not.toMatch('contentcontent');
    });

    it ('should not show its content when status is not intermediate, even if state is equal', function(){
      scope.state = 'aaaa';
      scope.$digest();

      expect(element.text()).not.toMatch('contentcontent');

      scope.status = STATES.LOADING;
      scope.$digest();

      expect(element.text()).not.toMatch('contentcontent');

      scope.status = STATES.DONE;
      scope.$digest();

      expect(element.text()).not.toMatch('contentcontent');

      scope.status = STATES.FAILED;
      scope.$digest();

      expect(element.text()).not.toMatch('contentcontent');
    });


  });

});