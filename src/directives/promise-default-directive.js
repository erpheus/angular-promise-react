(function(){
	
	var module = angular.module('promise-button-default-directive',['promise-button-templates']);

	module.directive('promiseDefault', function(){
		return {
			scope: false,
			restrict: 'E',
			templateUrl: 'directives/promise-default.tpl.html',
			transclude: true
		};
	});


})();