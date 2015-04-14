(function(){

	var app = angular.module('demo',['promise-button','angular-example','ui.bootstrap']);

	app.controller('DemoController',[
		'$scope',
		'$timeout',
		'$q',
		function($scope, $timeout, $q){

			$scope.try_me = function(){
				var deferred = $q.defer();
				var count = 0;

				var check = function(){
					count += 1;
					if (count > 3){
						deferred.resolve(true);
					} else {
						deferred.notify(count);
						$timeout(check, 1200);
					}
				}

				$timeout(check,1200);


				return deferred.promise;
			}
		}
	]);

})();