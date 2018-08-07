// External dependencies.
import Jed from "jed";
import omit from "lodash/omit";
import merge from "lodash/merge";

// YoastSEO.js dependencies.
import * as Paper from "yoastseo/values/Paper";
import * as Researcher from "yoastseo/researcher";
import * as ContentAssessor from "yoastseo/contentAssessor";
import * as SEOAssessor from "yoastseo/seoAssessor";
import * as CornerstoneContentAssessor from "yoastseo/cornerstone/contentAssessor";
import * as CornerstoneSEOAssessor from "yoastseo/cornerstone/seoAssessor";
const removeHtmlBlocks = require( "../stringProcessing/htmlParser.js" );

// Internal dependencies.
import { Scheduler } from "./scheduler";
import { encodePayload, decodePayload } from "./utils";

/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */
class AnalysisWebWorker {
	/**
	 * Initializes the AnalysisWebWorker class.
	 */
	constructor() {
		this._configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			useCornerstone: false,
			useKeywordDistribution: false,
			locale: "en_US",
		};
		this._scheduler = new Scheduler( { resetQueue: true } );
		this._i18n = AnalysisWebWorker.createI18n();
		this._paper = new Paper( "" );
		this._researcher = new Researcher( this._paper );
		this._contentAssessor = null;
		this._seoAssessor = null;

		// Bind actions to this scope.
		this.analyze = this.analyze.bind( this );
		this.analyzeDone = this.analyzeDone.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );
	}

	/**
	 * Receives the post message and determines the action.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
	 *
	 * @param {MessageEvent} event              The post message event.
	 * @param {Object}       event.data         The data object.
	 * @param {string}       event.data.type    The action type.
	 * @param {string}       event.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, payload } } ) {
		switch( type ) {
			case "initialize":
				this.initialize( decodePayload( payload ) );
				break;
			case "analyze":
				this._scheduler.schedule( {
					execute: this.analyze,
					done: this.analyzeDone,
					data: decodePayload( payload ),
				} );
				break;
			default:
				console.warn( "Unrecognized command", type );
		}
	}

	/**
	 * Initializes i18n object based on passed configuration.
	 *
	 * @param {Object} [translations] The translations to be used in the current
	 *                                instance.
	 *
	 * @returns {Jed} Jed instance.
	 */
	static createI18n( translations ) {
		// Use default object to prevent Jed from erroring out.
		translations = translations || {
			domain: "js-text-analysis",
			// eslint-disable-next-line camelcase
			locale_data: {
				"js-text-analysis": {
					"": {},
				},
			},
		};

		return new Jed( translations );
	}

	/**
	 * Initializes the appropriate content assessor.
	 *
	 * @returns {null|ContentAssessor|CornerstoneContentAssessor} The chosen
	 *                                                            content
	 *                                                            assessor.
	 */
	createContentAssessor() {
		const {
			contentAnalysisActive,
			useCornerstone,
			locale,
		} = this._configuration;

		if ( contentAnalysisActive === false ) {
			return null;
		}
		if ( useCornerstone === true ) {
			return new CornerstoneContentAssessor( this._i18n, { locale } );
		}
		return new ContentAssessor( this._i18n, { locale } );
	}

	/**
	 * Initializes the appropriate SEO assessor.
	 *
	 * @returns {null|SEOAssessor|CornerstoneSEOAssessor} The chosen
	 *                                                    SEO
	 *                                                    assessor.
	 */
	createSEOAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			locale,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}
		if ( useCornerstone === true ) {
			return new CornerstoneSEOAssessor( this._i18n, { locale } );
		}
		return new SEOAssessor( this._i18n, { locale } );
	}

	/**
	 * Sends a message.
	 *
	 * @param {string}   type    The type of the message.
	 * @param {Object|*} payload The payload to deliver.
	 *
	 * @returns {void}
	 */
	send( type, payload ) {
		console.log( "worker => wrapper", type, payload );
		self.postMessage( {
			type,
			payload: encodePayload( payload ),
		} );
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {Object} configuration The configuration object.
	 *
	 * @returns {void}
	 */
	initialize( configuration ) {
		this._configuration = merge( this._configuration, configuration );
		console.log( "run initialize", configuration, this._configuration );

		this._contentAssessor = this.createContentAssessor();
		this._seoAssessor = this.createSEOAssessor();

		this.send( "initialize:done" );
	}

	/**
	 * Runs analyses on a paper.
	 *
	 * @param {Object} arguments                 The payload object.
	 * @param {number} arguments.id              The id of this analyze request.
	 * @param {Object} arguments.paper           The paper to analyze.
	 * @param {Object} [arguments.configuration] The configuration for the
	 *                                           specific analyses.
	 *
	 * @returns {Object} The result, may not contain readability or seo.
	 */
	analyze( { id, paper, configuration = {} } ) {
		console.log( "run analyze", id, paper, configuration );
		const result = { id };

		this._paper = new Paper( removeHtmlBlocks( paper.text ), omit( paper, "text" ) );
		this._researcher.setPaper( this._paper );

		if ( this._configuration.contentAnalysisActive && this._contentAssessor ) {
			this._contentAssessor.assess( this._paper );
			result.readability = {
				results: this._contentAssessor.results,
				score: this._contentAssessor.calculateOverallScore(),
			};
		}

		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			this._seoAssessor.assess( this._paper );
			result.seo = {
				results: this._seoAssessor.results,
				score: this._seoAssessor.calculateOverallScore(),
			};
		}

		return result;
	}

	/**
	 * Sends the result back.
	 *
	 * @param {Object} result The result to be send.
	 *
	 * @returns {void}
	 */
	analyzeDone( result ) {
		this.send( "analyze:done", result );
	}
}

// Create an instance of the analysis web worker.
const analysisWebWorker = new AnalysisWebWorker();

// Bind the post message handler.
self.addEventListener( "message", analysisWebWorker.handleMessage );
