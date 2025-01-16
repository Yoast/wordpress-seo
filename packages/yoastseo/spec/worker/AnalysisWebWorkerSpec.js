// External dependencies
import { forEach, isArray, isNumber, isObject } from "lodash";
import { getLogger } from "loglevel";

// Internal dependencies
import AnalysisWebWorker from "../../src/worker/AnalysisWebWorker.js";
import { createShortlink } from "../../src/helpers/shortlinker";
import Assessment from "../../src/scoring/assessments/assessment.js";
import SEOAssessor from "../../src/scoring/assessors/seoAssessor.js";
import ContentAssessor from "../../src/scoring/assessors/contentAssessor.js";
import { SEOScoreAggregator } from "../../src/scoring/scoreAggregators";
import { TreeResearcher } from "../../src/parsedPaper/research";
import AssessmentResult from "../../src/values/AssessmentResult.js";
import Paper from "../../src/values/Paper.js";
import InvalidTypeError from "../../src/errors/invalidType.js";
import { StructuredNode } from "../../src/parsedPaper/structure/tree";


// Full-length texts to test
import testTexts from "../fullTextTests/testTexts";

// Test helpers
import TestResearch from "../specHelpers/tree/TestResearch.js";
import getMorphologyData from "../specHelpers/getMorphologyData.js";
import TestAssessment from "../specHelpers/tree/TestAssessment.js";

