// External dependencies.
import { autop } from "@wordpress/autop";
import Jed from "jed";
import { forEach, has, includes, isNull, isObject, isString, isUndefined, merge, pickBy } from "lodash-es";
import { getLogger } from "loglevel";

// YoastSEO.js dependencies.
import * as assessments from "../assessments";
import * as bundledPlugins from "../bundledPlugins";
import * as helpers from "../helpers";
import * as markers from "../markers";
import * as string from "../stringProcessing";
import * as interpreters from "../interpreters";
import * as config from "../config";

import Assessor from "../assessor";
import Assessment from "../assessment";
import SEOAssessor from "../seoAssessor";
import ContentAssessor from "../contentAssessor";
import TaxonomyAssessor from "../taxonomyAssessor";
import Pluggable from "../pluggable";
import Researcher from "../researcher";
import SnippetPreview from "../snippetPreview";
import Paper from "../values/Paper";
import AssessmentResult from "../values/AssessmentResult";
import RelatedKeywordAssessor from "../relatedKeywordAssessor";

const YoastSEO = {
	Assessor,
	Assessment,
	SEOAssessor,
	ContentAssessor,
	TaxonomyAssessor,
	Pluggable,
	Researcher,
	SnippetPreview,
	RelatedKeywordAssessor,

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

// Internal dependencies.
import CornerstoneContentAssessor from "../cornerstone/contentAssessor";
import CornerstoneRelatedKeywordAssessor from "../cornerstone/relatedKeywordAssessor";
import CornerstoneSEOAssessor from "../cornerstone/seoAssessor";
import InvalidTypeError from "../errors/invalidType";
import includesAny from "../helpers/includesAny";
import { configureShortlinker } from "../helpers/shortlinker";
import RelatedKeywordTaxonomyAssessor from "../relatedKeywordTaxonomyAssessor";
import Scheduler from "./scheduler";
import Transporter from "./transporter";
import wrapTryCatchAroundAction from "./wrapTryCatchAroundAction";

// Tree assessor functionality.
import buildTree from "../tree/builder";
import { constructReadabilityAssessor, constructSEOAssessor } from "../tree/assess/assessorFactories";
import { ReadabilityScoreAggregator, SEOScoreAggregator } from "../tree/assess/scoreAggregators";
import { TreeResearcher } from "../tree/research";

const keyphraseDistribution = new assessments.seo.KeyphraseDistributionAssessment();

const logger = getLogger( "yoast-analysis-worker" );
logger.setDefaultLevel( "error" );

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

		this._scheduler = new Scheduler();

		this._paper = null;
		this._relatedKeywords = {};

		this._i18n = AnalysisWebWorker.createI18n();
		this._researcher = new Researcher( this._paper );

		this._contentAssessor = null;
		this._seoAssessor = null;
		this._relatedKeywordAssessor = null;

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

		// Set up everything for the analysis on the tree.
		this.setupTreeAnalysis();

		// Bind actions to this scope.
		this.analyze = this.analyze.bind( this );
		this.analyzeDone = this.analyzeDone.bind( this );
		this.analyzeRelatedKeywordsDone = this.analyzeRelatedKeywordsDone.bind( this );
		this.loadScript = this.loadScript.bind( this );
		this.loadScriptDone = this.loadScriptDone.bind( this );
		this.customMessage = this.customMessage.bind( this );
		this.customMessageDone = this.customMessageDone.bind( this );
		this.clearCache = this.clearCache.bind( this );
		this.runResearch = this.runResearch.bind( this );
		this.runResearchDone = this.runResearchDone.bind( this );

		this.assessRelatedKeywords = this.assessRelatedKeywords.bind( this );

		// Bind register functions to this scope.
		this.registerAssessment = this.registerAssessment.bind( this );
		this.registerMessageHandler = this.registerMessageHandler.bind( this );
		this.refreshAssessment = this.refreshAssessment.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );

		// Wrap try/catch around actions.
		this.analyzeRelatedKeywords = wrapTryCatchAroundAction( logger, this.analyze,
			"An error occurred while running the related keywords analysis." );
		/*
		 * Overwrite this.analyze after we use it in this.analyzeRelatedKeywords so that this.analyzeRelatedKeywords
		 * doesn't use the overwritten version. Therefore, this order shouldn't be changed.
		 */
		this.analyze = wrapTryCatchAroundAction( logger, this.analyze,
			"An error occurred while running the analysis." );
		this.runResearch = wrapTryCatchAroundAction( logger, this.runResearch,
			"An error occurred after running the '%%name%%' research." );
	}

	/**
	 * Sets up the web worker for running the tree readability and SEO analysis.
	 *
	 * @returns {void}
	 */
	setupTreeAnalysis() {
		/* Researcher */
		this._treeResearcher = new TreeResearcher();

		/* Assessors. */
		this._contentTreeAssessor = null;
		this._seoTreeAssessor = null;
		this._relatedKeywordTreeAssessor = null;

		/* Registered assessments */
		this._registeredTreeAssessments = [];

		/* Score aggregators */
		this._seoScoreAggregator = new SEOScoreAggregator();
		this._contentScoreAggregator = new ReadabilityScoreAggregator();

		/* Tree representation of text to analyze */
		this._tree = null;
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
		this._scope.yoast = this._scope.yoast || {};
		this._scope.yoast.analysis = YoastSEO;
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
		payload = Transporter.parse( payload );

		logger.debug( "AnalysisWebWorker incoming:", type, id, payload );

		switch ( type ) {
			case "initialize":
				this.initialize( id, payload );
				this._scheduler.startPolling();
				break;
			case "analyze":
				this._scheduler.schedule( {
					id,
					execute: this.analyze,
					done: this.analyzeDone,
					data: payload,
					type: type,
				} );
				break;
			case "analyzeRelatedKeywords":
				this._scheduler.schedule( {
					id,
					execute: this.analyzeRelatedKeywords,
					done: this.analyzeRelatedKeywordsDone,
					data: payload,
					type: type,
				} );
				break;
			case "loadScript":
				this._scheduler.schedule( {
					id,
					execute: this.loadScript,
					done: this.loadScriptDone,
					data: payload,
					type: type,
				} );
				break;
			case "runResearch":
				this._scheduler.schedule( {
					id,
					execute: this.runResearch,
					done: this.runResearchDone,
					data: payload,
				} );
				break;
			case "customMessage": {
				const name = payload.name;
				if ( name && this._registeredMessageHandlers[ name ] ) {
					this._scheduler.schedule( {
						id,
						execute: this.customMessage,
						done: this.customMessageDone,
						data: payload,
						type: type,
					} );
					break;
				}
				this.customMessageDone( id, { error: new Error( "No message handler registered for messages with name: " + name ) } );
				break;
			}
			default:
				console.warn( "AnalysisWebWorker unrecognized action:", type );
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

		if ( useTaxonomy === true ) {
			assessor = new TaxonomyAssessor( this._i18n );
		} else {
			assessor = useCornerstone === true
				? new CornerstoneSEOAssessor( this._i18n, { locale: locale, researcher: this._researcher } )
				: new SEOAssessor( this._i18n, { locale: locale, researcher: this._researcher } );
		}


		if ( useKeywordDistribution && isUndefined( assessor.getAssessment( "keyphraseDistribution" ) ) ) {
			assessor.addAssessment( "keyphraseDistribution", keyphraseDistribution );
		}

		this._registeredAssessments.forEach( ( { name, assessment } ) => {
			if ( isUndefined( assessor.getAssessment( name ) ) ) {
				assessor.addAssessment( name, assessment );
			}
		} );

		return assessor;
	}

	/**
	 * Initializes the appropriate SEO assessor for related keywords.
	 *
	 * @returns {null|SEOAssessor|CornerstoneSEOAssessor|TaxonomyAssessor} The chosen
	 *                                                                     related keywords
	 *                                                                     assessor.
	 */
	createRelatedKeywordsAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useTaxonomy,
			locale,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		let assessor;

		if ( useTaxonomy === true ) {
			assessor = new RelatedKeywordTaxonomyAssessor( this._i18n );
		} else {
			assessor = useCornerstone === true
				? new CornerstoneRelatedKeywordAssessor( this._i18n, { locale: locale, researcher: this._researcher } )
				: new RelatedKeywordAssessor( this._i18n, { locale: locale, researcher: this._researcher } );
		}

		this._registeredAssessments.forEach( ( { name, assessment } ) => {
			if ( isUndefined( assessor.getAssessment( name ) ) ) {
				assessor.addAssessment( name, assessment );
			}
		} );

		return assessor;
	}

	/**
	 * Creates an SEO assessor for a tree, based on the given combination of cornerstone, taxonomy and related keyphrase flags.
	 *
	 * @param {Object}  assessorConfig                    The assessor configuration.
	 * @param {boolean} [assessorConfig.relatedKeyphrase] If this assessor is for a related keyphrase, instead of the main one.
	 * @param {boolean} [assessorConfig.taxonomy]         If this assessor is for a taxonomy page, instead of a regular page.
	 * @param {boolean} [assessorConfig.cornerstone]      If this assessor is for cornerstone content.
	 *
	 * @returns {module:tree/assess.TreeAssessor} The created tree assessor.
	 */
	createSEOTreeAssessor( assessorConfig ) {
		const assessor = constructSEOAssessor( this._i18n, this._treeResearcher, assessorConfig );

		this._registeredAssessments.forEach( ( { name, assessment } ) => {
			if ( assessor.getAssessment( name ) ) {
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
		logger.debug( "AnalysisWebWorker outgoing:", type, id, payload );

		payload = Transporter.serialize( payload );

		this._scope.postMessage( {
			type,
			id,
			payload,
		} );
	}

	/**
	 * Checks which assessors should update giving a configuration.
	 *
	 * @param {Object}   configuration          The configuration to check.
	 * @param {Assessor} [contentAssessor=null] The content assessor.
	 * @param {Assessor} [seoAssessor=null]     The SEO assessor.
	 *
	 * @returns {Object} Containing seo and readability with true or false.
	 */
	static shouldAssessorsUpdate( configuration, contentAssessor = null, seoAssessor = null ) {
		const readability = [ "contentAnalysisActive", "useCornerstone", "locale", "translations" ];
		const seo = [ "keywordAnalysisActive", "useCornerstone", "useTaxonomy", "useKeywordDistribution", "locale", "translations", "researchData" ];
		const configurationKeys = Object.keys( configuration );

		return {
			readability: isNull( contentAssessor ) || includesAny( configurationKeys, readability ),
			seo: isNull( seoAssessor ) || includesAny( configurationKeys, seo ),
		};
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
	 * @param {boolean} [configuration.useKeywordDistribution] Whether the keyphraseDistribution assessment should run.
	 * @param {string}  [configuration.locale]                 The locale used in the seo assessor.
	 * @param {Object}  [configuration.translations]           The translation strings.
	 * @param {Object}  [configuration.researchData]           Extra research data.
	 * @param {Object}  [configuration.defaultQueryParams]     The default query params for the Shortlinker.
	 * @param {string}  [configuration.logLevel]               Log level, see: https://github.com/pimterry/loglevel#documentation
	 *
	 * @returns {void}
	 */
	initialize( id, configuration ) {
		const update = AnalysisWebWorker.shouldAssessorsUpdate( configuration, this._contentAssessor, this._seoAssessor );

		if ( has( configuration, "translations" ) ) {
			this._i18n = AnalysisWebWorker.createI18n( configuration.translations );
			delete configuration.translations;
		}

		if ( has( configuration, "researchData" ) ) {
			forEach( configuration.researchData, ( data, research ) => {
				this._researcher.addResearchData( research, data );
			} );
			delete configuration.researchData;
		}

		if ( has( configuration, "defaultQueryParams" ) ) {
			configureShortlinker( { params: configuration.defaultQueryParams } );
			delete configuration.defaultQueryParams;
		}

		if ( has( configuration, "logLevel" ) ) {
			logger.setLevel( configuration.logLevel, false );
			delete configuration.logLevel;
		}

		this._configuration = merge( this._configuration, configuration );

		if ( update.readability ) {
			this._contentAssessor = this.createContentAssessor();
			this._contentTreeAssessor = constructReadabilityAssessor( this._i18n, this._treeResearcher, configuration.useCornerstone );
		}
		if ( update.seo ) {
			this._seoAssessor = this.createSEOAssessor();
			this._relatedKeywordAssessor = this.createRelatedKeywordsAssessor();
			// Tree assessors
			const { useCornerstone, useTaxonomy } = this._configuration;
			this._seoTreeAssessor = useTaxonomy
				? this.createSEOTreeAssessor( { taxonomy: true } )
				: this.createSEOTreeAssessor( { cornerstone: useCornerstone } );
			this._relatedKeywordTreeAssessor = this.createSEOTreeAssessor( {
				cornerstone: useCornerstone, relatedKeyphrase: true,
			} );
		}

		// Reset the paper in order to not use the cached results on analyze.
		this.clearCache();

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
		const combinedName = pluginName + "-" + name;

		if ( this._seoAssessor !== null ) {
			this._seoAssessor.addAssessment( combinedName, assessment );
		}
		this._registeredAssessments.push( { combinedName, assessment } );

		this.refreshAssessment( name, pluginName );

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
		this._paper = null;
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
		if ( this._paper === null ) {
			return true;
		}

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
	async analyze( id, { paper, relatedKeywords = {} } ) {
		// Automatically add paragraph tags, like Wordpress does, on blocks padded by double newlines or html elements.
		paper._text = autop( paper._text );
		paper._text = string.removeHtmlBlocks( paper._text );
		const paperHasChanges = this._paper === null || ! this._paper.equals( paper );
		const shouldReadabilityUpdate = this.shouldReadabilityUpdate( paper );

		if ( paperHasChanges ) {
			this._paper = paper;
			this._researcher.setPaper( this._paper );

			// Build the tree to analyze using the tree assessors.
			this._tree = buildTree( this._paper.getText() );

			// Update the configuration locale to the paper locale.
			this.setLocale( this._paper.getLocale() );
		}

		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			if ( paperHasChanges ) {
				// Assess the SEO of the content regarding the main keyphrase.
				this._results.seo[ "" ] = await this.assess( this._paper, this._tree, {
					oldAssessor: this._seoAssessor,
					treeAssessor: this._seoTreeAssessor,
					scoreAggregator: this._seoScoreAggregator,
				} );

				// Get the related keyphrase keys (one for each keyphrase).
				const requestedRelatedKeywordKeys = Object.keys( relatedKeywords );

				// Analyze the SEO for each related keyphrase and wait for the results.
				const relatedKeyphraseResults = await this.assessRelatedKeywords( paper, this._tree, relatedKeywords );

				// Put the related keyphrase results on the SEO results, under the right key.
				relatedKeyphraseResults.forEach( result => {
					this._results.seo[ result.key ] = result.results;
				} );

				// Clear the unrequested results, but only if there are requested related keywords.
				if ( requestedRelatedKeywordKeys.length > 1 ) {
					this._results.seo = pickBy( this._results.seo,
						( relatedKeyword, key ) =>	includes( requestedRelatedKeywordKeys, key )
					);
				}
			}
		}

		if ( this._configuration.contentAnalysisActive && this._contentAssessor && shouldReadabilityUpdate ) {
			const analysisCombination = {
				oldAssessor: this._contentAssessor,
				treeAssessor: this._contentTreeAssessor,
				scoreAggregator: this._contentScoreAggregator,
			};
			this._results.readability = await this.assess( this._paper, this._tree, analysisCombination );
		}

		return this._results;
	}

	/**
	 * Assesses a given paper and tree combination
	 * using an original Assessor (that works on a string representation of the text)
	 * and a new Tree Assessor (that works on a tree representation).
	 *
	 * The results of both analyses are combined using the given score aggregator.
	 *
	 * @param {Paper}                      paper The paper to analyze.
	 * @param {module:tree/structure.Node} tree  The tree to analyze.
	 *
	 * @param {Object}                             analysisCombination                 Which assessors and score aggregator to use.
	 * @param {Assessor}                           analysisCombination.oldAssessor     The original assessor.
	 * @param {module:tree/assess.TreeAssessor}    analysisCombination.treeAssessor    The new assessor.
	 * @param {module:tree/assess.ScoreAggregator} analysisCombination.scoreAggregator The score aggregator to use.
	 *
	 * @returns {Promise<{score: number, results: AssessmentResult[]}>} The analysis results.
	 */
	async assess( paper, tree, analysisCombination ) {
		const { oldAssessor, treeAssessor, scoreAggregator } = analysisCombination;
		/*
		 * Assess the paper and the tree
		 * using the original assessor and the tree assessor.
		 */
		oldAssessor.assess( paper );
		const assessorResults = oldAssessor.results;
		const treeAnalysisResult = await treeAssessor.assess( paper, tree );

		// Combine the results of both assessors.
		const results = [ ...treeAnalysisResult.results, ...assessorResults ];

		// Aggregate the results.
		const score = scoreAggregator.aggregate( results );

		return {
			results: results,
			score: score,
		};
	}

	/**
	 * Assesses the SEO of a paper and tree combination on the given related keyphrases and their synonyms.
	 *
	 * The old assessor as well as the new tree assessor are used and their results are combined.
	 *
	 * @param {Paper}                 paper           The paper to analyze.
	 * @param {module:tree/structure} tree            The tree to analyze.
	 * @param {Object}                relatedKeywords The related keyphrases to use in the analysis.
	 *
	 * @returns {Promise<[{results: {score: number, results: AssessmentResult[]}, key: string}]>} The results, one for each keyphrase.
	 */
	async assessRelatedKeywords( paper, tree, relatedKeywords ) {
		const keywordKeys = Object.keys( relatedKeywords );
		return await Promise.all( keywordKeys.map( key => {
			this._relatedKeywords[ key ] = relatedKeywords[ key ];

			const relatedPaper = Paper.parse( {
				...paper.serialize(),
				keyword: this._relatedKeywords[ key ].keyword,
				synonyms: this._relatedKeywords[ key ].synonyms,
			} );

			// Which combination of (tree) assessors and score aggregator to use.
			const analysisCombination = {
				oldAssessor: this._relatedKeywordAssessor,
				treeAssessor: this._relatedKeywordTreeAssessor,
				scoreAggregator: this._seoScoreAggregator,
			};

			// We need to remember the key, since the SEO results are stored in an object, not an array.
			return this.assess( relatedPaper, tree, analysisCombination ).then(
				results => ( { key: key, results: results } )
			);
		} ) );
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
		if ( result.error ) {
			this.send( "analyze:failed", id, result );
			return;
		}
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
		if ( result.error ) {
			this.send( "analyzeRelatedKeywords:failed", id, result );
			return;
		}
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
		} catch ( error ) {
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

	/**
	 * Runs the specified research in the worker. Optionally pass a paper.
	 *
	 * @param {number} id     The request id.
	 * @param {string} name   The name of the research to run.
	 * @param {Paper} [paper] The paper to run the research on if it shouldn't
	 *                        be run on the latest paper.
	 *
	 * @returns {Object} The result of the research.
	 */
	runResearch( id, { name, paper = null } ) {
		// Save morphology data if it is available in the current researcher.
		const morphologyData = this._researcher.getData( "morphology" );

		let researcher = this._researcher;
		// When a specific paper is passed we create a temporary new researcher.
		if ( paper !== null ) {
			researcher = new Researcher( paper );
			researcher.addResearchData( "morphology", morphologyData );
		}

		return researcher.getResearch( name );
	}

	/**
	 * Send the result of a custom message back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	runResearchDone( id, result ) {
		if ( result.error ) {
			this.send( "runResearch:failed", id, result );
			return;
		}
		this.send( "runResearch:done", id, result );
	}
}
