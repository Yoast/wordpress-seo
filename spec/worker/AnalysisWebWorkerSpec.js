import { forEach, get, isArray, isObject, isNumber } from "lodash-es";

import AnalysisWebWorker from "../../src/worker/AnalysisWebWorker";
import Paper from "../../src/values/Paper";
import testTexts from "../fullTextTests/testTexts";
import {
	isCornerstoneContentAssessor,
	isCornerstoneSeoAssessor,
} from "../helpers/isCornerstoneAssessor";

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
				global.process.env.NODE_ENV = "development";
				console.log = jest.fn();
				scope.onmessage( createMessage( "testing" ) );

				expect( console.log ).toHaveBeenCalledTimes( 1 );
				expect( console.log ).toHaveBeenCalledWith( "worker <- wrapper", "testing", 0, {} );
			} );
		});

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
					expect( isObject( result.seo[ "a" ] ) ).toBe( true );
					expect( isArray( result.seo[ "a" ].results ) ).toBe( true );
					expect( isNumber( result.seo[ "a" ].score ) ).toBe( true );
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

				worker.analyzeRelatedKeywordsDone = ( id, result ) => {
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

				worker.loadScriptDone = ( id, result ) => {
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
				worker.customMessageDone = ( id, result ) => {
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
					expect( isObject( result ) ).toBe( true);
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

				worker.runResearchDone = ( id, result ) => {
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
					expect( isNumber( result ) ).toBe( true );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
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
			expect( isCornerstoneContentAssessor( worker.createContentAssessor() ) ).toBe( false );

			worker._configuration.useCornerstone = true;
			expect( isCornerstoneContentAssessor( worker.createContentAssessor() ) ).toBe( true );
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
			expect( isCornerstoneSeoAssessor( worker.createSEOAssessor() ) ).toBe( false );

			worker._configuration.useCornerstone = true;
			expect( isCornerstoneSeoAssessor( worker.createSEOAssessor() ) ).toBe( true );
		} );
	} );
} );
