(function(){
	
	var module = angular.module('promise-button-controller',[]);

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
(function(){
	
	var module = angular.module('promise-button-directive',['promise-button-controller','promise-button-templates']);

	module.directive('promiseButton', ['$compile', function($compile){
		return {
			scope: {
				'promiseButton': '&' 
			},
			controller: 'PromiseButtonController',
			restrict: 'A',
			templateUrl: 'promise-button.tpl.html',
			transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				iElm.bind('click', $scope.startAction);
			}
		};
	}]);

})();
angular.module('promise-button-templates', ['promise-button.tpl.html']);

angular.module("promise-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("promise-button.tpl.html",
    "<ng-switch on=\"status\">\n" +
    "	<span ng-switch-default ng-transclude></span>\n" +
    "	<i class=\"fa fa-circle-o-notch icon-spin\" ng-switch-when=\"loading\"></i>\n" +
    "	<i class=\"fa fa-check\" ng-switch-when=\"done\"></i>\n" +
    "</ng-switch>");
}]);
