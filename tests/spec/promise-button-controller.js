describe('Controller: PromiseButtonController', function () {

	var STATES = {
		IDLE: 'idle',
		DONE: 'done',
		LOADING: 'loading',
		FAILED: 'failed',
		INTERMEDIATE: 'intermediate'
	}

	beforeEach(module('promise-button-controller'));

	var buttonController,
		scope,
		action;

	beforeEach(inject(function ($controller, $rootScope) {

		scope = $rootScope.$new();

		action = jasmine.createSpy('deferred_action');

		scope.promiseButton = action;

		buttonController = $controller('PromiseButtonController', {
			$scope: scope
		});

	}));



	it('should set status to idle', function () {
		expect(scope.status).toBe( STATES.IDLE );
	});

	describe('$scope.startAction', function() {

		var deferred;

		beforeEach(inject(function($q){

			action.calls.reset();

			deferred = $q.defer();

			action.and.callFake(function(){
				return deferred.promise;
			});

			scope.startAction();

		}));


		it('should start the action passed in the scope', function() {
			expect(action.calls.count()).toEqual(1);
		});

		it('should set the status to loading', function() {
			expect(scope.status).toBe( STATES.LOADING );
		});


		describe('when the deferred has updated', function() {

			var update = {a: 'test'};

			beforeEach(inject(function($rootScope){
				deferred.notify(update);
				$rootScope.$apply();
			}));

			it('should set status to intermediate when updating', function() {
				expect(scope.status).toBe( STATES.INTERMEDIATE );
			});

			it('should propagate notified value when updating', function() {
				expect(scope.state).toBe(update);
			});
		});

		describe('when the deferred has finished', function() {

			var result = {another: 'test'};

			beforeEach(inject(function($rootScope){
				deferred.resolve(result);
				$rootScope.$apply();
			}));

			it('should set status to done', function() {
				expect(scope.status).toBe( STATES.DONE );
			});

			it('should propagate the result', function() {
				expect(scope.state).toBe(result);
			});

			it('should go back to idle after a timeout', inject(function($timeout) {
				$timeout.flush();
				expect(scope.status).toBe( STATES.IDLE );
			}));

		});


		describe('when the deferred has failed', function() {

			var reason = {yet_another: 'test'};

			beforeEach(inject(function($rootScope){
				deferred.reject(reason);
				$rootScope.$apply();
			}));

			it('should set status to failed', function() {
				expect(scope.status).toBe( STATES.FAILED );
			});

			it('should propagate the reason', function() {
				expect(scope.state).toBe(reason);
			});

			it('should go back to idle after a timeout', inject(function($timeout) {
				$timeout.flush();
				expect(scope.status).toBe( STATES.IDLE );
			}));

		});


	});

});