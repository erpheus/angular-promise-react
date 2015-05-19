(function(){
	'use strict';

	var module = angular.module('promise-react');

	module.directive('promiseButton', ['$parse', function($parse){
		return {
			controller: 'PromiseButtonController',
			restrict: 'A',
			compile: function($element, attr) {
				var fn = $parse(attr['promiseButton'], /* interceptorFn */ null, /* expensiveChecks */ true);
				return function(scope, element, attr, ctrl) {
					ctrl.action = fn;
					var trigger = attr['promiseTrigger'] || 'click';

					element.bind(trigger, function() {
						// Accesses to scope from outside a controller must
						// be wrapped in an .apply() in order to take effect.
						scope.$apply(ctrl.startAction);
					});
				};
			}
		};
	}]);

})();
