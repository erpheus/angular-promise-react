(function(){
	
	var module = angular.module('promise-button');

	module.controller('PromiseButtonController', [
		'$scope',
		'STATES',
		'$timeout',
		function($scope, STATES, $timeout){
			
			$scope.status = STATES.IDLE;
			var action = $scope['promiseButton'];

			/* Change the scope's status and update the state if necessary
			 * otherwise delte the current state */
			var setStatus = function(status, state){
				$scope.status = status;
				switch(status){
					case STATES.INTERMEDIATE:
					case STATES.DONE:
					case STATES.FAILED:
						$scope.state = state;
						break;
					default:
						delete $scope.state;
						break;
				}
			};

			/* Called by the binding in the directive. Calls the action
			 * specified and sets all the callbacks for handling the 
			 * promise updates. */
			$scope.startAction = function(){
				// Avoid duplicate calls
				if ($scope.status != STATES.IDLE){
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

				return action().then(end(STATES.DONE), end(STATES.FAILED), update);
			}
		}
	]);

})();