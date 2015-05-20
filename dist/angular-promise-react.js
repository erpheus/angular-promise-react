(function(){
	'use strict';

	var module = angular.module('promise-react',['promise-react-templates']);

	module.constant('STATES', {
		IDLE: 'idle',
		LOADING: 'loading',
		INTERMEDIATE: 'intermediate',
		DONE: 'done',
		FAILED: 'failed'
	});

})();
(function(){
	'use strict';

	var module = angular.module('promise-react');

	module.factory('promiseButtonIf', ['ngIfDirective', function(ngIfDirective) {
		var ngIf = ngIfDirective[0];
		return function(additionalCondition) {
			// Thanks to Joscha and hilnius (http://stackoverflow.com/q/20325480)
			var reactIf = angular.extend({}, ngIf);

			reactIf.scope = false;
			reactIf.priority--;
			reactIf.require = '^promiseButton';

			// Clear the name
			delete reactIf.name;
			// The link property is used only if the compile property is not defined.
			delete reactIf.compile;

			reactIf.link = function(scope, iElement, iAttrs /*, promiseButtonController */) {
				var initialNgIf = iAttrs.ngIf; // Initial ng-if attribute
				var args = arguments, self = this;

				iAttrs.ngIf = function() {
					// If there was a initial ng-if attribute, test it
					if (initialNgIf && !scope.$eval(initialNgIf)) return false;

					// Invoke the additional condition with the link-time arguments
					return additionalCondition.apply(self, args);
				};

				ngIf.link.apply(ngIf, args);
			};

			return reactIf;
		};
	}]);

	// when-progress directive
	module.directive('whenProgress', ['promiseButtonIf', 'STATES', function(promiseButtonIf, STATES) {
		return promiseButtonIf(function(scope, iElement, iAttrs, promiseButtonController) {
			var value = iAttrs.whenProgress;
			if (value) {
				// If a value is specified it matches only intermediate status with proper states
				return promiseButtonController.status === STATES.INTERMEDIATE &&
				       promiseButtonController.state  === scope.$eval(value);
			}
			else {
				// If no value is specified it matches either loading or intermediate status
				return promiseButtonController.status === STATES.INTERMEDIATE ||
				       promiseButtonController.status === STATES.LOADING;
			}
		});
	}]);

	// when-promise directive
	module.directive('whenPromise', ['promiseButtonIf', 'STATES', function(promiseButtonIf, STATES) {
		return promiseButtonIf(function(scope, iElement, iAttrs, promiseButtonController) {
			var value = iAttrs.whenPromise;
			if (value) {
				// If a value is specified it matches only intermediate status with proper states
				return promiseButtonController.status === value;
			} else {
				// If no value is specified it matches either loading or intermediate status
				return promiseButtonController.status !== STATES.IDLE;
			}
		});
	}]);

})();
(function(){
	'use strict';

	var module = angular.module('promise-react');

	module.directive('promiseDefault', function(){
		return {
			scope: false,
			restrict: 'E',
			templateUrl: 'directives/promise-default.tpl.html',
			transclude: true
		};
	});


})();
(function(){
	'use strict';

	var module = angular.module('promise-react');

	module.controller('PromiseButtonController', [
		'$scope',
		'STATES',
		'$timeout',
		function($scope, STATES, $timeout){

			var ctrl = this;
			ctrl.action = null;
			var controller = this;

			/* Change the scope's status and update the state if necessary
			 * otherwise delte the current state */
			var setStatus = function(status, state){
				controller.status = status;
				$scope.status = status;
				switch(status){
					case STATES.INTERMEDIATE:
					case STATES.DONE:
					case STATES.FAILED:
						$scope.state = state;
						controller.state = state;
						break;
					default:
						delete controller.state;
						delete $scope.state;
						break;
				}
			};

			setStatus(STATES.IDLE);

			/* Called by the binding in the directive. Calls the action
			 * specified and sets all the callbacks for handling the
			 * promise updates. */
			ctrl.startAction = function(){
				// Avoid duplicate calls
				if ($scope.status !== STATES.IDLE || !ctrl.action){
					return;
				}
				setStatus(STATES.LOADING);

				/* Handler builder for the end of the promise */
				var end = function(state) {
					return function(result){
						setStatus(state, result);

						// Return to idle after timeout
						$timeout(function(){
							setStatus(STATES.IDLE);
						},500);
					};
				};

				var update = function(state){
					setStatus(STATES.INTERMEDIATE, state);
				};

				return ctrl.action($scope).then(end(STATES.DONE), end(STATES.FAILED), update);
			};
		}
	]);

})();
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

angular.module('promise-react-templates', ['directives/promise-default.tpl.html']);

angular.module("directives/promise-default.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/promise-default.tpl.html",
    "<span ng-transclude when-promise=\"idle\"></span>\n" +
    "<i class=\"fa fa-refresh fa-spin\" when-progress></i>\n" +
    "<i class=\"fa fa-check\" when-promise=\"done\"></i>\n" +
    "<i class=\"fa fa-times\" when-promise=\"failed\"></i>");
}]);
