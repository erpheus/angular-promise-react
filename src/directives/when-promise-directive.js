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