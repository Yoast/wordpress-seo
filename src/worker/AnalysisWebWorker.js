// External dependencies.
const Jed = require( "jed" );
const merge = require( "lodash/merge" );
const isEqual = require( "lodash/isEqual" );
const isUndefined = require( "lodash/isUndefined" );

// YoastSEO.js dependencies.
const Paper = require( "../values/Paper" );
const Researcher = require( "../researcher" );
const ContentAssessor = require( "../contentAssessor" );
const SEOAssessor = require( "../seoAssessor" );
const TaxonomyAssessor = require( "../taxonomyAssessor" );
const CornerstoneContentAssessor = require( "../cornerstone/contentAssessor" );
const CornerstoneSEOAssessor = require( "../cornerstone/seoAssessor" );
const removeHtmlBlocks = require( "../stringProcessing/htmlParser" );
import LargestKeywordDistanceAssessment from "../assessments/seo/LargestKeywordDistanceAssessment";

// Internal dependencies.
import Scheduler from "./scheduler";

const largestKeywordDistanceAssessment = new LargestKeywordDistanceAssessment();

/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */
export default class AnalysisWebWorker {
	/**
	 * Initializes the AnalysisWebWorker class.
	 *
	 * @param {Object} scope The scope for the messaging. Expected to have the
	 *                       `onmessage` event and the `postMessage` function.
	 */
	constructor( scope ) {
		this._scope = scope;

		this._configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			useCornerstone: false,
			useTaxonomy: false,
			useKeywordDistribution: false,
			// The locale used for language-specific configurations in Flesch-reading ease and Sentence length assessments.
			locale: "en_US",
		};
		this._scheduler = new Scheduler( { resetQueue: true } );
		this._paper = new Paper( "" );
		this._researcher = new Researcher( this._paper );
		this._contentAssessor = null;
		this._seoAssessor = null;
		this._result = {
			readability: {
				results: [],
			},
			seo: {
				results: [],
			},
		};

		// Bind actions to this scope.
		this.analyze = this.analyze.bind( this );
		this.analyzeDone = this.analyzeDone.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );
	}

	/**
	 * Registers this web worker with the scope passed to it's constructor.
	 *
	 * @returns {void}
	 */
	register() {
		this._scope.onmessage = this.handleMessage;
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
		console.log( "worker", type, id, payload );
		switch( type ) {
			case "initialize":
				this.initialize( id, payload );
				break;
			case "analyze":
				this._scheduler.schedule( {
					id,
					execute: this.analyze,
					done: this.analyzeDone,
					data: payload,
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

		const assessor = useCornerstone === true
			? new CornerstoneContentAssessor( this._i18n, { locale } )
			: new ContentAssessor( this._i18n, { locale } );

		return assessor;
	}

	/**
	 * Initializes the appropriate SEO assessor.
	 *
	 * @returns {null|SEOAssessor|CornerstoneSEOAssessor|TaxonomyAssessor} The chosen
	 *                                                                     SEO
	 *                                                                     assessor.
	 */
	createSEOAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useKeywordDistribution,
			useTaxonomy,
			locale,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		let assessor;

		if( useTaxonomy === true ) {
			assessor = new TaxonomyAssessor( this._i18n );
		} else {
			assessor = useCornerstone === true
				? new CornerstoneSEOAssessor( this._i18n, { locale } )
				: new SEOAssessor( this._i18n, { locale } );
		}


		if ( useKeywordDistribution && isUndefined( assessor.getAssessment( "largestKeywordDistance" ) ) ) {
			assessor.addAssessment( "largestKeywordDistance", largestKeywordDistanceAssessment );
		}

		return assessor;
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
		this._scope.postMessage( {
			type,
			id,
			payload,
		} );
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {number}  id                                     The request id.
	 * @param {Object}  configuration                          The configuration object.
	 * @param {boolean} [configuration.contentAnalysisActive]  Whether the content analysis is active.
	 * @param {boolean} [configuration.keywordAnalysisActive]  Whether the keyword analysis is active.
	 * @param {boolean} [configuration.useCornerstone]         Whether the keyword is cornerstone or not.
	 * @param {boolean} [configuration.useTaxonomy]            Whether the taxonomy assessor should be used.
	 * @param {boolean} [configuration.useKeywordDistribution] Whether the largestKeywordDistance assessment should run.
	 * @param {string}  [configuration.locale]                 The locale used in the seo assessor.
	 *
	 * @returns {void}
	 */
	initialize( id, configuration ) {
		this._configuration = merge( this._configuration, configuration );

		this._i18n = AnalysisWebWorker.createI18n( this._configuration.translations );

		this.setLocale( this._configuration.locale );
		// Ensure we always have a content assessor.
		if ( this._contentAssessor === null ) {
			this._contentAssessor = this.createContentAssessor();
		}

		this._seoAssessor = this.createSEOAssessor();
		// Reset the paper in order to not use the cached results on analyze.
		this._paper = new Paper( "" );
		this.send( "initialize:done", id );
	}

	/**
	 * Changes the locale in the configuration.
	 *
	 * If the locale is different:
	 * - Update the configuration locale.
	 * - Create the content assessor.
	 *
	 * @param {string} locale The locale to set.
	 *
	 * @returns {void}
	 */
	setLocale( locale ) {
		if ( this._configuration.locale === locale ) {
			return;
		}
		this._configuration.locale = locale;
		this._contentAssessor = this.createContentAssessor();
	}

	/**
	 * Runs analyses on a paper.
	 *
	 * @param {number} id                      The request id.
	 * @param {Object} payload                 The payload object.
	 * @param {Object} payload.paper           The paper to analyze.
	 *
	 * @returns {Object} The result, may not contain readability or seo.
	 */
	analyze( id, { paper } ) {
		paper.text = removeHtmlBlocks( paper.text );
		const newPaper = Paper.parse( paper );
		const paperIsIdentical = isEqual( this._paper, newPaper );
		const textIsIdentical = this._paper.getText() === newPaper.getText();

		if ( paperIsIdentical ) {
			console.log( "The paper has not changed since you analyzed it last." );
			return this._result;
		}

		this._paper = newPaper;
		this._researcher.setPaper( this._paper );

		// Update the configuration locale to the paper locale.
		this.setLocale( this._paper.getLocale() );

		// Rerunning the SEO analysis if the text or attributes of the paper have changed.
		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			this._seoAssessor.assess( this._paper );
			this._result.seo = {
				results: this._seoAssessor.results.map( result => result.serialize() ),
				score: this._seoAssessor.calculateOverallScore(),
			};
		}

		// Return old readability results if the text of the paper has not changed.
		if ( textIsIdentical ) {
			console.log( "The text of your paper has not changed, returning the content analysis results from the previous analysis." );
			return this._result;
		}

		if ( this._configuration.contentAnalysisActive && this._contentAssessor ) {
			this._contentAssessor.assess( this._paper );
			this._result.readability = {
				results: this._contentAssessor.results.map( result => result.serialize() ),
				score: this._contentAssessor.calculateOverallScore(),
			};
		}

		return this._result;
	}

	/**
	 * Sends the result back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	analyzeDone( id, result ) {
		this.send( "analyze:done", id, result );
	}
}
