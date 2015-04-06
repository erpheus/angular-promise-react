(function(){
	
	var module = angular.module('promise-button');

	module.controller('PromiseButtonController', ['$scope','$timeout', function($scope,$timeout){
		
		$scope.status = 'idle';
		 var action = $scope['promiseButton'];

		$scope.startAction = function(){
			// Avoid duplicate calls
			if ($scope.status != 'idle'){
				return;
			}
			$scope.status = 'loading';

			var end = function(){
				$scope.status = 'done';
				$timeout(function(){
					$scope.status = 'idle';
				},500);
			}

			//Button sometimes doesn't update.
			$scope.$apply();

			return action().then(end, end);
		}

	}]);

})();