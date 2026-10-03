import Scheduler from "../../../src/worker/scheduler/Scheduler";

jest.useRealTimers();

describe( "Worker Scheduler", () => {
	let scheduler;

	describe( "Polling", () => {
		afterEach( () => {
			// Make sure we don't keep polling after the tests are done.
			scheduler.stopPolling();
		} );

		test( "the poll time to default to 50ms", () => {
			scheduler = new Scheduler();

			expect( scheduler._configuration.pollTime ).toBe( 50 );
		} );

		test( "configure the poll time", () => {
			scheduler = new Scheduler( { pollTime: 222 } );

			expect( scheduler._configuration.pollTime ).toBe( 222 );
		} );

		test( "startPolling sets started and calls tick", () => {
			scheduler = new Scheduler();
			scheduler.tick = jest.fn();

			expect( scheduler._started ).toBe( false );
			expect( scheduler.tick ).not.toHaveBeenCalled();

			// Activate the scheduler.
			scheduler.startPolling();

			expect( scheduler._started ).toBe( true );
			expect( scheduler.tick ).toHaveBeenCalled();
		} );

		test( "tick calls executeNextTask and calls itself again each poll time", done => {
			scheduler = new Scheduler( { pollTime: 50 } );
			scheduler.executeNextTask = jest.fn();
			scheduler.executeNextTask.mockReturnValue( Promise.resolve() );

			// Check the initial values.
			expect( scheduler._started ).toBe( false );
			expect( scheduler.executeNextTask ).toHaveBeenCalledTimes( 0 );

			// Activate the scheduler.
			scheduler.startPolling();

			expect( scheduler._started ).toBe( true );
			expect( scheduler.executeNextTask ).toHaveBeenCalledTimes( 1 );

			/*
			 * Check after the poll time that the executeNextTime has been called again.
			 * Adding a 'magic' 10ms to give it time to get there.
			 */
			setTimeout( () => {
				expect( scheduler.executeNextTask ).toHaveBeenCalledTimes( 2 );
				done();
			}, scheduler._configuration.pollTime + 10 );
		} );

		test( "stopPolling clears the timer", done => {
			scheduler = new Scheduler();
			scheduler.startPolling();

			expect( scheduler._started ).toBe( true );

			// Adding a 'magic' 10ms to give it time to get there.
			setTimeout( () => {
				expect( scheduler._pollHandle ).not.toBeNull();

				scheduler.stopPolling();

				expect( scheduler._started ).toBe( false );
				expect( scheduler._pollHandle ).toBeNull();

				done();
			}, scheduler._configuration.pollTime + 10 );
		} );
	} );

	describe( "Scheduling a task", () => {
		beforeEach( () => {
			scheduler = new Scheduler();
		} );

		test( "schedule enqueues a task", () => {
			expect( scheduler._tasks.analyze.length ).toBe( 0 );

			scheduler.schedule( { id: 0, execute: () => {}, done: () => {}, data: { test: true }, type: "analyze" } );

			expect( scheduler._tasks.analyze.length ).toBe( 1 );
			expect( scheduler._tasks.analyze[ 0 ].id ).toBe( 0 );
			expect( scheduler._tasks.analyze[ 0 ].data ).toEqual( { test: true } );
		} );

		test( "getNextTask prioritizes tasks by type", () => {
			// Add a task in every type.
			scheduler.schedule( { id: 0, execute: () => {}, done: () => {}, data: {}, type: "something" } );
			scheduler.schedule( { id: 1, execute: () => {}, done: () => {}, data: {}, type: "analyzeRelatedKeywords" } );
			scheduler.schedule( { id: 2, execute: () => {}, done: () => {}, data: {}, type: "analyze" } );
			scheduler.schedule( { id: 3, execute: () => {}, done: () => {}, data: {}, type: "customMessage" } );

			expect( scheduler.getNextTask().id ).toBe( 3 );
			expect( scheduler.getNextTask().id ).toBe( 2 );
			expect( scheduler.getNextTask().id ).toBe( 1 );
			expect( scheduler.getNextTask().id ).toBe( 0 );
			expect( scheduler.getNextTask() ).toBeNull();
		} );

		test( "Task.execute gets called with the id and data of a task", done => {
			const id = 9;
			const data = { some: "value" };
			const execute = jest.fn();
			scheduler.schedule( { id, execute, done: () => {}, data, type: "analyze" } );
			scheduler.executeNextTask().then( () => {
				expect( execute ).toBeCalledTimes( 1 );
				expect( execute ).toBeCalledWith( id, data );
				done();
			} );
		} );

		test( "Task.done gets called with the id and the result of a task", testDone => {
			const id = 42;
			const execute = () => "result";
			const done = jest.fn();
			scheduler.schedule( { id, execute, done, data: {}, type: "analyze" } );
			scheduler.executeNextTask().then( result => {
				expect( done ).toBeCalledTimes( 1 );
				expect( done ).toBeCalledWith( id, "result" );
				expect( result ).toBe( "result" );
				testDone();
			} );
		} );
	} );
} );
