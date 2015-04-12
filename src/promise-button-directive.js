(function(){
	
	var module = angular.module('promise-button');

	module.directive('promiseButton', ['$parse', function($parse){
		return {
			controller: 'PromiseButtonController',
			restrict: 'A',
			compile: function($element, attr) {
				var fn = $parse(attr['promiseButton'], /* interceptorFn */ null, /* expensiveChecks */ true);
				return function(scope, element, attr, ctrl) {
					ctrl.action = fn;
					var trigger = attr['promiseTrigger'] || 'click';
					element.bind(trigger, ctrl.startAction);
				}
			}
		};
	}]);

})();