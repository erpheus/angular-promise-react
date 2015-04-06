(function(){
	
	var module = angular.module('promise-button',['promise-button-templates']);

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
	
	var module = angular.module('promise-button');

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
angular.module('promise-button-templates', ['directives/promise-default.tpl.html', 'promise-button.tpl.html']);

angular.module("directives/promise-default.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/promise-default.tpl.html",
    "<span ng-transclude ng-switch-default></span>\n" +
    "<i class=\"fa fa-circle-o-notch icon-spin\" ng-switch-when=\"loading\"></i>\n" +
    "<i class=\"fa fa-check\" ng-switch-when=\"done\"></i>");
}]);

angular.module("promise-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("promise-button.tpl.html",
    "<ng-switch on=\"status\">\n" +
    "	<ng-transclude></ng-transclude>\n" +
    "</ng-switch>");
}]);