import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher.js";
let researcher = new EnglishResearcher();
const morphologyData = getMorphologyData( "en" );

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
	afterEach( () => {
		// Make sure we don't keep polling after the tests are done.
		if ( worker ) {
			worker._scheduler.stopPolling();
		}
	} );

	describe( "constructor", () => {
		test( "initializes without errors", () => {
			scope = createScope();
			worker = null;
			try {
				worker = new AnalysisWebWorker( scope, researcher );
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
			worker = new AnalysisWebWorker( scope, researcher );
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
		} );
	} );

	describe( "handleMessage", () => {
		describe( "console", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope, researcher );
				worker.register();
			} );

			test( "falls back to a warning", () => {
				console.warn = jest.fn();
				scope.onmessage( createMessage( "non-existing message type" ) );

				expect( console.warn ).toHaveBeenCalledTimes( 1 );
				expect( console.warn ).toHaveBeenCalledWith( "AnalysisWebWorker unrecognized action:", "non-existing message type" );
			} );

			test( "calls logger debug", () => {
				const logger = getLogger( "yoast-analysis-worker" );
				const spy = jest.spyOn( logger, "debug" );

				scope.onmessage( createMessage( "initialize" ) );
				expect( spy ).toHaveBeenCalledTimes( 2 );
				expect( spy ).toHaveBeenCalledWith( "AnalysisWebWorker incoming:", "initialize", 0, {} );
				expect( spy ).toHaveBeenCalledWith( "AnalysisWebWorker outgoing:", "initialize:done", 0, {} );
			} );
		} );

		describe( "shouldAssessorsUpdate", () => {
			const updateAll = { readability: true, seo: true, inclusiveLanguage: true };
			const updateNone = { readability: false, seo: false, inclusiveLanguage: false };
			const updateReadability = { readability: true, seo: false, inclusiveLanguage: false };
			const updateSEO = { readability: false, seo: true, inclusiveLanguage: false };
			const updateSEOAndReadability = { readability: true, seo: true, inclusiveLanguage: false };

			test( "update all when an empty configuration is passed", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( {} ) ).toEqual( updateAll );
			} );

			test( "update all when an empty configuration is passed along with null assessors", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( {}, null, null ) ).toEqual( updateAll );
			} );

			test( "update none when an empty configuration is passed along with non-null assessors", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( {}, false, false, false ) ).toEqual( updateNone );
			} );

			test( "update readability with contentAnalysisActive", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { contentAnalysisActive: true }, false, false, false ) )
					.toEqual( updateReadability );
			} );

			test( "update seo with keywordAnalysisActive", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { keywordAnalysisActive: true }, false, false, false ) )
					.toEqual( updateSEO );
			} );

			test( "update both SEO and readability with useCornerstone", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { useCornerstone: true }, false, false, false ) )
					.toEqual( updateSEOAndReadability );
			} );

			test( "update seo with useTaxonomy", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { useTaxonomy: true }, false, false, false ) ).toEqual( updateSEO );
			} );

			test( "update all with locale", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { locale: "en_US" }, false, false, false ) ).toEqual( updateAll );
			} );

			test( "update all with translations", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { translations: {} }, false, false, false ) ).toEqual( updateAll );
			} );

			test( "update seo with researchData", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { researchData: {} }, false, false, false ) ).toEqual( updateSEO );
			} );

			test( "update both SEO and readability with customAnalysis", () => {
				expect( AnalysisWebWorker.shouldAssessorsUpdate( { customAnalysisType: "test" }, false, false, false ) )
					.toEqual( updateSEOAndReadability );
			} );
		} );

		describe( "initialize", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope, researcher );
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
					messages: {
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
			} );

			test( "sets the locale", () => {
				expect( worker._configuration.locale ).toBe( "en_US" );

				worker.createContentAssessor = jest.fn();
				scope.onmessage( createMessage( "initialize", { locale: "nl_NL" } ) );

				expect( worker._configuration.locale ).toBe( "nl_NL" );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( 1 );
			} );

			test( "sets the log level", () => {
				const logger = getLogger( "yoast-analysis-worker" );
				const saveLogLevel = logger.getLevel();
				const levels = {
					TRACE: 0,
					DEBUG: 1,
					INFO: 2,
					WARN: 3,
					ERROR: 4,
				};

				// Disable actual logging in the tests.
				/* eslint-disable-next-line no-console */
				console.log = jest.fn();

				forEach( levels, ( expected, name ) => {
					scope.onmessage( createMessage( "initialize", { logLevel: name } ) );
					expect( logger.getLevel() ).toBe( expected );
				} );

				logger.setLevel( saveLogLevel, false );
			} );

			test( "adds the research data to the researcher", () => {
				worker._researcher.addResearchData = jest.fn();

				scope.onmessage( createMessage( "initialize", {
					researchData: {
						morphology: "word forms",
						fancy: "feature",
					},
				} ) );

				expect( worker._researcher.addResearchData ).toHaveBeenNthCalledWith( 1, "morphology", "word forms" );
				expect( worker._researcher.addResearchData ).toHaveBeenNthCalledWith( 2, "fancy", "feature" );
			} );

			test( "configures the shortlinker params", () => {
				const baseUrl = "https://yoast.com";

				// Ensure there are no params registered yet.
				expect( createShortlink( baseUrl ) ).toBe( baseUrl );

				scope.onmessage( createMessage( "initialize", {
					defaultQueryParams: {
						source: "specs",
					},
				} ) );

				expect( createShortlink( baseUrl ) ).toBe( `${ baseUrl }?source=specs` );
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
				worker.createContentAssessor = jest.fn().mockReturnValue( false );

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

				// When changing locale.
				scope.onmessage( createMessage( "initialize", { locale: "en_US" } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );

				// When changing translations.
				scope.onmessage( createMessage( "initialize", { translations: {} } ) );
				expect( worker.createContentAssessor ).toHaveBeenCalledTimes( ++timesCalled );
			} );

			test( "updates seo assessor", () => {
				let timesCalled = 0;
				worker.createSEOAssessor = jest.fn().mockReturnValue( false );

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
				worker = new AnalysisWebWorker( scope, researcher );
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
				const spy = jest.spyOn( worker, "analyze" );

				worker.analyzeDone = () => {
					try {
						expect( spy ).toHaveBeenCalledTimes( 1 );
						// eslint-disable-next-line no-unused-vars -- Pulling the _tree out of the paper because it will be filled in the worker.
						const { _tree, ...expectedPaper } = paper;
						expect( spy ).toHaveBeenCalledWith( 0, { paper: expect.objectContaining( expectedPaper ) } );
						done();
					} catch ( e ) {
						done( e );
					}
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

			// Skipped because the input isn't valid HTML -- editors will generally take care of that.
			it.skip( "does not assess the tree when it could not be built", done => {
				const paper = new Paper( "<h1>This </ fails." );

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
						b: { keyword: "tech" },
					},
				} ) );
			} );

			test( "analyze done calls send", () => {
				worker.send = jest.fn();
				worker.analyzeDone( 0, { result: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "analyze:done", 0, { result: true } );
			} );

			test( "handles analyze error", done => {
				const paper = new Paper( "This is the content." );

				// Mock the first function call in analyze to throw an error.
				worker.shouldReadabilityUpdate = () => {
					throw new Error( "Simulated error!" );
				};

				worker.analyzeDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.error ).toBeDefined();
					expect( result.error ).toBe( "An error occurred while running the analysis.\n\tError: Simulated error!" );
					done();
				};

				// Silent to prevent console logging in the tests.
				scope.onmessage( createMessage( "initialize", { logLevel: "silent" } ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "handles analyze error, with stack trace", done => {
				const paper = new Paper( "This is the content." );

				// Mock the console to see if it is used and to not output anything for real.
				// eslint-disable-next-line no-console
				console.log = jest.fn();
				console.error = jest.fn();

				// Mock the first function call in analyze to throw an error.
				worker.shouldReadabilityUpdate = () => {
					throw new Error( "Simulated error!" );
				};

				worker.analyzeDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.error ).toBeDefined();
					expect( result.error ).toBe( "An error occurred while running the analysis.\n\tError: Simulated error!" );
					// eslint-disable-next-line no-console
					expect( console.log ).toHaveBeenCalled();
					expect( console.error ).toHaveBeenCalled();
					done();
				};

				scope.onmessage( createMessage( "initialize", { logLevel: "trace" } ) );
				scope.onmessage( createMessage( "analyze", { paper: paper.serialize() } ) );
			} );

			test( "analyze done calls send on failure", () => {
				worker.send = jest.fn();
				worker.analyzeDone( 0, { error: "failed" } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "analyze:failed", 0, { error: "failed" } );
			} );
			it( "correctly calculates sentence position in a node containing an element (comment) that is removed from" +
				"the paper after building the tree", async() => {
				// One paragraph, with one sentence.
				const html = "<div><!-- A comment --><p>A paragraph</p></div>";

				const paper = new Paper( html );

				const webworker = new AnalysisWebWorker( scope, researcher );

				await webworker.analyze( 1, { paper } );

				// Get the sentence from the single paragraph in the tree.
				const paragraphs = paper.getTree().findAll( node => node.name === "p" );
				const sentence = paragraphs[ 0 ].sentences[ 0 ];

				const { startOffset, endOffset } = sentence.sourceCodeRange;

				// Check if the source code position is correct.
				expect( html.slice( startOffset, endOffset ) ).toEqual( "A paragraph" );
			} );

			it( "correctly calculate the position of the image with a caption", async() => {
				const html = "<!-- wp:image -->\n" +
					"<figure class=\"wp-block-image size-large\"><img src=\"https://example.com\" alt=\"\" class=\"wp-image-8\"/>" +
					"<figcaption class=\"wp-element-caption\">A cute cat</figcaption></figure>\n" +
					"<!-- /wp:image -->\n" +
					"<!-- wp:paragraph -->\n" +
					"<p>Movet voluptatibus vix ad. Et eruditi mediocrem liberavisse eos.</p>" +
					"<!-- /wp:paragraph -->";

				const paper = new Paper( html );

				const webworker = new AnalysisWebWorker( scope, researcher );

				await webworker.analyze( 1, { paper } );

				const tree = paper.getTree();
				const images = tree.findAll( node => node.name === "img" );
				const caption = tree.findAll( node => node.name === "figcaption" );
				const captionText = caption[ 0 ].findAll( node => node.name === "p" );
				const { startOffset, endOffset } = captionText[ 0 ].sentences[ 0 ].sourceCodeRange;
				// Check if the source code position is correct.
				expect( images[ 0 ].sourceCodeLocation ).toEqual( {
					endOffset: 118,
					startOffset: 60,
					startTag: { endOffset: 118, startOffset: 60 },
				} );
				// Check if the startOffset and endOffset of the caption text is correct.
				expect( startOffset ).toEqual( 157 );
				expect( endOffset ).toEqual( 167 );
			} );
		} );

		describe( "analyzeRelatedKeywords", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope, researcher );
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
					execute: worker.analyzeRelatedKeywords,
					done: worker.analyzeRelatedKeywordsDone,
					data: { paper, relatedKeywords },
					type: "analyzeRelatedKeywords",
				} );
			} );

			test( "calls analyzeRelatedKeywords", done => {
				const paper = new Paper( "This is the content." );
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };
				const spy = jest.spyOn( worker, "analyzeRelatedKeywords" );

				worker.analyzeRelatedKeywordsDone = () => {
					try {
						expect( spy ).toHaveBeenCalledTimes( 1 );
						// eslint-disable-next-line no-unused-vars -- Pulling the _tree out of the paper because it will be filled in the worker.
						const { _tree, ...expectedPaper } = paper;
						expect( spy ).toHaveBeenCalledWith( 0, { paper: expect.objectContaining( expectedPaper ), relatedKeywords } );
						done();
					} catch ( e ) {
						done( e );
					}
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

			test( "analyzeRelatedKeywords:failed is called if analyzeRelatedKeywords:done received a result with an error", done => {
				const paper = new Paper( "This is the content.", {} );
				const relatedKeywords = { a: { keyword: "content", synonyms: "" } };

				scope.onmessage( createMessage( "initialize", { logLevel: "trace" } ) );

				// Mock the first function call in analyze to throw an error.
				worker.shouldReadabilityUpdate = () => {
					throw new Error( "Simulated error!" );
				};

				/*
				 * Check whether send - which is called from analyzeRelatedKeywords - gets passed the right
				 * arguments that we expect if analyzeRelatedKeywords failed.
				 */
				worker.send = ( type, id, payload ) => {
					expect( type ).toBe( "analyzeRelatedKeywords:failed" );
					expect( id ).toBe( 0 );
					expect( isObject( payload ) ).toBe( true );
					expect( payload.error ).toBeDefined();
					expect( payload.error ).toBe( "An error occurred while running the related keywords analysis.\n\tError: Simulated error!" );
					done();
				};

				scope.onmessage( createMessage( "analyzeRelatedKeywords", { paper: paper.serialize(), relatedKeywords } ) );
			} );
		} );

		describe( "loadScript", () => {
			beforeEach( () => {
				scope = createScope();
				worker = new AnalysisWebWorker( scope, researcher );
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
				const spy = jest.spyOn( worker, "loadScript" );

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
				worker = new AnalysisWebWorker( scope, researcher );
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
				const spy = jest.spyOn( worker, "customMessage" );

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
				worker = new AnalysisWebWorker( scope, researcher );
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
				const spy = jest.spyOn( worker, "runResearch" );

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
				const name = "findKeywordInFirstParagraph";
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

			test( "returns the morphology research result without morphologyData", done => {
				const name = "morphology";
				const paper = testTexts[ 0 ].paper;
				const payload = { name, paper: paper.serialize() };

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.keyphraseForms ).toEqual( [ [ "voice" ], [ "search" ] ] );
					expect( result.synonymsForms )
						.toEqual( [
							[ [ "listening" ], [ "reading" ], [ "search" ] ],
							[ [ "voice" ], [ "query" ] ],
							[ [ "voice" ], [ "results" ] ],
						] );
					done();
				};

				scope.onmessage( createMessage( "initialize" ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "returns the morphology research result with morphologyData", done => {
				const name = "morphology";
				const paper = testTexts[ 0 ].paper;
				const payload = { name, paper: paper.serialize() };

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result.keyphraseForms ).toEqual( [
						[ "voice" ],
						[ "search" ],
					] );
					done();
				};

				scope.onmessage( createMessage( "initialize", { researchData: { morphology: morphologyData } } ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "returns an error on research failed", done => {
				const name = "firstParagraph";
				const payload = { name };

				worker._researcher = {
					getResearch: () => {
						throw new Error( "Research failed" );
					},
				};

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result ).toHaveProperty( "error" );
					done();
				};

				scope.onmessage( createMessage( "initialize", { logLevel: "DEBUG" } ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "returns an error on research failed, with a custom error.", done => {
				const name = "firstParagraph";
				const payload = { name };

				worker._researcher = {
					getResearch: () => {
						throw { error: "This is a custom error." };
					},
				};

				worker.runResearchDone = ( id, result ) => {
					expect( id ).toBe( 0 );
					expect( isObject( result ) ).toBe( true );
					expect( result ).toHaveProperty( "error" );
					done();
				};

				scope.onmessage( createMessage( "initialize", { logLevel: "DEBUG" } ) );
				scope.onmessage( createMessage( "runResearch", payload ) );
			} );

			test( "run research done calls send", () => {
				worker.send = jest.fn();
				worker.runResearchDone( 0, { result: true } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "runResearch:done", 0, { result: true } );
			} );

			test( "run research done calls send with error", () => {
				worker.send = jest.fn();
				worker.runResearchDone( 0, { error: "This is an error." } );
				expect( worker.send ).toHaveBeenCalledTimes( 1 );
				expect( worker.send ).toHaveBeenCalledWith( "runResearch:failed", 0, { error: "This is an error." } );
			} );
		} );
	} );

	describe( "createContentAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
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
			expect( assessor.type ).toBe( "contentAssessor" );

			worker._configuration.useCornerstone = true;
			assessor = worker.createContentAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "cornerstoneContentAssessor" );
		} );

		test( "listens to customAnalysisType and sets the custom content assessor if available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the content assessor for the SEO assessor.
			worker._CustomContentAssessorClasses.type1 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "SEOAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default content assessor if no matching custom assessor is available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the content assessor for the SEO assessor.
			worker._CustomContentAssessorClasses.type2 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default content assessor if no custom analysis type is set", () => {
			worker._configuration.customAnalysisType = "";
			// Swapping the content assessor for the SEO assessor.
			worker._CustomContentAssessorClasses.type1 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType and sets the custom cornerstone content assessor if available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			// Swapping the cornerstone assessor for the SEO assessor.
			worker._CustomCornerstoneContentAssessorClasses.type1 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "SEOAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no matching custom assessor is available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			worker._CustomCornerstoneContentAssessorClasses.type2 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneContentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no custom analysis type is set", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "";
			worker._CustomCornerstoneContentAssessorClasses.type1 = SEOAssessor;
			const assessor = worker.createContentAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneContentAssessor" );
		} );
	} );

	describe( "createSEOAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
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
			expect( assessor.type ).toBe( "cornerstoneSEOAssessor" );
		} );

		test( "listens to useTaxonomy", () => {
			worker._configuration.useTaxonomy = false;
			let assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "SEOAssessor" );

			worker._configuration.useTaxonomy = true;
			assessor = worker.createSEOAssessor();
			expect( assessor ).not.toBeNull();
			expect( assessor.type ).toBe( "taxonomyAssessor" );
		} );

		test( "listens to customAnalysisType and sets the custom SEO assessor if available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the SEO assessor for the content assessor.
			worker._CustomSEOAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default SEO assessor if no matching custom assessor is available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the SEO assessor for the content assessor.
			worker._CustomSEOAssessorClasses.type2 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "SEOAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default SEO assessor if no custom analysis type is set", () => {
			worker._configuration.customAnalysisType = "";
			// Swapping the SEO assessor for the content assessor.
			worker._CustomSEOAssessorClasses.type2 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "SEOAssessor" );
		} );

		test( "listens to customAnalysisType and sets the custom cornerstone SEO assessor if available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			// Swapping the cornerstone SEO assessor for the content assessor.
			worker._CustomCornerstoneSEOAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no matching custom assessor is available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			// Swapping the cornerstone SEO assessor for the content assessor.
			worker._CustomCornerstoneSEOAssessorClasses.type2 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneSEOAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no custom analysis type is set", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "";
			// Swapping the cornerstone SEO assessor for the content assessor.
			worker._CustomCornerstoneSEOAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createSEOAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneSEOAssessor" );
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

	describe( "createRelatedKeywordAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
		} );

		test( "listens to customAnalysisType and sets the custom related keyword assessor if available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the related keyword assessor for the content assessor.
			worker._CustomRelatedKeywordAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default related keyword assessor if no matching custom assessor is available", () => {
			worker._configuration.customAnalysisType = "type1";
			// Swapping the related keyword assessor for the content assessor.
			worker._CustomRelatedKeywordAssessorClasses.type2 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "relatedKeywordAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default related keyword assessor if no custom analysis type is set", () => {
			worker._configuration.customAnalysisType = "";
			// Swapping the related keyword assessor for the content assessor.
			worker._CustomRelatedKeywordAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "relatedKeywordAssessor" );
		} );

		test( "listens to customAnalysisType and sets the custom cornerstone related keyword assessor if available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			// Swapping the cornerstone related keyword assessor for the content assessor.
			worker._CustomCornerstoneRelatedKeywordAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Custom assessor used.
			expect( assessor.type ).toBe( "contentAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no matching custom assessor is available", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "type1";
			// Swapping the cornerstone related keyword assessor for the content assessor.
			worker._CustomCornerstoneRelatedKeywordAssessorClasses.type2 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneRelatedKeywordAssessor" );
		} );

		test( "listens to customAnalysisType but returns the default cornerstone SEO assessor if no custom analysis type is set", () => {
			worker._configuration.useCornerstone = true;
			worker._configuration.customAnalysisType = "";
			// Swapping the cornerstone related keyword assessor for the content assessor.
			worker._CustomCornerstoneRelatedKeywordAssessorClasses.type1 = ContentAssessor;
			const assessor = worker.createRelatedKeywordsAssessor();
			// Default assessor used.
			expect( assessor.type ).toBe( "cornerstoneRelatedKeywordAssessor" );
		} );
	} );

	describe( "registerAssessment", () => {
		const assessmentName = "Knock knock";
		const pluginName = "Who?";
		const assessment = createAssessment( assessmentName );

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
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

		test( "add the seo assessment to the registered assessments", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._seoAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName );
			expect( worker._registeredAssessments.length ).toBe( 1 );
			expect( worker._registeredAssessments[ 0 ].assessment ).toBe( assessment );
			expect( worker._registeredAssessments[ 0 ].type ).toBe( "seo" );
		} );

		test( "add the readability assessment to the registered assessments", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._contentAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName, "readability" );
			expect( worker._registeredAssessments.length ).toBe( 1 );
			expect( worker._registeredAssessments[ 0 ].assessment ).toBe( assessment );
			expect( worker._registeredAssessments[ 0 ].type ).toBe( "readability" );
		} );

		test( "add the readability assessment for cornerstone content to the registered assessments", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._contentAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName, "cornerstoneReadability" );
			expect( worker._registeredAssessments.length ).toBe( 1 );
			expect( worker._registeredAssessments[ 0 ].assessment ).toBe( assessment );
			expect( worker._registeredAssessments[ 0 ].type ).toBe( "cornerstoneReadability" );
		} );

		test( "add the related keyphrase assessment to the registered assessments", () => {
			scope.onmessage( createMessage( "initialize" ) );
			expect( worker._relatedKeywordAssessor ).not.toBeNull();

			worker.registerAssessment( assessmentName, assessment, pluginName, "relatedKeyphrase" );
			expect( worker._registeredAssessments.length ).toBe( 1 );
			expect( worker._registeredAssessments[ 0 ].assessment ).toBe( assessment );
			expect( worker._registeredAssessments[ 0 ].type ).toBe( "relatedKeyphrase" );
		} );

		test( "call refresh assessment", () => {
			scope.onmessage( createMessage( "initialize" ) );
			worker.refreshAssessment = jest.fn();
			worker.registerAssessment( assessmentName, assessment, pluginName );

			expect( worker.refreshAssessment ).toHaveBeenCalledTimes( 1 );
			expect( worker.refreshAssessment ).toHaveBeenCalledWith( assessmentName, pluginName );
		} );
	} );

	describe( "registerResearch", () => {
		const researchName = "custom research";
		const research = () => "hello";

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to register the custom research. Expected parameter `name` to be a string.";
			expect( () => worker.registerResearch( null, research ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid research", () => {
			const errorMessage = "Failed to register the custom research. Expected parameter `research` to be a function.";
			expect( () => worker.registerResearch( researchName, null ) ).toThrowError( errorMessage );
		} );

		test( "adds the research", () => {
			scope.onmessage( createMessage( "initialize" ) );

			worker.registerResearch( researchName, research );
			const researchFromResearcher = researcher.getResearch( researchName );
			expect( researchFromResearcher ).toBeDefined();
			expect( researchFromResearcher ).toBe( "hello" );
		} );
	} );

	describe( "registerHelper", () => {
		const helperName = "helpful helper";
		const helper = () => true;

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to register the custom helper. Expected parameter `name` to be a string.";
			expect( () => worker.registerHelper( null, helper ) ).toThrowError( errorMessage );
		} );

		test( "throws an error when passing an invalid helper", () => {
			const errorMessage = "Failed to register the custom helper. Expected parameter `helper` to be a function.";
			expect( () => worker.registerHelper( helperName, null ) ).toThrowError( errorMessage );
		} );

		test( "adds the helper", () => {
			scope.onmessage( createMessage( "initialize" ) );

			worker.registerHelper( helperName, helper );
			const helperFromResearcher = researcher.getHelper( helperName );
			expect( helperFromResearcher ).toBeDefined();
			expect( helperFromResearcher ).toBe( helper );
		} );
	} );

	describe( "registerResearcherConfig", () => {
		const name = "petsConfig";
		const researcherConfig = { pets: [ "cats", "dogs" ] };

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
			worker.register();
		} );

		test( "throws an error when passing an invalid name", () => {
			const errorMessage = "Failed to register the custom researcher config. Expected parameter `name` to be a string.";
			expect( () => worker.registerResearcherConfig( null, researcherConfig ) ).toThrowError( errorMessage );
		} );
		test( "throws an error when passing an empty or undefined config", () => {
			const errorMessage = "Failed to register the custom researcher config. Expected parameter `researcherConfig` to be defined.";
			expect( () => worker.registerResearcherConfig( name, {} ) ).toThrowError( errorMessage );
			expect( () => worker.registerResearcherConfig( name ) ).toThrowError( errorMessage );
		} );
		test( "adds the researcher config", () => {
			scope.onmessage( createMessage( "initialize" ) );

			worker.registerResearcherConfig( name, researcherConfig );
			const configFromResearcher = researcher.getConfig( name );
			expect( configFromResearcher ).toBeDefined();
			expect( configFromResearcher ).toBe( researcherConfig );
		} );
	} );

	describe( "registerMessageHandler", () => {
		const handlerName = "Knock knock";
		const pluginName = "Who?";
		const handler = () => true;

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
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
			worker = new AnalysisWebWorker( scope, researcher );
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
			worker = new AnalysisWebWorker( scope, researcher );
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
			worker = new AnalysisWebWorker( scope, researcher );
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
			worker = new AnalysisWebWorker( scope, researcher );
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
			worker._paper = new Paper( "This is the content.", { locale: "nl_NL" } );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );

		test( "returns false when the text and locale are the same", () => {
			const paper = new Paper( "This is the content." );
			worker._paper = new Paper( "This is the content." );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( false );
		} );

		test( "returns true when the keyphrase is different", () => {
			const paper = new Paper( "This is the content.", { keyword: "cats" } );
			worker._paper = new Paper( "This is the content.", { keyword: "dogs" } );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the client IDs of the blocks inside attributes changes", () => {
			const paper = new Paper( "This is the content.", { wpBlocks: [
				{ name: "block1", clientId: "1234" },
				{ name: "block2", clientId: "5678" },
			] } );

			worker._paper = new Paper( "This is the content.", { wpBlocks: [
				{ name: "block1", clientId: "6783" },
				{ name: "block2", clientId: "0636" },
			] } );
			expect( worker.shouldReadabilityUpdate( paper ) ).toBe( true );
		} );
	} );

	describe( "shouldSeoUpdate", () => {
		const key = "a";
		const keyword = "test";
		const synonyms = "spec";

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
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

	describe( "shouldInclusiveLanguageUpdate", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
		} );

		test( "returns true when the existing paper is null", () => {
			const paper = new Paper( "This does not matter here." );
			worker._paper = null;
			expect( worker.shouldInclusiveLanguageUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the paper text is different", () => {
			const paper = new Paper( "This is different content." );
			worker._paper = new Paper( "This is the content." );
			expect( worker.shouldInclusiveLanguageUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the paper locale is different", () => {
			const paper = new Paper( "This is the content.", { locale: "en_US" } );
			worker._paper = new Paper( "This is the content.", { locale: "nl_NL" } );
			expect( worker.shouldInclusiveLanguageUpdate( paper ) ).toBe( true );
		} );

		test( "returns true when the text title of the paper is different", () => {
			const paper = new Paper( "This is the content.", { textTitle: "A text title" } );
			worker._paper = new Paper( "This is the content.", { textTitle: "A different text title" } );
			expect( worker.shouldInclusiveLanguageUpdate( paper ) ).toBe( true );
		} );

		test( "returns false when the text and text title are the same", () => {
			const paper = new Paper( "This is the content.", { textTitle: "A text title" } );
			worker._paper = new Paper( "This is the content.", { textTitle: "A text title" } );
			expect( worker.shouldInclusiveLanguageUpdate( paper ) ).toBe( false );
		} );
	} );

	describe( "createSEOTreeAssessor", () => {
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
		} );

		it.skip( "creates an SEO assessor", () => {
			const assessor = worker.createSEOTreeAssessor( {} );

			expect( assessor.getAssessments() ).toEqual( [] );
		} );
	} );

	describe( "assess", () => {
		let assessor;
		let treeAssessor;
		let scoreAggregator;

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );

			// Build the different kinds of assessors and aggregator to use.
			assessor = new SEOAssessor( { marker: {} } );
			treeAssessor = worker.createSEOTreeAssessor( {} );
			scoreAggregator = new SEOScoreAggregator();

			// Create a test research to do.
			const testResearch = new TestResearch();

			// Create a researcher and add the test research to it.
			researcher = new TreeResearcher();
			researcher.addResearch( "test research", testResearch );
		} );

		it.skip( "still runs the assessments that use the old assessor when building the tree fails", done => {
			const paper = new Paper( "This is some content." );

			// Add tree assessment.
			treeAssessor.registerAssessment( "test assessment", new TestAssessment( true, 5, "test assessment", researcher ) );

			// Analysis combination to use.
			const analysisCombination = {
				oldAssessor: assessor,
				treeAssessor: treeAssessor,
				scoreAggregator: scoreAggregator,
			};

			// Assess the paper, simulate an error in building the tree by setting it to `null`.
			worker.assess( paper, null, analysisCombination ).then(
				result => {
					// Result should contain the "test assessment" result error, since building of the tree failed (= null).
					const erroredResults = result.results.filter( res => res.getScore() === -1 );
					expect( erroredResults ).toHaveLength( 1 );
					done();
				}
			);
		} );
	} );

	describe( "registerParser", () => {
		/**
		 * A mock parser.
		 */
		class MockParser {
			/**
			 * Checks if this parser is applicable.
			 *
			 * @returns {boolean} Whether the parser is applicable.
			 */
			isApplicable() {
				return true;
			}

			/**
			 * Parses the paper.
			 *
			 * @returns {module:parsedPaper/structure.StructuredNode} The tree structure.
			 */
			parse() {
				return new StructuredNode( "some-tag" );
			}
		}

		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
		} );

		it( "can register a custom parser, if it is class-based and has the appropriate methods.", () => {
			const mockParser = new MockParser();

			worker.registerParser( mockParser );

			expect( worker._registeredParsers ).toHaveLength( 1 );
			expect( worker._registeredParsers[ 0 ] ).toEqual( mockParser );
		} );

		it( "can register a custom parser, if it has an `isApplicable` and a `parse` method.", () => {
			const mockParser = {
				isApplicable: () => true,
				parse: () => new StructuredNode( "Hello!" ),
			};

			worker.registerParser( mockParser );

			expect( worker._registeredParsers ).toHaveLength( 1 );
			expect( worker._registeredParsers[ 0 ] ).toEqual( mockParser );
		} );

		it( "throws an error when registering a custom parser, if it does not have an `isApplicable` method.", () => {
			const mockParser = {
				parse: () => new StructuredNode( "Hello!" ),
			};

			expect( () => worker.registerParser( mockParser ) ).toThrow( InvalidTypeError );
		} );

		it( "throws an error when registering a custom parser, if it does not have a `parse` method.", () => {
			const mockParser = {
				isApplicable: () => true,
			};

			expect( () => worker.registerParser( mockParser ) ).toThrow( InvalidTypeError );
		} );

		it( "throws an error when registering a custom parser, if it neither has `isApplicable` method nor `parse` method.", () => {
			const mockParser = {};

			expect( () => worker.registerParser( mockParser ) ).toThrow( InvalidTypeError );
		} );
	} );

	describe( "set assessors", () => {
		const customAssessorOptions = { url: "url" };
		beforeEach( () => {
			scope = createScope();
			worker = new AnalysisWebWorker( scope, researcher );
		} );

		it( "can set a custom SEO assessor.", () => {
			worker.setCustomSEOAssessorClass( SEOAssessor, "test", customAssessorOptions  );
			expect( worker._CustomSEOAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomSEOAssessorOptions.test ).toBe( customAssessorOptions );
		} );

		it( "can set a custom cornerstone SEO assessor.", () => {
			worker.setCustomCornerstoneSEOAssessorClass( SEOAssessor, "test", customAssessorOptions );
			expect( worker._CustomCornerstoneSEOAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomCornerstoneSEOAssessorOptions.test ).toBe( customAssessorOptions );
		} );

		it( "can set a custom content assessor.", () => {
			worker.setCustomContentAssessorClass( SEOAssessor, "test", customAssessorOptions );
			expect( worker._CustomContentAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomContentAssessorOptions.test ).toBe( customAssessorOptions );
		} );

		it( "can set a custom cornerstone content assessor.", () => {
			worker.setCustomCornerstoneContentAssessorClass( SEOAssessor, "test", customAssessorOptions );
			expect( worker._CustomCornerstoneContentAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomCornerstoneContentAssessorOptions.test ).toBe( customAssessorOptions );
		} );

		it( "can set a custom related keyword assessor.", () => {
			worker.setCustomRelatedKeywordAssessorClass( SEOAssessor, "test", customAssessorOptions );
			expect( worker._CustomRelatedKeywordAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomRelatedKeywordAssessorOptions.test ).toBe( customAssessorOptions );
		} );

		it( "can set a custom cornerstone related keyword assessor.", () => {
			worker.setCustomCornerstoneRelatedKeywordAssessorClass( SEOAssessor, "test", customAssessorOptions );
			expect( worker._CustomCornerstoneRelatedKeywordAssessorClasses.test ).toBe( SEOAssessor );
			expect( worker._CustomCornerstoneRelatedKeywordAssessorOptions.test ).toBe( customAssessorOptions );
		} );
	} );
} );
