(function(){
	
	var module = angular.module('promise-button',['promise-button-templates']);

	module.constant('STATES', {
        IDLE: 'idle',
		LOADING: 'loading',
		INTERMEDIATE: 'intermediate',
		DONE: 'done',
		FAILED: 'failed'
    });

})();
(function(){
	
	var module = angular.module('promise-button');

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
	
	var module = angular.module('promise-button');

	// thanks to Joscha and hilnius: http://stackoverflow.com/questions/20325480/angularjs-whats-the-best-practice-to-add-ngif-to-a-directive-programmatically
	module.directive('whenProgress', ['ngIfDirective','STATES', function(ngIfDirective, STATES){
		var ngIf = ngIfDirective[0];

		return {
			transclude: ngIf.transclude,
        	priority: ngIf.priority - 1,
        	terminal: ngIf.terminal,
        	restrict: ngIf.restrict,
        	require: '^promiseButton',
        	link: function(scope, element, attributes, promiseButtonController) {
        		var value = attributes['whenProgress'];
        		// actual condition
        		var progressCondition;

        		if (value) { // If a value is specified it matches only intermediate status with proper states
        			progressCondition = function(){
	        			return promiseButtonController.status == STATES.INTERMEDIATE && promiseButtonController.state == scope.$eval(value);
	        		}
        		} else { // If no value is specified it matches either loading or intermediate status
        			progressCondition = function(){
	        			return promiseButtonController.status == STATES.INTERMEDIATE || promiseButtonController.status == STATES.LOADING;
	        		}
        		}


	            // find the initial ng-if attribute
	            var initialNgIf = attributes.ngIf, 
	            	ifEvaluator;

	            // if it exists, evaluates ngIf && condition
	            if (initialNgIf) {
	                ifEvaluator = function () {
	                    return scope.$eval(initialNgIf) && progressCondition();
	                }
	            } else { // if there's no ng-if only condition
	                ifEvaluator = function () {
	                	//debugger;
	                    return progressCondition();
	                }
	            }
	            attributes.ngIf = ifEvaluator;
	            ngIf.link.apply(ngIf, arguments);
	        }

		};
	}]);

})();
(function(){
	
	var module = angular.module('promise-button');

	// thanks to Joscha and hilnius: http://stackoverflow.com/questions/20325480/angularjs-whats-the-best-practice-to-add-ngif-to-a-directive-programmatically
	module.directive('whenPromise', ['ngIfDirective','STATES', function(ngIfDirective, STATES){
		var ngIf = ngIfDirective[0];

		return {
			transclude: ngIf.transclude,
        	priority: ngIf.priority - 1,
        	terminal: ngIf.terminal,
        	restrict: ngIf.restrict,
        	require: '^promiseButton',
        	link: function(scope, element, attributes, promiseButtonController) {
        		var value = attributes['whenPromise'];
        		// actual condition
        		var promiseCondition;

        		if (value) { // If a value is specified it matches only intermediate status with proper states
        			promiseCondition = function(){
	        			return promiseButtonController.status == value;
	        		}
        		} else { // If no value is specified it matches either loading or intermediate status
        			promiseCondition = function(){
	        			return promiseButtonController.status != STATES.IDLE;
	        		}
        		}


	            // find the initial ng-if attribute
	            var initialNgIf = attributes.ngIf, 
	            	ifEvaluator;

	            // if it exists, evaluates ngIf && condition
	            if (initialNgIf) {
	                ifEvaluator = function () {
	                    return scope.$eval(initialNgIf) && promiseCondition();
	                }
	            } else { // if there's no ng-if only condition
	                ifEvaluator = function () {
	                	//debugger;
	                    return promiseCondition();
	                }
	            }
	            attributes.ngIf = ifEvaluator;
	            ngIf.link.apply(ngIf, arguments);
	        }

		};
	}]);

})();
(function(){
	
	var module = angular.module('promise-button');

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
				if ($scope.status != STATES.IDLE || !ctrl.action){
					return;
				}
				setStatus(STATES.LOADING);

				/* Handler builder for the end of the promise */
				var end = function(state) { return function(result){
					setStatus(state, result);

					// Return to idle after timeout
					$timeout(function(){
						setStatus(STATES.IDLE);
					},500);
				}};

				var update = function(state){
					setStatus(STATES.INTERMEDIATE, state);
				}

				//Button sometimes doesn't update.
				$scope.$apply();

				return ctrl.action($scope).then(end(STATES.DONE), end(STATES.FAILED), update);
			}
		}
	]);

})();
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
angular.module('promise-button-templates', ['directives/promise-default.tpl.html']);

angular.module("directives/promise-default.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/promise-default.tpl.html",
    "<span ng-transclude when-promise=\"idle\"></span>\n" +
    "<i class=\"fa fa-refresh fa-spin\" when-progress></i>\n" +
    "<i class=\"fa fa-check\" when-promise=\"done\"></i>\n" +
    "<i class=\"fa fa-times\" when-promise=\"failed\"></i>");
}]);
