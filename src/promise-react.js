(function(){
	'use strict';

	var module = angular.module('promise-react',['promise-react-templates']);

	module.constant('STATES', {
		IDLE: 'idle',
		LOADING: 'loading',
		INTERMEDIATE: 'intermediate',
		DONE: 'done',
		FAILED: 'failed'
	});

})();