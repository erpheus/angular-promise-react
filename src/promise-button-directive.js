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