// External dependencies.
import Jed from "jed";
import omit from "lodash/omit";
import merge from "lodash/merge";

// YoastSEO.js dependencies.
import * as Paper from "yoastseo/values/Paper";
import * as Researcher from "yoastseo/researcher";
import * as ContentAssessor from "yoastseo/contentAssessor";
import * as CornerstoneContentAssessor from "yoastseo/cornerstone/contentAssessor";

// Internal dependencies.
import Scheduler from "./scheduler";
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
		this._scheduler = new Scheduler( self );
		this._i18n = AnalysisWebWorker.createI18n();
		this._paper = new Paper( "" );
		this._researcher = new Researcher( this._paper );
		this._contentAssessor = null;

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
	 * @param {string}       event.data.id      The request id.
	 * @param {string}       event.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, id, payload } } ) {
		switch( type ) {
			case "initialize":
				this.initialize( id, decodePayload( payload ) );
				break;
			case "analyze":
				this._scheduler.schedule( {
					execute: this.analyze,
					done: this.analyzeDone,
					data: decodePayload( payload ),
				} );
				this._scheduler.processQueue();
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
	 * Sends a message.
	 *
	 * @param {string} type      The message type.
	 * @param {number} id        The request id.
	 * @param {Object} [payload] The payload to deliver.
	 *
	 * @returns {void}
	 */
	send( type, id, payload = {} ) {
		console.log( "worker => wrapper", type, id, payload );
		self.postMessage( {
			type,
			id,
			payload: encodePayload( payload ),
		} );
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {number} id            The id of the request.
	 * @param {Object} configuration The configuration object.
	 *
	 * @returns {void}
	 */
	initialize( id, configuration ) {
		this._configuration = merge( this._configuration, configuration );
		console.log( "run initialize", configuration, this._configuration );

		this._contentAssessor = this.createContentAssessor();

		this.send( "initialize:done", id );
	}

	/**
	 * Runs analyses on a paper.
	 *
	 * @param {number} id                      The id of this analyze request.
	 * @param {Object} payload                 The payload object.
	 * @param {Object} payload.paper           The paper to analyze.
	 * @param {Object} [payload.configuration] The configuration for the
	 *                                         specific analyses.
	 *
	 * @returns {Object} The result.
	 */
	analyze( id, { paper, configuration = {} } ) {
		console.log( "run analyze", id, paper, configuration );

		this._paper = new Paper( paper.text, omit( paper, "text" ) );
		this._researcher.setPaper( this._paper );

		if (
			! this._contentAssessor ||
			! this._configuration.contentAnalysisActive
		) {
			return;
		}
		this._contentAssessor.assess( this._paper );
		const results = this._contentAssessor.results;
		const score = this._contentAssessor.calculateOverallScore();

		return {
			id,
			category: "readability",
			results,
			score,
		};
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
