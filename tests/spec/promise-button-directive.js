describe('Directive: promise-button', function() {
  var element,
  	  scope,
      trigger = '',
      action,
      startAction;

  var SAMPLETEXT="lalalalalalala";

  beforeEach(module('promise-button'));

  beforeEach(function(){
    startAction = jasmine.createSpy('startAction');
    module('promise-button', function($controllerProvider){
      $controllerProvider.register('PromiseButtonController', function($scope){
        $scope.startAction = startAction;
      });
    });
  });


  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.deferred = function(){}

    element = '<a promise-button="deferred">'+SAMPLETEXT+'</a>';

    element = $compile(element)(scope);
    scope.$digest();
  }));

  it ('should create a switch on status', function(){
    expect(element.find('ng-switch').length).toBe(1);
    expect(element.find('ng-switch').attr('on')).toBe('status');
  });

  it ('should transclude inside the switch', function(){
    expect(element.find('ng-switch').html()).toMatch(SAMPLETEXT);
  });

  describe('default trigger', function(){

    it ('should be binded to click by default', function(){
      element.triggerHandler('click');
      expect(startAction.calls.count()).toEqual(1);
    });

  });

  describe('custom trigger', function(){

    it ('should be binded to promise-trigger attribute value if specified', inject(function($compile){

      element = '<a promise-button="deferred" promise-trigger="dblclick">'+SAMPLETEXT+'</a>';
      element = $compile(element)(scope);
      scope.$digest();


      element.triggerHandler('dblclick');
      expect(startAction.calls.count()).toEqual(1);
    }));


  });

});