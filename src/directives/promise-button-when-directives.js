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