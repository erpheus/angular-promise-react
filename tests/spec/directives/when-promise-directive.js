describe('Directive: when-promise', function() {
  var scope,
      action,
      startAction,
      SAMPLECONTENT = "contentcontent";

  beforeEach(module('promise-button'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.status = STATES.IDLE;

    parent = angular.element('<fake-parent><span when-promise="'+STATES.LOADING+'">'+SAMPLECONTENT+'</span></fake-parent>');
    parent.data('$promiseButtonController', {});

    parent = $compile(parent)(scope);
    scope.$digest();
  }));

  it ('should not show its content when current status doesn\'t match its value', function(){
    expect(parent.text()).not.toMatch(SAMPLECONTENT);
  });

  it ('should show its content when current status matches its value', function(){
    scope.status = STATES.LOADING;
    scope.$digest();

    expect(parent.text()).toMatch(SAMPLECONTENT);
  });


  describe('with no value specified', function(){

    beforeEach(inject(function($compile){
      parent = angular.element('<fake-parent><span when-promise>'+SAMPLECONTENT+'</span></fake-parent>');
      parent.data('$promiseButtonController', {});

      parent = $compile(parent)(scope);
      scope.$digest();
    }));

    it ('should show its content if status is not idle', function(){
      scope.status = STATES.LOADING;
      scope.$digest();

      expect(parent.text()).toMatch(SAMPLECONTENT);

      scope.status = STATES.DONE;
      scope.$digest();

      expect(parent.text()).toMatch(SAMPLECONTENT);
    });

    it ('should not show its content if status is idle', function(){
      expect(parent.text()).not.toMatch(SAMPLECONTENT);
    });

  });

});