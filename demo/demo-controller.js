(function(){

	var app = angular.module('demo',['promise-button','angular-example','ui.bootstrap']);

	app.controller('DemoController',[
		'$scope',
		'$timeout',
		function($scope, $timeout){

			$scope.wait_3_seconds = function(){
				return $timeout(function(){return 'bieeen!'}, 3000);
			}
		}
	]);

})();