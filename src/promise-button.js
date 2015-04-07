(function(){
	
	var module = angular.module('promise-button',['promise-button-templates']);

	module.constant('STATES', {
        IDLE: 'idle',
		LOADING: 'loading',
		INTERMEDIATE: 'intermediate',
		DONE: 'done',
		FAILED: 'failed'
    });

})();