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