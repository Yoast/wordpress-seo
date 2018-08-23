// External dependencies.
const Jed = require( "jed" );
const forEach = require( "lodash/forEach" );
const merge = require( "lodash/merge" );
const pickBy = require( "lodash/pickBy" );
const includes = require( "lodash/includes" );
const isUndefined = require( "lodash/isUndefined" );
const isString = require( "lodash/isString" );
const isObject = require( "lodash/isObject" );

// YoastSEO.js dependencies.
import * as assessments from "../assessments";
import * as bundledPlugins from "../bundledPlugins";
import * as helpers from "../helpers";
import * as markers from "../markers";
import * as string from "../stringProcessing";
import * as interpreters from "../interpreters";
import * as config from "../config";

const Assessor = require( "../assessor" );
const Assessment = require( "../assessment" );
const SEOAssessor = require( "../seoAssessor" );
const ContentAssessor = require( "../contentAssessor" );
const TaxonomyAssessor = require( "../taxonomyAssessor" );
const Pluggable = require( "../pluggable" );
const Researcher = require( "../researcher" );
const SnippetPreview = require( "../snippetPreview" );

const Paper = require( "../values/Paper" );
const AssessmentResult = require( "../values/AssessmentResult" );

const YoastSEO = {
	Assessor,
	Assessment,
	SEOAssessor,
	ContentAssessor,
	TaxonomyAssessor,
	Pluggable,
	Researcher,
	SnippetPreview,

	Paper,
	AssessmentResult,

	assessments,
	bundledPlugins,
	helpers,
	markers,
	string,
	interpreters,
	config,
};

const CornerstoneContentAssessor = require( "../cornerstone/contentAssessor" );
const CornerstoneSEOAssessor = require( "../cornerstone/seoAssessor" );
const InvalidTypeError = require( "../errors/invalidType" );

// Internal dependencies.
import Scheduler from "./scheduler";

