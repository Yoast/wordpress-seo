import WorkerProxy from "../../src/agnostic/WorkerProxy";

/**
 * Creates a mocked scope.
 *
 * @returns {Object} The mocked scope.
 */
function mockScope() {
	return {
		postMessage: jest.fn(),
	};
}

/**
 * Mocks the analysis.
 *
 * @returns {Object} The mocked analysis.
 */
function mockAnalysis() {
	return {
		initialize: jest.fn(),
		analyze: jest.fn(),
	};
}

/**
 * Mocks the scheduler.
 *
 * @param {boolean} needsToError Whether the scheduled task needs to fail and return an error.
 *
 * @returns {Object} The mocked scheduler.
 */
function mockScheduler( needsToError = false ) {
	return {
		schedule: jest.fn(
			( task ) => {
				if ( needsToError ) {
					return task.done( task.id, { error: "an error" }, task.type );
				}
				return task.done( task.id, task.data, task.type );
			}
		),
		startPolling: jest.fn(),
	};
}

/**
 * Mocks a logger.
 *
 * @returns {Object} The mocked logger.
 */
function mockLogger() {
	return {
		debug: jest.fn(),
		error: jest.fn(),
	};
}

describe( "The WorkerProxy", () => {
	it( "can handle a message with a payload", () => {
		const scope = mockScope();
		const analysis = mockAnalysis();
		const scheduler = mockScheduler();

		const proxy = new WorkerProxy( scope, analysis );
		proxy._scheduler = scheduler;

		const message = {
			data: {
				type: "analyze",
				id: 1,
				payload: {},
			},
		};

		proxy.handleMessage( message );

		expect( scope.postMessage ).toHaveBeenCalledWith( {
			type: "analyze:done",
			id: 1,
			payload: {},
		} );
	} );

	it( "can handle a message with an invalid type", () => {
		const scope = mockScope();
		const analysis = mockAnalysis();
		const scheduler = mockScheduler();
		const logger = mockLogger();

		const proxy = new WorkerProxy( scope, analysis );
		proxy._scheduler = scheduler;
		proxy._logger = logger;

		const message = {
			data: {
				type: "something",
				id: 1,
				payload: {},
			},
		};

		proxy.handleMessage( message );

		/*
		 * The method that should handle the message does not exist,
		 * so we do not expect the message to be scheduled.
		 */
		expect( scheduler.schedule ).toHaveBeenCalledTimes( 0 );

		/*
		 * Instead, it should log an error message.
		 */
		expect( logger.error ).toHaveBeenCalledWith(
			"Trying to call non-existent method on Object: something"
		);
	} );

	it( "can handle an initialize message", () => {
		const scope = mockScope();
		const analysis = mockAnalysis();
		const scheduler = mockScheduler();

		const proxy = new WorkerProxy( scope, analysis );
		proxy._scheduler = scheduler;

		const message = {
			data: {
				type: "initialize",
				id: 1,
				payload: {},
			},
		};

		proxy.handleMessage( message );

		expect( scheduler.startPolling ).toHaveBeenCalled();
		expect( analysis.initialize ).toHaveBeenCalled();
	} );

	it( "handles failed method calls", () => {
		const scope = mockScope();
		const analysis = mockAnalysis();
		const scheduler = mockScheduler( true );

		const proxy = new WorkerProxy( scope, analysis );
		proxy._scheduler = scheduler;

		const message = {
			data: {
				type: "analyze",
				id: 1,
				payload: {},
			},
		};

		proxy.handleMessage( message );

		expect( scope.postMessage ).toHaveBeenCalledWith( {
			type: "analyze:failed",
			id: 1,
			payload: {
				error: "an error",
			},
		} );
	} );

	it( "handles custom messages with registered custom handlers", () => {
		const scope = mockScope();
		const analysis = mockAnalysis();
		const scheduler = mockScheduler();

		const proxy = new WorkerProxy( scope, analysis );
		proxy._scheduler = scheduler;

		const message = {
			data: {
				type: "some-message",
				id: 1,
				payload: {},
			},
		};

		const customHandler = jest.fn();

		proxy.registerCustomHandler( "some-message", customHandler );

		expect( Object.keys( proxy._customHandlers ) ).toContain( "some-message" );
		expect( proxy._customHandlers[ "some-message" ] ).toEqual( customHandler );

		proxy.handleMessage( message );

		expect( scope.postMessage ).toHaveBeenCalledWith( {
			type: "some-message:done",
			id: 1,
			payload: {},
		} );
	} );
} );
