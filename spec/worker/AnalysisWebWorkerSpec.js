import { isArray, isObject, isNumber } from "lodash-es";

import AnalysisWebWorker from "../../src/worker/AnalysisWebWorker";
import Assessment from "../../src/assessment";
import Paper from "../../src/values/Paper";
import AssessmentResult from "../../src/values/AssessmentResult";
import testTexts from "../fullTextTests/testTexts";

/**
 * Creates a mocked scope.
 *
 * @returns {Object} The mocked scope.
 */
function createScope() {
	return {
		postMessage: jest.fn(),
		importScripts: jest.fn(),
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

/**
 * Creates an assessment.
 *
 * @param {string} name  The assessment identifier.
 * @param {number} score The result score.
 * @param {string} text  The result text.
 *
 * @returns {Assessment} The assessment.
 */
function createAssessment( name, score = 9, text = "Excellent" ) {
	const assessment = new Assessment();
	assessment.identifier = name;
	assessment.getResult = () => {
		const result = new AssessmentResult();
		result.setScore( score );
		result.setText( text );
		return result;
	};
	return assessment;
}

// Re-using these global variables.
let scope = null;
let worker = null;

/*
 * Couple of things to note:
 * - Transporter is used to serialize and parse the payload. However,
 *   without the wrapper we need to pass serialized data in the message.
 * - A task is async. Using the send function as the test trigger.
 * - Initialize needs to get called first most of the time.
 */
describe( "AnalysisWebWorker", () => {
	describe( "constructor", () => {
		test( "initializes without errors", () => {
			scope = createScope();
			worker = null;
			try {
				worker = new AnalysisWebWorker( scope );
			} catch ( error ) {
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
		describe( "console", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "falls back to a warning", () => {
				console.warn = jest.fn();
				scope.onmessage( createMessage( "non-existing message type" ) );

				expect( console.warn ).toHaveBeenCalledTimes( 1 );
				expect( console.warn ).toHaveBeenCalledWith( "Unrecognized command", "non-existing message type" );
			} );

			test( "logs in development", () => {
				const saveNodeEnv = global.process.env.NODE_ENV;
				global.process.env.NODE_ENV = "development";
				/* eslint-disable no-console */
				console.log = jest.fn();
				scope.onmessage( createMessage( "initialize" ) );
				expect( console.log ).toHaveBeenCalledTimes( 2 );
				expect( console.log ).toHaveBeenCalledWith( "worker <- wrapper", "initialize", 0, {} );
				expect( console.log ).toHaveBeenCalledWith( "worker -> wrapper", "initialize:done", 0, {} );

				global.process.env.NODE_ENV = saveNodeEnv;
				scope.onmessage( createMessage( "initialize" ) );
				expect( console.log ).toHaveBeenCalledTimes( 2 );
				/* eslint-enable no-console */
			} );
		} );

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

			test( "updates readability assessor", () => {
				let timesCalled = 0;
				worker.createContentAssessor = jest.fn();

				// When initializing.
				scope.onmessage( createMessage( "initialize", {} ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When switching readability analysis on/off.
				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: true } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// Not when switching seo analysis on/off.
				scope.onmessage( createMessage( "initialize", { keywordAnalysisActive: true } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( timesCalled );

				// When switching cornerstone content on/off.
				scope.onmessage( createMessage( "initialize", { useCornerstone: true } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// Not when switching taxonomy assessor on/off.
				scope.onmessage( createMessage( "initialize", { useTaxonomy: true } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( timesCalled );

				// Not when switching keyword distribution assessor on/off.
				scope.onmessage( createMessage( "initialize", { useKeywordDistribution: true } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( timesCalled );

				// When changing locale.
				scope.onmessage( createMessage( "initialize", { locale: "en_US" } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When changing translations.
				scope.onmessage( createMessage( "initialize", { translations: {} } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );
			} );

			test( "updates seo assessor", () => {
				let timesCalled = 0;
				worker.createSEOAssessor = jest.fn();

				// When initializing.
				scope.onmessage( createMessage( "initialize", {} ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// Not when switching readability analysis on/off.
				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: true } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( timesCalled );

				// When switching seo analysis on/off.
				scope.onmessage( createMessage( "initialize", { keywordAnalysisActive: true } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When switching cornerstone content on/off.
				scope.onmessage( createMessage( "initialize", { useCornerstone: true } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When switching taxonomy assessor on/off.
				scope.onmessage( createMessage( "initialize", { useTaxonomy: true } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When switching keyword distribution assessor on/off.
				scope.onmessage( createMessage( "initialize", { useKeywordDistribution: true } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When changing locale.
				scope.onmessage( createMessage( "initialize", { locale: "en_US" } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When changing translations.
				scope.onmessage( createMessage( "initialize", { translations: {} } ) );
				expect( worker.createSEOAssessor ).toHaveBeenCalledTimes( ++timesCalled );
			} );
		} );

		describe( "analyze", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
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

				worker.analyzeDone = () => {
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

			test( "skips over researcher set paper and locale when there are no paper changes", done => {
				const paper = new Paper( "This is the content." );
				// Using setLocale because setPaper is also used in the researcher. This makes is simpler.
				worker.setLocale = jest.fn();

				let firstRun = true;
				worker.analyzeDone = () => {
					expect( worker.setLocale ).toHaveBeenCalledTimes( 1 );
					if ( firstRun ) {
						scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
						firstRun = false;
						return;
					}
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "listens to the contentAnalysisActive configuration", done => {
				const paper = testTexts[ 0 ].paper;

				worker.analyzeDone = ( id, result ) => {
					// Results still get initialized.
					expect( result.readability.results.length ).toBe( 0 );
					expect( result.readability.score ).toBe( 0 );
					done();
				};

				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: false } ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "listens to the keywordAnalysisActive configuration", done => {
				const paper = testTexts[ 0 ].paper;

				worker.analyzeDone = ( id, result ) => {
					// Results still get initialized.
					expect( result.seo[ "" ].results.length ).toBe( 0 );
					expect( result.seo[ "" ].score ).toBe( 0 );
					done();
				};

				scope.onmessage( createMessage( "initialize", { keywordAnalysisActive: false } ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "processes related keywords", done => {
				const paper = testTexts[ 0 ].paper;

				worker.analyzeDone = ( id, result ) => {
					expect( isObject( result.seo.a ) ).toBe( true );
					expect( isArray( result.seo.a.results ) ).toBe( true );
					expect( isNumber( result.seo.a.score ) ).toBe( true );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyze", {
					paper: paper.serialize(),
					relatedKeywords: {
						a: { keyword: "technology" },
					},
				} ) );
			} );

			test( "analyze done calls send", () => {
				worker.send = jest.fn();
				worker.analyzeDone( 0, { result: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "analyze:done", 0, { result: true } );
			} );
		} );

		describe( "analyzeRelatedKeywords", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "schedules a task", () => {
				const paper = new Paper( "This is the content." );
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };

				worker._scheduler.schedule = jest.fn();
				scope.onmessage( createMessage( "analyzeRelatedKeywords", {
					paper: paper.serialize(),
					relatedKeywords,
				} ) );

				expect( worker._scheduler.schedule ).toHaveBeenCalledTimes( 1 );
				expect( worker._scheduler.schedule ).toHaveBeenCalledWith( {
					id: 0,
					execute: worker.analyze,
					done: worker.analyzeRelatedKeywordsDone,
					data: { paper, relatedKeywords },
					type: "analyzeRelatedKeywords",
				} );
			} );

			test( "calls analyzeRelatedKeywords", done => {
				const paper = new Paper( "This is the content." );
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };
				const spy = spyOn( worker, "analyze" );

				worker.analyzeRelatedKeywordsDone = () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( 0, { paper, relatedKeywords } );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyzeRelatedKeywords", { paper: paper.serialize(), relatedKeywords } ) );
			} );

			test( "returns results", done => {
				const paper = testTexts[ 0 ].paper;
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };

				worker.analyzeRelatedKeywordsDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( isObject( result.readability ) ).toBe( true );
					expect( isArray( result.readability.results ) ).toBe( true );
					expect( isNumber( result.readability.score ) ).toBe( true );
					expect( isObject( result.seo ) ).toBe( true );
					expect( isObject( result.seo[ "" ] ) ).toBe( true );
					expect( isArray( result.seo[ "" ].results ) ).toBe( true );
					expect( isNumber( result.seo[ "" ].score ) ).toBe( true );
					expect( isObject( result.seo.a ) ).toBe( true );
					expect( isArray( result.seo.a.results ) ).toBe( true );
					expect( isNumber( result.seo.a.score ) ).toBe( true );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "analyzeRelatedKeywords", { paper: paper.serialize(), relatedKeywords } ) );
			} );

			test( "listens to the contentAnalysisActive configuration", done => {
				const paper = testTexts[ 0 ].paper;
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };

				worker.analyzeRelatedKeywordsDone = ( id, result ) => {
					// Results still get initialized.
					expect( result.readability.results.length ).toBe( 0 );
					expect( result.readability.score ).toBe( 0 );
					done();
				};

				scope.onmessage( createMessage( "initialize", { contentAnalysisActive: false } ) );
				scope.onmessage( createMessage( "analyzeRelatedKeywords", { paper: paper.serialize(), relatedKeywords } ) );
			} );

			test( "listens to the keywordAnalysisActive configuration", done => {
				const paper = testTexts[ 0 ].paper;
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };

				worker.analyzeRelatedKeywordsDone = ( id, result ) => {
					// Results still get initialized.
					expect( result.seo[ "" ].results.length ).toBe( 0 );
					expect( result.seo[ "" ].score ).toBe( 0 );
					done();
				};

				scope.onmessage( createMessage( "initialize", { keywordAnalysisActive: false } ) );
				scope.onmessage( createMessage( "analyzeRelatedKeywords", { paper: paper.serialize(), relatedKeywords } ) );
			} );

			test( "analyze related keywords done calls send", () => {
				worker.send = jest.fn();
				worker.analyzeRelatedKeywordsDone( 0, { result: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "analyzeRelatedKeywords:done", 0, { result: true } );
			} );
		} );

		describe( "loadScript", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "schedules a task", () => {
				const payload = { url: "http://example.com" };

				worker._scheduler.schedule = jest.fn();
				scope.onmessage( createMessage( "loadScript", payload ) );

				expect( worker._scheduler.schedule ).toHaveBeenCalledTimes( 1 );
				expect( worker._scheduler.schedule ).toHaveBeenCalledWith( {
					id: 0,
					execute: worker.loadScript,
					done: worker.loadScriptDone,
					data: payload,
					type: "loadScript",
				} );
			} );

			test( "calls loadScript", done => {
				const payload = { url: "http://example.com" };
				const spy = spyOn( worker, "loadScript" );

				worker.loadScriptDone = () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( 0, payload );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "loadScript", payload ) );
			} );

			test( "loads a script", done => {
				const payload = { url: "http://example.com" };

				worker.loadScriptDone = ( id, result ) => {
					expect( scope.importScripts ).toHaveBeenCalledTimes( 1 );
					expect( scope.importScripts ).toHaveBeenCalledWith( payload.url );
					expect( result.loaded ).toBe( true );
					expect( result.url ).toBe( payload.url );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "loadScript", payload ) );
			} );

			test( "handles undefined with a message", done => {
				worker.loadScriptDone = ( id, result ) => {
					expect( result.loaded ).toBe( false );
					expect( result.message ).toBe( "Load Script was called without an URL." );
					expect( result.url ).toBeUndefined();
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "loadScript" ) );
			} );

			test( "handles importScripts error with the error message", done => {
				const payload = { url: "http://example.com" };

				scope.importScripts = () => {
					throw new Error( "Simulated error!" );
				};

				worker.loadScriptDone = ( id, result ) => {
					expect( result.loaded ).toBe( false );
					expect( result.message ).toBe( "Simulated error!" );
					expect( result.url ).toBe( payload.url );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "loadScript", payload ) );
			} );

			test( "load script done calls send on success", () => {
				worker.send = jest.fn();
				worker.loadScriptDone( 0, { loaded: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "loadScript:done", 0, { loaded: true } );
			} );

			test( "load script done calls send on failure", () => {
				worker.send = jest.fn();
				worker.loadScriptDone( 0, { loaded: false } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "loadScript:failed", 0, { loaded: false } );
			} );
		} );

		describe( "customMessage", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "schedules a task", () => {
				const name = "test";
				const payload = { name, data: { test: true } };

				worker._scheduler.schedule = jest.fn();
				worker._registeredMessageHandlers[ name ] = ( data ) => data;
				scope.onmessage( createMessage( "customMessage", payload ) );

				expect( worker._scheduler.schedule ).toHaveBeenCalledTimes( 1 );
				expect( worker._scheduler.schedule ).toHaveBeenCalledWith( {
					id: 0,
					execute: worker.customMessage,
					done: worker.customMessageDone,
					data: payload,
					type: "customMessage",
				} );
			} );

			test( "calls customMessage", done => {
				const name = "test";
				const payload = { name, data: { test: true } };
				const spy = spyOn( worker, "customMessage" );

				worker._registeredMessageHandlers[ name ] = ( data ) => data;
				worker.customMessageDone = () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( 0, payload );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "customMessage", payload ) );
			} );

			test( "handles no registered message handler", done => {
				const name = "test";
				const payload = { name, data: { test: true } };

				worker.customMessageDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.error ).toBeDefined();
					expect( result.error.message ).toBe( "No message handler registered for messages with name: " + name );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "customMessage", payload ) );
			} );

			test( "handles message handler error", done => {
				const name = "test";
				const payload = { name, data: { test: true } };

				worker._registeredMessageHandlers[ name ] = () => {
					throw new Error( "Simulated error!" );
				};
				worker.customMessageDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.error ).toBeDefined();
					expect( result.error.message ).toBe( "Simulated error!" );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "customMessage", payload ) );
			} );

			test( "returns custom data", done => {
				const name = "test";
				const payload = { name, data: { test: true } };

				worker._registeredMessageHandlers[ name ] = ( data ) => {
					data.handled = "yes";
					return data;
				};
				worker.customMessageDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.error ).toBeUndefined();
					expect( result.data ).toEqual( {
						test: true,
						handled: "yes",
					} );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "customMessage", payload ) );
			} );

			test( "custom message done calls send on success", () => {
				worker.send = jest.fn();
				worker.customMessageDone( 0, { success: true, data: "data" } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "customMessage:done", 0, "data" );
			} );

			test( "custom message done calls send on failure", () => {
				worker.send = jest.fn();
				worker.customMessageDone( 0, { success: false, error: "failed" } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "customMessage:failed", "failed" );
			} );
		} );

		describe( "runResearch", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope );
				worker.register();
			} );

			test( "schedules a task", () => {
				const name = "test";
				const payload = { name };

				worker._scheduler.schedule = jest.fn();
				scope.onmessage( createMessage( "runResearch", payload ) );

				expect( worker._scheduler.schedule ).toHaveBeenCalledTimes( 1 );
				expect( worker._scheduler.schedule ).toHaveBeenCalledWith( {
					id: 0,
					execute: worker.runResearch,
					done: worker.runResearchDone,
					data: payload,
				} );
			} );

			test( "calls runResearch", done => {
				const name = "test";
				const payload = { name };
				const spy = spyOn( worker, "runResearch" );

				worker.runResearchDone = () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( 0, payload );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "handles a non-existing research request", done => {
				const name = "test";
				const payload = { name };

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( result ).toBe( false );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "returns the research result", done => {
				const name = "firstParagraph";
				const paper = testTexts[ 0 ].paper;
				const payload = { name, paper: paper.serialize() };

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.foundInOneSentence ).toBe( true );
					expect( result.foundInParagraph ).toBe( true );
					expect( result.keyphraseOrSynonym ).toBe( "keyphrase" );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "run research done calls send", () => {
				worker.send = jest.fn();
				worker.runResearchDone( 0, { result: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "runResearch:done", 0, { result: true } );
			} );
		} );
	} );

	describe( "createContentAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
		} );

		test( "listens to contentAnalysisActive", () => {
			worker._configuration.contentAnalysisActive = false;
			expect( worker.createContentAssessor() ).toBeNull();

			worker._configuration.contentAnalysisActive = true;
			expect( worker.createContentAssessor() ).not.toBeNull();
		} );

		test( "listens to useCornerstone", () => {
			worker._configuration.useCornerstone = false;
			let assessor = worker.createContentAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "ContentAssessor" );

			worker._configuration.useCornerstone = true;
			assessor = worker.createContentAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "CornerstoneContentAssessor" );
		} );
	} );

	describe( "createSEOAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
		} );

		test( "listens to keywordAnalysisActive", () => {
			worker._configuration.keywordAnalysisActive = false;
			expect( worker.createSEOAssessor() ).toBeNull();

			worker._configuration.keywordAnalysisActive = true;
			expect( worker.createSEOAssessor() ).not.toBeNull();
		} );

		test( "listens to useCornerstone", () => {
			worker._configuration.useCornerstone = false;
			let assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "SEOAssessor" );

			worker._configuration.useCornerstone = true;
			assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "CornerstoneSEOAssessor" );
		} );

		test( "listens to useTaxonomy", () => {
			worker._configuration.useTaxonomy = false;
			let assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "SEOAssessor" );

			worker._configuration.useTaxonomy = true;
			assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "TaxonomyAssessor" );
		} );

		test( "listens to useKeywordDistribution", () => {
			worker._configuration.useKeywordDistribution = false;
			let assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "SEOAssessor" );
			let assessment = assessor.getAssessment( "keyphraseDistribution" );
			expect( assessment ).not.toBeDefined();

			worker._configuration.useKeywordDistribution = true;
			assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "SEOAssessor" );
			assessment = assessor.getAssessment( "keyphraseDistribution" );
			expect( assessment ).toBeDefined();
			expect( assessment.identifier ).toBe( "keyphraseDistribution" );

			worker._configuration.useCornerstone = true;
			worker._configuration.useKeywordDistribution = true;
			assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "CornerstoneSEOAssessor" );
			assessment = assessor.getAssessment( "keyphraseDistribution" );
			expect( assessment ).toBeDefined();
			expect( assessment.identifier ).toBe( "keyphraseDistribution" );
		} );

		test( "adds registered assessments", () => {
			const assessment = createAssessment( "assessment" );
			worker.registerAssessment( "assessment", assessment, "plugin" );

			const assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			const actualAssessment = assessor.getAssessment( "assessment" );
			expect( actualAssessment ).toBeDefined();
			expect( actualAssessment.identifier ).toBe( "assessment" );
		} );
	} );

	describe( "registerAssessment", () => {
		const assessmentName = "Knock knock";
		const pluginName = "Who?";
		const assessment = createAssessment( assessmentName );

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to register assessment for plugin " + pluginName + ". Expected parameter `name` to be a string.";
			expect( () => worker.registerAssessment( null, assessment, pluginName ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid assessment", () => {
			const errorMessage = "Failed to register assessment for plugin " + pluginName + ". Expected parameter `assessment` to be a function.";
			expect( () => worker.registerAssessment( assessmentName, null, pluginName ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid plugin name", () => {
			const errorMessage = "Failed to register assessment for plugin null. Expected parameter `pluginName` to be a string.";
			expect( () => worker.registerAssessment( assessmentName, assessment, null ) ).toThrowError( errorMessage );
		} );

		test( "adds the assessment", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._seoAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName );
			const actualAssessment = worker._seoAssessor.getAssessment( assessmentName );
			expect( actualAssessment ).toBeDefined();
			expect( actualAssessment ).toBe( assessment );
		} );

		test( "add the assessment to the registered assessments", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._seoAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName );
			expect( worker._registeredAssessments.length ).toBe( 1 );
			expect( worker._registeredAssessments[ 0 ].assessment ).toBe( assessment );
		} );

		test( "call refresh assessment", () => {
			scope.onmessage( createMessage( "initialize" ) );
			worker.refreshAssessment = jest.fn();
			worker.registerAssessment( assessmentName, assessment, pluginName );

			expect( worker.refreshAssessment ).toHaveBeenCalledTimes( 1 );
			expect( worker.refreshAssessment ).toHaveBeenCalledWith( assessmentName, pluginName );
		} );
	} );

	describe( "registerMessageHandler", () => {
		const handlerName = "Knock knock";
		const pluginName = "Who?";
		const handler = () => true;

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to register handler for plugin " + pluginName + ". Expected parameter `name` to be a string.";
			expect( () => worker.registerMessageHandler( null, handler, pluginName ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid handler", () => {
			const errorMessage = "Failed to register handler for plugin " + pluginName + ". Expected parameter `handler` to be a function.";
			expect( () => worker.registerMessageHandler( handlerName, null, pluginName ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid plugin name", () => {
			const errorMessage = "Failed to register handler for plugin null. Expected parameter `pluginName` to be a string.";
			expect( () => worker.registerMessageHandler( handlerName, handler, null ) ).toThrowError( errorMessage );
		} );

		test( "add the handler to the registered message handlers", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._seoAssessor ).not.toBeNull();

			worker.registerMessageHandler( handlerName, handler, pluginName );
			expect( worker._registeredMessageHandlers[ pluginName + "-" + handlerName ] ).toBe( handler );
		} );
	} );

	describe( "refreshAssessment", () => {
		const assessmentName = "Knock knock";
		const pluginName = "Who?";

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to refresh assessment for plugin " + pluginName + ". Expected parameter `name` to be a string.";
			expect( () => worker.refreshAssessment( null, pluginName ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid plugin name", () => {
			const errorMessage = "Failed to refresh assessment for plugin null. Expected parameter `pluginName` to be a string.";
			expect( () => worker.refreshAssessment( assessmentName, null ) ).toThrowError( errorMessage );
		} );

		test( "calls clear cache", () => {
			scope.onmessage( createMessage( "initialize" ) );
			worker.clearCache = jest.fn();

			worker.refreshAssessment( assessmentName, pluginName );
			expect( worker.clearCache ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "clearCache", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
			worker.register();
		} );

		test( "sets paper to null", () => {
			worker._paper = new Paper( "This is the content." );
			worker.clearCache();
			expect( worker._paper ).toBeNull();
		} );
	} );

	describe( "setLocale", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
			worker.register();
		} );

		test( "sets the locale", () => {
			expect( worker._configuration.locale ).toBe( "en_US" );
			worker.setLocale( "nl_NL" );
			expect( worker._configuration.locale ).toBe( "nl_NL" );
		} );

		test( "calls create content assessor", () => {
			worker.createContentAssessor = jest.fn();
			worker.setLocale( "nl_NL" );
			expect( worker.createContentAssessor ).toHaveBeenCalledTimes( 1 );
		} );

		test( "returns when the passed locale is already set", () => {
			worker.createContentAssessor = jest.fn();
			worker.setLocale( "en_US" );
			expect( worker.createContentAssessor ).toHaveBeenCalledTimes( 0 );
		} );
	} );

	describe( "shouldReadabilityUpdate", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
		} );

		test( "returns true when the existing paper is null", () => {
			const paper = new Paper( "This does not matter here." );
			worker._paper = null;
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the paper text is different", () => {
			const paper = new Paper( "This is different content." );
			worker._paper = new Paper( "This is the content." );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the paper locale is different", () => {
			const paper = new Paper( "This is the content.", { locale: "en_US" } );
			worker._paper = new Paper( "This is the content.", { locale: "nl_NL"  } );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );

		test( "returns false when the text and locale are the same", () => {
			const paper = new Paper( "This is the content." );
			worker._paper = new Paper( "This is the content." );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( false );
		} );
	} );

	describe( "shouldSeoUpdate", () => {
		const key = "a";
		const keyword = "test";
		const synonyms = "spec";

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope );
		} );

		test( "returns true when the related keyword key is not known", () => {
			expect( worker.shouldSeoUpdate( key, { keyword, synonyms } ) ).toBe( true );
		} );

		test( "returns true when the keyword is different", () => {
			worker._relatedKeywords[ key ] = { keyword, synonyms };
			expect( worker.shouldSeoUpdate( key, { keyword: "snowflake", synonyms } ) ).toBe( true );
		} );

		test( "returns true when the synonyms is different", () => {
			worker._relatedKeywords[ key ] = { keyword, synonyms };
			expect( worker.shouldSeoUpdate( key, { keyword, synonyms: "snowflake" } ) ).toBe( true );
		} );

		test( "returns false when the keyword and synonyms are the same", () => {
			worker._relatedKeywords[ key ] = { keyword, synonyms };
			expect( worker.shouldSeoUpdate( key, { keyword, synonyms } ) ).toBe( false );
		} );
	} );
} );
