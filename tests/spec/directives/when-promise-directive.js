describe('Directive: when-promise', function() {
  var element,
  	  scope,
      trigger = '',
      action,
      startAction;

  beforeEach(module('promise-button'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    element = angular.element('<fake-parent><span when-promise="aaaa"></span></fake-parent>');

    element.data('$PromiseButtonController', {});

    var parent = $compile(element)(scope);
    scope.$digest();
    element = angular.element(parent.children()[0]);
  }));

  it ('should replace itself with an equivalent ng-switch-when', function(){
    expect(element.attr('when-promise')).toBeUndefined();
    expect(element.attr('ng-switch-when')).toBe('aaaa');
  });

  it ('should replace itself with a ng-switch-default if value is idle', inject(function($compile){
    // setup
    element = angular.element('<fake-parent><span when-promise="idle"></span></fake-parent>');
    var parent = $compile(element)(scope);
    scope.$digest();
    element = angular.element(parent.children()[0]);

    expect(element.attr('when-promise')).toBeUndefined();
    expect(element.attr('ng-switch-default')).toBeDefined();

  }));

});