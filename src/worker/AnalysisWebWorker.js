// External dependencies.
const Jed = require( "jed" );
const forEach = require( "lodash/forEach" );
const merge = require( "lodash/merge" );
const pickBy = require( "lodash/pickBy" );
const includes = require( "lodash/includes" );
const isUndefined = require( "lodash/isUndefined" );

// YoastSEO.js dependencies.
const Paper = require( "../values/Paper" );
const Researcher = require( "../researcher" );
const ContentAssessor = require( "../contentAssessor" );
const SEOAssessor = require( "../seoAssessor" );
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
			useKeywordDistribution: false,
			// The locale used for language-specific configurations in Flesch-reading ease and Sentence length assessments.
			locale: "en_US",
		};

		this._scheduler = new Scheduler( { resetQueue: true } );

		this._paper = new Paper( "", {} );
		this._relatedKeywords = {};

		this._researcher = new Researcher( this._paper );
		this._contentAssessor = null;
		this._seoAssessor = null;

		/*
		 * The cached analyses results.
		 *
		 * A single result has the following structure:
		 * {AssessmentResult[]} readability.results An array of assessment results; in serialized format.
		 * {number}             readability.score   The overall score.
		 *
		 * The results have the following structure.
		 * {Object} readability Content assessor results.
		 * {Object} seo         SEO assessor results, per keyword identifier or empty string for the main.
		 * {Object} seo[ "" ]   The result of the paper analysis for the main keyword.
		 * {Object} seo[ key ]  Same as above, but instead for a related keyword.
		 */
		this._results = {
			readability: {
				results: [],
				score: 0,
			},
			seo: {
				"": {
					results: [],
					score: 0,
				},
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
	 * @returns {null|SEOAssessor|CornerstoneSEOAssessor} The chosen
	 *                                                    SEO
	 *                                                    assessor.
	 */
	createSEOAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useKeywordDistribution,
			locale,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		const assessor = useCornerstone === true
			? new CornerstoneSEOAssessor( this._i18n, { locale } )
			: new SEOAssessor( this._i18n, { locale } );

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
	 * Checks if the paper contains changes that are used for readability.
	 *
	 * @param {Paper} paper The paper to check against the cached paper.
	 *
	 * @returns {boolean} True if there are changes detected.
	 */
	shouldReadabilityUpdate( paper ) {
		if ( this._paper.getText() !== paper.getText() ) {
			return true;
		}

		return this._paper.getLocale() !== paper.getLocale();
	}

	/**
	 * Checks if the related keyword contains changes that are used for seo.
	 *
	 * @param {string} key                     The identifier of the related keyword.
	 * @param {Object} relatedKeyword          The related keyword object.
	 * @param {string} relatedKeyword.keyword  The keyword.
	 * @param {string} relatedKeyword.synonyms The synonyms.
	 *
	 * @returns {boolean} True if there are changes detected.
	 */
	shouldSeoUpdate( key, { keyword, synonyms } ) {
		if ( isUndefined( this._relatedKeywords[ key ] ) ) {
			return true;
		}

		if ( this._relatedKeywords[ key ].keyword !== keyword ) {
			return true;
		}

		return this._relatedKeywords[ key ].synonyms !== synonyms;
	}

	/**
	 * Runs analyses on a paper.
	 *
	 * The paper includes the keyword and synonyms data. However, this is
	 * possibly just one instance of these. From here we are going to split up
	 * this data and keep track of the different sets of keyword-synonyms and
	 * their results.
	 *
	 * @param {number} id                        The request id.
	 * @param {Object} payload                   The payload object.
	 * @param {Object} payload.paper             The paper to analyze.
	 * @param {Object} [payload.relatedKeywords] The related keywords.
	 *
	 * @returns {Object} The result, may not contain readability or seo.
	 */
	analyze( id, { paper, relatedKeywords = {} } ) {
		paper.text = removeHtmlBlocks( paper.text );
		const newPaper = Paper.parse( paper );
		const paperHasChanges = ! this._paper.equals( newPaper );
		const shouldReadabilityUpdate = this.shouldReadabilityUpdate( newPaper );

		if ( paperHasChanges ) {
			this._paper = newPaper;
			this._researcher.setPaper( this._paper );

			// Update the configuration locale to the paper locale.
			this.setLocale( this._paper.getLocale() );
		}

		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			if ( paperHasChanges ) {
				this._seoAssessor.assess( this._paper );

				// Reset the cached results for the related keywords here too.
				this._results.seo = {};
				this._results.seo[ "" ] = {
					results: this._seoAssessor.results.map( result => result.serialize() ),
					score: this._seoAssessor.calculateOverallScore(),
				};
			}

			// Start an analysis for every related keyword.
			const requestedRelatedKeywordKeys = [ "" ];
			forEach( relatedKeywords, ( relatedKeyword, key ) => {
				requestedRelatedKeywordKeys.push( key );

				if ( this.shouldSeoUpdate( key, relatedKeyword ) ) {
					this._relatedKeywords[ key ] = relatedKeyword;

					const relatedPaper = Paper.parse( {
						...this._paper.serialize(),
						keyword: this._relatedKeywords[ key ].keyword,
						synonyms: this._relatedKeywords[ key ].synonyms,
					} );
					this._seoAssessor.assess( relatedPaper );

					this._results.seo[ key ] = {
						results: this._seoAssessor.results.map( result => result.serialize() ),
						score: this._seoAssessor.calculateOverallScore(),
					};
				}
			} );

			// Clear the unrequested results, but only if there are requested related keywords.
			if ( requestedRelatedKeywordKeys.length > 1 ) {
				this._results.seo = pickBy( this._results.seo, ( relatedKeyword, key ) => includes( requestedRelatedKeywordKeys, key ) );
			}
		}

		if ( this._configuration.contentAnalysisActive && this._contentAssessor && shouldReadabilityUpdate ) {
			this._contentAssessor.assess( this._paper );

			this._results.readability = {
				results: this._contentAssessor.results.map( result => result.serialize() ),
				score: this._contentAssessor.calculateOverallScore(),
			};
		}

		return this._results;
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