const largestKeywordDistanceAssessment = new assessments.seo.LargestKeywordDistanceAssessment();

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

		this._scheduler = new Scheduler( { resetQueue: false } );

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
		this._registeredAssessments = [];
		this._registeredMessageHandlers = {};

		// Bind actions to this scope.
		this.analyze = this.analyze.bind( this );
		this.analyzeDone = this.analyzeDone.bind( this );
		this.analyzeRelatedKeywordsDone = this.analyzeRelatedKeywordsDone.bind( this );
		this.loadScript = this.loadScript.bind( this );
		this.loadScriptDone = this.loadScriptDone.bind( this );
		this.customMessage = this.customMessage.bind( this );
		this.customMessageDone = this.customMessageDone.bind( this );
		this.clearCache = this.clearCache.bind( this );

		// Bind register functions to this scope.
		this.registerAssessment = this.registerAssessment.bind( this );
		this.registerMessageHandler = this.registerMessageHandler.bind( this );
		this.refreshAssessment = this.refreshAssessment.bind( this );

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
		this._scope.analysisWorker = {
			registerAssessment: this.registerAssessment,
			registerMessageHandler: this.registerMessageHandler,
			refreshAssessment: this.refreshAssessment,
		};
		this._scope.yoast = { analysis: YoastSEO };
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
			case "analyzeRelatedKeywords":
				this._scheduler.schedule( {
					id,
					execute: this.analyze,
					done: this.analyzeRelatedKeywordsDone,
					data: payload,
				} );
				break;
			case "loadScript":
				this._scheduler.schedule( {
					id,
					execute: this.loadScript,
					done: this.loadScriptDone,
					data: payload,
				} );
				break;
			case "runResearch":
				// this._scheduler.schedule( {
				// 	id,
				// 	execute: this.loadScript,
				// 	done: this.loadScriptDone,
				// 	data: payload,
				// } );
				// break;
			case "customMessage": {
				const name = payload.name;
				if ( name && this._registeredMessageHandlers[ name ] ) {
					this._scheduler.schedule( {
						id,
						execute: this.customMessage,
						done: this.customMessageDone,
						data: payload,
					} );
					break;
				}
				this.customMessageDone( id, { error: new Error( "No message handler registered for messages with name: " + name ) } );
				break;
			}
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

		this._registeredAssessments.forEach( ( { name, assessment } ) => {
			if ( isUndefined( assessor.getAssessment( name ) ) ) {
				assessor.addAssessment( name, assessment );
			}
		} );

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
	 * @param {boolean} [configuration.useCornerstone]         Whether the paper is cornerstone or not.
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
	 * Register an assessment for a specific plugin.
	 *
	 * @param {string}   name       The name of the assessment.
	 * @param {function} assessment The function to run as an assessment.
	 * @param {string}   pluginName The name of the plugin associated with the assessment.
	 *
	 * @returns {boolean} Whether registering the assessment was successful.
	 */
	registerAssessment( name, assessment, pluginName ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName + ". Expected parameter `name` to be a string." );
		}

		if ( ! isObject( assessment ) ) {
			throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
				". Expected parameter `assessment` to be a function." );
		}

		if ( ! isString( pluginName ) ) {
			throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
				". Expected parameter `pluginName` to be a string." );
		}

		// Prefix the name with the pluginName so the test name is always unique.
		name = pluginName + "-" + name;

		this._seoAssessor.addAssessment( name, assessment );
		this._registeredAssessments.push( { name, assessment } );

		return true;
	}

	/**
	 * Register a message handler for a specific plugin.
	 *
	 * @param {string}   name       The name of the message handler.
	 * @param {function} handler    The function to run as an message handler.
	 * @param {string}   pluginName The name of the plugin associated with the message handler.
	 *
	 * @returns {boolean} Whether registering the message handler was successful.
	 */
	registerMessageHandler( name, handler, pluginName ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to register handler for plugin " + pluginName + ". Expected parameter `name` to be a string." );
		}

		if ( ! isObject( handler ) ) {
			throw new InvalidTypeError( "Failed to register handler for plugin " + pluginName +
				". Expected parameter `handler` to be a function." );
		}

		if ( ! isString( pluginName ) ) {
			throw new InvalidTypeError( "Failed to register handler for plugin " + pluginName +
				". Expected parameter `pluginName` to be a string." );
		}

		// Prefix the name with the pluginName so the test name is always unique.
		name = pluginName + "-" + name;

		this._registeredMessageHandlers[ name ] = handler;
	}

	/**
	 * Refreshes an assessment in the analysis.
	 *
	 * Custom assessments can use this to mark their assessment as needing a
	 * refresh.
	 *
	 * @param {string} name The name of the assessment.
	 * @param {string} pluginName The name of the plugin associated with the assessment.
	 *
	 * @returns {boolean} Whether refreshing the assessment was successful.
	 */
	refreshAssessment( name, pluginName ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to refresh assessment for plugin " + pluginName + ". Expected parameter `name` to be a string." );
		}

		if ( ! isString( pluginName ) ) {
			throw new InvalidTypeError( "Failed to refresh assessment for plugin " + pluginName +
				". Expected parameter `pluginName` to be a string." );
		}

		this.clearCache();
	}

	/**
	 * Clears the worker cache to force a new analysis.
	 *
	 * @returns {void}
	 */
	clearCache() {
		this._paper = new Paper( "" );
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
		paper.text = string.removeHtmlBlocks( paper.text );
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
	 * Loads a new script from an external source.
	 *
	 * @param {number} id  The request id.
	 * @param {string} url The url of the script to load;
	 *
	 * @returns {Object} An object containing whether or not the url was loaded, the url and possibly an error message.
	 */
	loadScript( id, { url } ) {
		if ( isUndefined( url ) ) {
			return { loaded: false, url, message: "Load Script was called without an URL." };
		}

		try {
			this._scope.importScripts( url );
		} catch ( error ) {
			return { loaded: false, url, message: error.message };
		}

		return { loaded: true, url };
	}

	/**
	 * Sends the load script result back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	loadScriptDone( id, result ) {
		if ( ! result.loaded ) {
			this.send( "loadScript:failed", id, result );
			return;
		}

		this.send( "loadScript:done", id, result );
	}

	/**
	 * Sends the analyze result back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	analyzeDone( id, result ) {
		this.send( "analyze:done", id, result );
	}

	/**
	 * Sends the analyze related keywords result back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	analyzeRelatedKeywordsDone( id, result ) {
		this.send( "analyzeRelatedKeywords:done", id, result );
	}

	/**
	 * Handle a custom message using the registered handler.
	 *
	 * @param {number} id   The request id.
	 * @param {string} name The name of the message.
	 * @param {Object} data The data of the message.
	 *
	 * @returns {Object} An object containing either success and data or an error.
	 */
	customMessage( id, { name, data } ) {
		try {
			return {
				success: true,
				data: this._registeredMessageHandlers[ name ]( data ),
			};
		} catch( error ) {
			return { error };
		}
	}

	/**
	 * Send the result of a custom message back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	customMessageDone( id, result ) {
		if ( result.success ) {
			this.send( "customMessage:done", id, result.data );
			return;
		}
		this.send( "customMessage:failed", result.error );
	}
}
