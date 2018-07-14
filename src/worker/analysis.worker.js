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
		this.configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			useCornerstone: false,
			useKeywordDistribution: false,
			locale: "en_US",
		};
		this.i18n = AnalysisWebWorker.createI18n();
		this.paper = new Paper( "" );
		this.researcher = new Researcher( this.paper );
		this.contentAssessor = null;

		this.handleMessage = this.handleMessage.bind( this );
	}

	/**
	 * Receives the post message and determines the action.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
	 *
	 * @param {MessageEvent} arguments              The post message event.
	 * @param {Object}       arguments.data         The data object.
	 * @param {string}       arguments.data.type    The action type.
	 * @param {string}       arguments.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, payload } } ) {
		switch( type ) {
			case "initialize":
				this.initialize( decodePayload( payload ) );
				break;
			case "analyze":
				this.analyze( decodePayload( payload ) );
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
		} = this.configuration;

		if ( contentAnalysisActive === false ) {
			return null;
		}
		if ( useCornerstone === true ) {
			return new CornerstoneContentAssessor( this.i18n, { locale } );
		}
		return new ContentAssessor( this.i18n, { locale } );
	}

	/**
	 * Sends a message.
	 *
	 * @param {string}   type    The type of the message.
	 * @param {Object|*} payload The payload to deliver.
	 *
	 * @returns {void}
	 */
	postMessage( type, payload ) {
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
		this.configuration = merge( this.configuration, configuration );
		console.log( "run initialize", configuration, this.configuration );

		this.contentAssessor = this.createContentAssessor();

		this.postMessage( "initialize:done" );
	}

	/**
	 * Runs analyzations on a paper.
	 *
	 * @param {Object} arguments                 The payload object.
	 * @param {number} arguments.id              The id of this analyze request.
	 * @param {Object} arguments.paper           The paper to analyze.
	 * @param {Object} [arguments.configuration] The configuration for the
	 *                                           specific analyzations.
	 *
	 * @returns {void}
	 */
	analyze( { id, paper, configuration = {} } ) {
		console.log( "run analyze", id, paper, configuration );

		this.paper = new Paper( paper.text, omit( paper, "text" ) );
		this.researcher.setPaper( this.paper );

		if (
			! this.contentAssessor ||
			! this.configuration.contentAnalysisActive
		) {
			return;
		}
		this.contentAssessor.assess( this.paper );
		const results = this.contentAssessor.results;
		const score = this.contentAssessor.calculateOverallScore();

		this.postMessage( "analyze:done", {
			id,
			category: "readability",
			results: results,
			score,
		} );
	}
}

// Create an instance of the analysis web worker.
const analysisWebWorker = new AnalysisWebWorker();

// Bind the post message handler.
self.addEventListener( "message", analysisWebWorker.handleMessage );
