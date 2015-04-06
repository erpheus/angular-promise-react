var STATES = {
	IDLE: 'idle',
	LOADING: 'loading',
	INTERMEDIATE: 'intermediate',
	DONE: 'done',
	FAILED: 'failed'
}


function mockDirective(name){
		angular.module('promise-button-default-directive').config(function($provide){
	    	$provide.decorator(name+'Directive', ['$delegate', function($delegate) {
	        	//$delegate is array of all ng-click directive
	        	//in this case first one is angular buildin ng-click
	        	//so we remove it.
	        	$delegate.shift();
	        	return $delegate;
	    	}]);
		});
		angular.module('promise-button-default-directive').directive(name, function() {
		    return {
		        link: function() {}
		    }
		});
}