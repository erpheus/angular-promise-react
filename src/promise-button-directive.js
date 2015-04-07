(function(){
	
	var module = angular.module('promise-button');

	module.directive('promiseButton', ['$compile', function($compile){
		return {
			scope: {
				'promiseButton': '&' 
			},
			controller: 'PromiseButtonController',
			restrict: 'A',
			link: function($scope, iElm, iAttrs, controller) {
				var trigger = iAttrs['promiseTrigger'] || 'click';
				iElm.bind(trigger, $scope.startAction);
			}
		};
	}]);

})();