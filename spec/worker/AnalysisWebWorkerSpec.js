import { AnalysisWebWorker } from "../../index";

/**
 * Creates a mocked scope.
 *
 * @returns {Object} The mocked scope.
 */
function createScope() {
	return {
		postMessage: jest.fn(),
	};
}

/**
 * Creates a message object.
 *
 * @param {string} type         The message type.
 * @param {Object} [payload={}] The payload.
 * @param {number} [id=0]       The request id.
 *
 * @returns {Object} The message.
 */
function createMessage( type, payload = {}, id = 0 ) {
	return {
		data: {
			type,
			id,
			payload,
		},
	};
}

// Reusing these global variables.
let scope;
let worker;

describe( "AnalysisWebWorker", () => {
	beforeAll( () => {
		scope = null;
		worker = null;
	} );

	describe( "constructor", () => {
		test( "initializes without errors", () => {
			scope = createScope();
			try {
				worker = new AnalysisWebWorker( scope );
			} catch( error ) {
			}

			expect( worker ).not.toBeNull();
			expect( worker._scope ).toBe( scope );
		} );
	} );

	describe( "register", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
		} );

		test( "binds onmessage", () => {
			expect( scope.onmessage ).not.toBeDefined();

			worker.register();

			expect( scope.onmessage ).toBeDefined();
		} );

		test( "listens to messages", () => {
			worker.handleMessage = jest.fn();
			worker.register();

			const message = createMessage( "test" );
			scope.onmessage( message );

			expect( worker.handleMessage ).toHaveBeenCalledTimes( 1 );
			expect( worker.handleMessage ).toBeCalledWith( message );
		} );

		test( "provides globals", () => {
			expect( scope.analysisWorker ).not.toBeDefined();
			expect( scope.yoast ).not.toBeDefined();

			worker.register();

			expect( scope.analysisWorker ).toBeDefined();
			expect( scope.yoast ).toBeDefined();
			expect( scope.yoast.analysis ).toBeDefined();
		} );
	} );

	describe( "handleMessage", () => {
		describe( "initialize", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "updates the configuration", () => {
				scope.onmessage( createMessage( "initialize", { testing: true } ) );

				expect( worker._configuration ).toBeDefined();
				expect( worker._configuration.testing ).toBe( true );
			} );

			test( "creates the i18n", () => {
				expect( worker._i18n ).not.toBeDefined();

				scope.onmessage( createMessage( "initialize", {
					translations: {
						domain: "messages",
						locale_data: {
							messages: {
								"" : {},
								test: [ "1234" ],
							}
						},
					}
				} ) );

				expect( worker._i18n ).toBeDefined();
				expect( worker._i18n.gettext( "test" ) ).toBe( "1234" );
			} );

			test( "sets the locale", () => {
				expect( worker._configuration.locale ).toBe( "en_US" );

				worker.createContentAssessor = jest.fn();
				scope.onmessage( createMessage( "initialize", { locale: "nl_NL" } ) );

				expect( worker._configuration.locale ).toBe( "nl_NL" );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( 1 );
			} );

			test( "creates the assessors", () => {
				worker.createContentAssessor = jest.fn();
				worker.createSEOAssessor = jest.fn();

				scope.onmessage( createMessage( "initialize", {} ) );

				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( 1 );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( 1 );
			} );

			test( "clears the cache", () => {
				worker.clearCache = jest.fn();

				scope.onmessage( createMessage( "initialize", {} ) );

				expect( worker.clearCache ).toHaveBeenCalledTimes( 1 );
			} );

			test( "sends the done message", () => {
				scope.onmessage( createMessage( "initialize" ) );

				expect( scope.postMessage ).toHaveBeenCalledTimes( 1 );
				expect( scope.postMessage ).toBeCalledWith( createMessage( "initialize:done" ).data );
			} );

			test( "starts the polling", () => {
				worker._scheduler.startPolling = jest.fn();
				scope.onmessage( createMessage( "initialize" ) );

				expect( worker._scheduler.startPolling ).toHaveBeenCalledTimes( 1 );
			} );
		} );
	} );
} );
