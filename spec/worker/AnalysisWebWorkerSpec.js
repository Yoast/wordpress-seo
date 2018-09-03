import { isArray, isObject, isNumber } from "lodash-es";

import AnalysisWebWorker from "../../src/worker/AnalysisWebWorker";
import Paper from "../../src/values/Paper";
import testTexts from "../fullTextTests/testTexts";

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

// Re-using these global variables.
let scope = null;
let worker = null;
let spy = null;

describe( "AnalysisWebWorker", () => {
	describe( "constructor", () => {
		test( "initializes without errors", () => {
			scope = createScope();
			worker = null;
			try {
				worker = new AnalysisWebWorker( scope );
			} catch( error ) {
				// eslint-ignore-line no-empty
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

			test( "calls initialize", () => {
				const configuration = { testing: true };
				worker.initialize = jest.fn();
				scope.onmessage( createMessage( "initialize", { configuration } ) );

				expect( worker.initialize ).toHaveBeenCalledTimes( 1 );
				expect( worker.initialize ).toHaveBeenCalledWith( 0, { configuration } );
			} );

			test( "updates the configuration", () => {
				scope.onmessage( createMessage( "initialize", { testing: true } ) );

				expect( worker._configuration ).toBeDefined();
				expect( worker._configuration.testing ).toBe( true );
			} );

			test( "overwrites default configuration", () => {
				expect( worker._configuration.contentAnalysisActive ).toBe( true );

				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: false } ) );

				expect( worker._configuration.contentAnalysisActive ).toBe( false );
			} );

			test( "creates the i18n", () => {
				expect( worker._i18n ).not.toBeDefined();

				scope.onmessage( createMessage( "initialize", {
					translations: {
						domain: "messages",
						// eslint-disable-next-line camelcase
						locale_data: {
							messages: {
								"": {},
								test: [ "1234" ],
							},
						},
					},
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

			test( "starts the polling of the scheduler", () => {
				worker._scheduler.startPolling = jest.fn();
				scope.onmessage( createMessage( "initialize" ) );

				expect( worker._scheduler.startPolling ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		/*
		 * Couple of things to note:
		 * - Transporter is used to serialize and parse the payload. However,
		 *   without the wrapper we need to pass serialized data in the message.
		 * - A task is async. Using analyzeDone as a test trigger.
		 */
		describe( "analyze", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			afterEach( () => {
				if ( spy ) {
					spy.mockRestore();
					spy = null;
				}
			} );

			test( "schedules a task", () => {
				const paper = new Paper( "This is the content." );

				worker._scheduler.schedule = jest.fn();
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );

				expect( worker._scheduler.schedule ).toHaveBeenCalledTimes( 1 );
				expect( worker._scheduler.schedule ).toHaveBeenCalledWith( {
					id: 0,
					execute: worker.analyze,
					done: worker.analyzeDone,
					data: { paper },
					type: "analyze",
				} );
			} );

			test( "calls analyze", done => {
				const paper = new Paper( "This is the content." );
				const spy = spyOn( worker, "analyze" );

				worker.analyzeDone = ( id, result ) => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( 0, { paper } );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "returns results", done => {
				const paper = testTexts[ 0 ].paper;

				worker.analyzeDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( isObject( result.readability ) ).toBe( true );
					expect( isArray( result.readability.results ) ).toBe( true );
					expect( isNumber( result.readability.score ) ).toBe( true );
					expect( isObject( result.seo ) ).toBe( true );
					expect( isObject( result.seo[ "" ] ) ).toBe( true );
					expect( isArray( result.seo[ "" ].results ) ).toBe( true );
					expect( isNumber( result.seo[ "" ].score ) ).toBe( true );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "listens to the contentAnalysisActive configuration", done => {
				const paper = new Paper( "This is the content." );

				worker.analyzeDone = ( id, result ) => {
					// Results still get initialized.
					expect( result.readability.results.length ).toBe( 0 );
					expect( result.readability.score ).toBe( 0 );
					done();
				};

				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: false } ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );
		} );
	} );
} );
