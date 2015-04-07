var STATES = {
	IDLE: 'idle',
	LOADING: 'loading',
	INTERMEDIATE: 'intermediate',
	DONE: 'done',
	FAILED: 'failed'
}


function mockDirective(name, backups){
	angular.module('promise-button').config(function($provide){
    	$provide.decorator(name+'Directive', ['$delegate', function($delegate) {
        	//$delegate is array of all {name} directive
        	//in this case first one is angular buildin ng-click
        	//so we remove it.
        	backups[name] = $delegate.shift();
        	return $delegate;
    	}]);
	});
	angular.module('promise-button').directive(name, function() {
	    return {
	        link: function() {}
	    }
	});
}

function restoreDirective(name, backups){
	angular.module('promise-button').config(function($provide){
    	$provide.decorator(name+'Directive', ['$delegate', function($delegate) {
        	//$delegate is array of all {name} directive
        	//in this case first one is angular buildin ng-click
        	//so we remove it.
        	$delegate.pop();
        	$delegate.unshift(backups[name]);
        	return $delegate;
    	}]);
	});
}
