(function(){

	var app = angular.module('demo',['promise-button-directive']);

	app.controller('DemoController',[
		'$scope',
		'$timeout',
		function($scope, $timeout){
			$scope.hola = 'Hello!';

			$scope.wait_3_seconds = function(){
				return $timeout(function(){return 'bieeen!'}, 3000);
			}
		}
	]);

})();