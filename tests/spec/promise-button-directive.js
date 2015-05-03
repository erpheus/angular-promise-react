describe('Directive: promise-react', function() {
  'use strict';
  var element,
      scope,
      startAction;

  beforeEach(module('promise-react'));

  beforeEach(function(){
    startAction = jasmine.createSpy('startAction');
    module('promise-react', function($controllerProvider){
      $controllerProvider.register('PromiseButtonController', function(){
        this.startAction = startAction;
      });
    });
  });


  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.deferred = function(){};

    element = '<a promise-button="deferred"></a>';

    element = $compile(element)(scope);
    scope.$digest();
  }));

  describe('default trigger', function(){

    it ('should be binded to click by default', function(){
      element.triggerHandler('click');
      expect(startAction).toHaveBeenCalled();
    });

    it ('other events shouldn\'t trigger it', function(){
      element.triggerHandler('dblclick');
      expect(startAction).not.toHaveBeenCalled();
    });

  });

  describe('with custom trigger specified', function(){

    beforeEach(inject(function($compile){
      element = '<a promise-button="deferred" promise-trigger="dblclick"></a>';
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it ('should be binded to promise-trigger attribute', function(){
      element.triggerHandler('dblclick');
      expect(startAction).toHaveBeenCalled();
    });

    it ('other events shouldn\'t trigger it', function(){
      element.triggerHandler('click');
      expect(startAction).not.toHaveBeenCalled();
    });

  });

});