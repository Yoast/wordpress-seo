/* eslint-disable complexity */
// External dependencies.
import { enableFeatures } from "@yoast/feature-flag";
import { __, setLocaleData, sprintf } from "@wordpress/i18n";
import { forEach, has, includes, isEmpty, isEqual, isNull, isObject, isString, isUndefined, merge, pickBy } from "lodash";
import { getLogger } from "loglevel";

// Internal dependencies.
import AssessmentResult from "../values/AssessmentResult.js";
import { build } from "../parse/build";
import { configureShortlinker } from "../helpers/shortlinker";
import InvalidTypeError from "../errors/invalidType.js";
import includesAny from "../helpers/includesAny.js";
import LanguageProcessor from "../parse/language/LanguageProcessor.js";
import MissingArgumentError from "../errors/missingArgument.js";
import Paper from "../values/Paper.js";
import Scheduler from "./scheduler";
import Transporter from "./transporter";
import wrapTryCatchAroundAction from "./wrapTryCatchAroundAction.js";

// Assessor classes.
import ContentAssessor from "../scoring/assessors/contentAssessor.js";
import CornerstoneContentAssessor from "../scoring/assessors/cornerstone/contentAssessor.js";
import CornerstoneRelatedKeywordAssessor from "../scoring/assessors/cornerstone/relatedKeywordAssessor.js";
import CornerstoneSEOAssessor from "../scoring/assessors/cornerstone/seoAssessor.js";
import InclusiveLanguageAssessor from "../scoring/assessors/inclusiveLanguageAssessor.js";
import RelatedKeywordAssessor from "../scoring/assessors/relatedKeywordAssessor.js";
import RelatedKeywordTaxonomyAssessor from "../scoring/assessors/relatedKeywordTaxonomyAssessor.js";
import SEOAssessor from "../scoring/assessors/seoAssessor.js";
import TaxonomyAssessor from "../scoring/assessors/taxonomyAssessor.js";

// Tree assessor functionality.
import { ReadabilityScoreAggregator, SEOScoreAggregator } from "../scoring/scoreAggregators";

const logger = getLogger( "yoast-analysis-worker" );
logger.setDefaultLevel( "error" );

/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */
export default class AnalysisWebWorker {
	/* eslint-disable max-statements */
	/**
	 * Initializes the AnalysisWebWorker class.
	 *
	 * @param {Object}      scope       The scope for the messaging. Expected to have the
	 *                                  `onmessage` event and the `postMessage` function.
	 * @param {Researcher}  researcher  The researcher to use.
	 */
	constructor( scope, researcher ) {
		this._scope = scope;

		this._configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			inclusiveLanguageAnalysisActive: false,
			useCornerstone: false,
			useTaxonomy: false,
			// The locale used for language-specific configurations in Flesch-reading ease and Sentence length assessments.
			locale: "en_US",
			customAnalysisType: "",
		};

		this._scheduler = new Scheduler();

		this._paper = null;
		this._relatedKeywords = {};

		this._researcher = researcher;

		this._contentAssessor = null;
		this._seoAssessor = null;
		this._relatedKeywordAssessor = null;

		this.additionalAssessors = {};

		this._inclusiveLanguageOptions = {};

		/*
		 * The cached analyses results.
		 *
		 * A single result has the following structure:
		 * {AssessmentResult[]} 	readability.results An array of assessment results; in serialized format.
		 * {number}             	readability.score   The overall score.
		 *
		 * The results have the following structure.
		 * {Object} 				readability 		Content assessor results.
		 * {Object} 				seo         		SEO assessor results, per keyword identifier or empty string for the main.
		 * {Object} 				seo[ "" ]  			The result of the paper analysis for the main keyword.
		 * {Object} 				seo[ key ]  		Same as above, but instead for a related keyword.
		 * {Object} 				inclusiveLanguage 	Inclusive language assessor results.
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
			inclusiveLanguage: {
				results: [],
				score: 0,
			},
		};
		this._registeredAssessments = [];
		this._registeredMessageHandlers = {};
		this._registeredParsers = [];

		// Set up everything for the analysis on the tree.
		this.setupTreeAnalysis();

		this.bindActions();

		this.assessRelatedKeywords = this.assessRelatedKeywords.bind( this );

		// Bind register functions to this scope.
		this.registerAssessment = this.registerAssessment.bind( this );
		this.registerMessageHandler = this.registerMessageHandler.bind( this );
		this.refreshAssessment = this.refreshAssessment.bind( this );
		this.setCustomContentAssessorClass = this.setCustomContentAssessorClass.bind( this );
		this.setCustomCornerstoneContentAssessorClass = this.setCustomCornerstoneContentAssessorClass.bind( this );
		this.setCustomSEOAssessorClass = this.setCustomSEOAssessorClass.bind( this );
		this.setCustomCornerstoneSEOAssessorClass = this.setCustomCornerstoneSEOAssessorClass.bind( this );
		this.setCustomRelatedKeywordAssessorClass = this.setCustomRelatedKeywordAssessorClass.bind( this );
		this.setCustomCornerstoneRelatedKeywordAssessorClass = this.setCustomCornerstoneRelatedKeywordAssessorClass.bind( this );
		this.registerAssessor = this.registerAssessor.bind( this );
		this.registerResearch = this.registerResearch.bind( this );
		this.registerHelper = this.registerHelper.bind( this );
		this.registerResearcherConfig = this.registerResearcherConfig.bind( this );
		this.setInclusiveLanguageOptions = this.setInclusiveLanguageOptions.bind( this );

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
	/* eslint-enable max-statements */

	/**
	 * Binds actions to this scope.
	 *
	 * @returns {void}
	 */
	bindActions() {
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
	}

	/**
	 * Sets a custom content assessor class.
	 *
	 * @param {Class}  ContentAssessorClass     A content assessor class.
	 * @param {string} customAnalysisType       The type of analysis.
	 * @param {Object} customAssessorOptions    The options to use.
	 *
	 * @returns {void}
	 */
	setCustomContentAssessorClass( ContentAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomContentAssessorClasses[ customAnalysisType ] = ContentAssessorClass;
		this._CustomContentAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._contentAssessor = this.createContentAssessor();
	}

	/**
	 * Sets a custom cornerstone content assessor class.
	 *
	 * @param {Class}  CornerstoneContentAssessorClass  A cornerstone content assessor class.
	 * @param {string} customAnalysisType               The type of analysis.
	 * @param {Object} customAssessorOptions            The options to use.
	 *
	 * @returns {void}
	 */
	setCustomCornerstoneContentAssessorClass( CornerstoneContentAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomCornerstoneContentAssessorClasses[ customAnalysisType ] = CornerstoneContentAssessorClass;
		this._CustomCornerstoneContentAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._contentAssessor = this.createContentAssessor();
	}

	/**
	 * Sets a custom SEO assessor class.
	 *
	 * @param {Class}   SEOAssessorClass         An SEO assessor class.
	 * @param {string}  customAnalysisType       The type of analysis.
	 * @param {Object}  customAssessorOptions    The options to use.
	 *
	 * @returns {void}
	 */
	setCustomSEOAssessorClass( SEOAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomSEOAssessorClasses[ customAnalysisType ] = SEOAssessorClass;
		this._CustomSEOAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._seoAssessor = this.createSEOAssessor();
	}

	/**
	 * Sets a custom cornerstone SEO assessor class.
	 *
	 * @param {Class}   CornerstoneSEOAssessorClass  A cornerstone SEO assessor class.
	 * @param {string}  customAnalysisType           The type of analysis.
	 * @param {Object}  customAssessorOptions        The options to use.
	 *
	 * @returns {void}
	 */
	setCustomCornerstoneSEOAssessorClass( CornerstoneSEOAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomCornerstoneSEOAssessorClasses[ customAnalysisType ] = CornerstoneSEOAssessorClass;
		this._CustomCornerstoneSEOAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._seoAssessor = this.createSEOAssessor();
	}

	/**
	 * Sets a custom related keyword assessor class.
	 *
	 * @param {Class}   RelatedKeywordAssessorClass A related keyword assessor class.
	 * @param {string}  customAnalysisType          The type of analysis.
	 * @param {Object}  customAssessorOptions       The options to use.
	 *
	 * @returns {void}
	 */
	setCustomRelatedKeywordAssessorClass( RelatedKeywordAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomRelatedKeywordAssessorClasses[ customAnalysisType ] = RelatedKeywordAssessorClass;
		this._CustomRelatedKeywordAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._relatedKeywordAssessor = this.createRelatedKeywordsAssessor();
	}

	/**
	 * Sets a custom cornerstone related keyword assessor class.
	 *
	 * @param {Class}   CornerstoneRelatedKeywordAssessorClass  A cornerstone related keyword assessor class.
	 * @param {string}  customAnalysisType                      The type of analysis.
	 * @param {Object}  customAssessorOptions                   The options to use.
	 *
	 * @returns {void}
	 */
	setCustomCornerstoneRelatedKeywordAssessorClass( CornerstoneRelatedKeywordAssessorClass, customAnalysisType, customAssessorOptions ) {
		this._CustomCornerstoneRelatedKeywordAssessorClasses[ customAnalysisType ] = CornerstoneRelatedKeywordAssessorClass;
		this._CustomCornerstoneRelatedKeywordAssessorOptions[ customAnalysisType ] = customAssessorOptions;
		this._relatedKeywordAssessor = this.createRelatedKeywordsAssessor();
	}

	/**
	 * Sets the options to use for the Inclusive language analysis.
	 *
	 * @param {{infoLinks: {}}} options The options to use.
	 *
	 * @returns {void}
	 */
	setInclusiveLanguageOptions( options ) {
		this._inclusiveLanguageOptions = options;
	}

	/**
	 * Sets up the web worker for running the tree readability and SEO analysis.
	 *
	 * @returns {void}
	 */
	setupTreeAnalysis() {
		// Researcher
		/*
		 * Disabled code:
		 * this._treeResearcher = new TreeResearcher();
		 */
		this._treeResearcher = null;

		// Assessors
		this._contentTreeAssessor = null;
		this._seoTreeAssessor = null;
		this._relatedKeywordTreeAssessor = null;

		// Custom assessor classes.
		this._CustomSEOAssessorClasses = {};
		this._CustomCornerstoneSEOAssessorClasses = {};
		this._CustomContentAssessorClasses = {};
		this._CustomCornerstoneContentAssessorClasses = {};
		this._CustomRelatedKeywordAssessorClasses = {};
		this._CustomCornerstoneRelatedKeywordAssessorClasses = {};

		// Custom assessor options.
		this._CustomSEOAssessorOptions = {};
		this._CustomCornerstoneSEOAssessorOptions = {};
		this._CustomContentAssessorOptions = {};
		this._CustomCornerstoneContentAssessorOptions = {};
		this._CustomRelatedKeywordAssessorOptions = {};
		this._CustomCornerstoneRelatedKeywordAssessorOptions = {};

		// Registered assessments
		this._registeredTreeAssessments = [];

		// Score aggregators
		this._seoScoreAggregator = new SEOScoreAggregator();
		this._contentScoreAggregator = new ReadabilityScoreAggregator();

		// Tree representation of text to analyze
		this._tree = null;

		// Tree builder.
		this._treeBuilder = null;
	}

	/**
	 * Registers this web worker with the scope passed to it's constructor.
	 *
	 * @returns {void}
	 */
	register() {
		this._scope.onmessage = this.handleMessage;
		this._scope.analysisWorker = this;
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
	 * Initializes the appropriate content assessor.
	 *
	 * @returns {null|Assessor} The chosen content assessor.
	 */
	createContentAssessor() {
		const {
			contentAnalysisActive,
			useCornerstone,
			customAnalysisType,
		} = this._configuration;

		if ( contentAnalysisActive === false ) {
			return null;
		}

		let assessor;

		if ( useCornerstone === true ) {
			/*
			 * Use a custom cornerstone content assessor if available,
			 * otherwise set the default cornerstone content assessor.
			 */
			assessor = this._CustomCornerstoneContentAssessorClasses[ customAnalysisType ]
				? new this._CustomCornerstoneContentAssessorClasses[ customAnalysisType ](
					this._researcher,
					this._CustomCornerstoneContentAssessorOptions[ customAnalysisType ] )
				: new CornerstoneContentAssessor( this._researcher );

			// Add the readability assessment for cornerstone content to the cornerstone content assessor.
			this._registeredAssessments.forEach( ( { name, assessment, type } ) => {
				if ( isUndefined( assessor.getAssessment( name ) ) && type === "cornerstoneReadability" ) {
					assessor.addAssessment( name, assessment );
				}
			} );
		} else {
			/*
			 * For non-cornerstone content, use a custom SEO assessor if available,
	         * otherwise use the default SEO assessor.
			 */
			assessor = this._CustomContentAssessorClasses[ customAnalysisType ]
				? new this._CustomContentAssessorClasses[ customAnalysisType ](
					this._researcher,
					this._CustomContentAssessorOptions[ customAnalysisType ] )
				: new ContentAssessor( this._researcher );

			// Add the readability assessment for regular content to the regular content assessor.
			this._registeredAssessments.forEach( ( { name, assessment, type } ) => {
				if ( isUndefined( assessor.getAssessment( name ) ) && type === "readability" ) {
					assessor.addAssessment( name, assessment );
				}
			} );
		}

		return assessor;
	}

	/**
	 * Initializes the appropriate SEO assessor.
	 *
	 * @returns {null|Assessor} The chosen SEO assessor.
	 */
	createSEOAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useTaxonomy,
			customAnalysisType,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		let assessor;

		if ( useTaxonomy === true ) {
			assessor = new TaxonomyAssessor( this._researcher );
		} else {
			// Set cornerstone SEO assessor for cornerstone content.
			if ( useCornerstone === true ) {
				// Use a custom cornerstone SEO assessor if available, otherwise set the default cornerstone SEO assessor.
				assessor = this._CustomCornerstoneSEOAssessorClasses[ customAnalysisType ]
					? new this._CustomCornerstoneSEOAssessorClasses[ customAnalysisType ](
						this._researcher,
						this._CustomCornerstoneSEOAssessorOptions[ customAnalysisType ] )
					: new CornerstoneSEOAssessor( this._researcher );
			} else {
				/*
				 * For non-cornerstone content, use a custom SEO assessor if available,
				 * otherwise use the default SEO assessor.
				 */
				assessor = this._CustomSEOAssessorClasses[ customAnalysisType ]
					? new this._CustomSEOAssessorClasses[ customAnalysisType ](
						this._researcher,
						this._CustomSEOAssessorOptions[ customAnalysisType ] )
					: new SEOAssessor( this._researcher );
			}
		}

		this._registeredAssessments.forEach( ( { name, assessment, type } ) => {
			if ( isUndefined( assessor.getAssessment( name ) ) && type === "seo" ) {
				assessor.addAssessment( name, assessment );
			}
		} );

		return assessor;
	}

	/**
	 * Initializes the appropriate inclusive language assessor.
	 *
	 * @returns {null|Assessor} The chosen inclusive language assessor.
	 */
	createInclusiveLanguageAssessor() {
		const { inclusiveLanguageAnalysisActive } = this._configuration;

		if ( inclusiveLanguageAnalysisActive === false ) {
			return null;
		}

		return new InclusiveLanguageAssessor( this._researcher, this._inclusiveLanguageOptions );
	}


	/**
	 * Initializes the appropriate SEO assessor for related keywords.
	 *
	 * @returns {null|Assessor} The chosen related keywords assessor.
	 */
	createRelatedKeywordsAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useTaxonomy,
			customAnalysisType,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		let assessor;

		if ( useTaxonomy === true ) {
			assessor = new RelatedKeywordTaxonomyAssessor( this._researcher );
		} else {
			// Set cornerstone related keyword assessor for cornerstone content.
			if ( useCornerstone === true ) {
				// Use a custom related keyword assessor if available, otherwise use the default related keyword assessor.
				assessor = this._CustomCornerstoneRelatedKeywordAssessorClasses[ customAnalysisType ]
					? new this._CustomCornerstoneRelatedKeywordAssessorClasses[ customAnalysisType ](
						this._researcher,
						this._CustomCornerstoneRelatedKeywordAssessorOptions[ customAnalysisType ] )
					: new CornerstoneRelatedKeywordAssessor( this._researcher );
			} else {
				/*
				 * For non-cornerstone content, use a custom related keyword assessor if available,
				 * otherwise use the default related keyword assessor.
				 */
				assessor = this._CustomRelatedKeywordAssessorClasses[ customAnalysisType ]
					? new this._CustomRelatedKeywordAssessorClasses[ customAnalysisType ](
						this._researcher,
						this._CustomRelatedKeywordAssessorOptions[ customAnalysisType ] )
					: new RelatedKeywordAssessor( this._researcher );
			}
		}

		this._registeredAssessments.forEach( ( { name, assessment, type } ) => {
			if ( isUndefined( assessor.getAssessment( name ) ) && type === "relatedKeyphrase" ) {
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
	 * @returns {module:parsedPaper/assess.TreeAssessor} The created tree assessor.
	 */

	/*
	 * Disabled code:
	 * createSEOTreeAssessor( assessorConfig ) {
	 * 	 return constructSEOAssessor( this._treeResearcher, assessorConfig );
	 * }
	 */

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
	 * @param {Assessor} [inclusiveLanguageAssessor=null] The inclusive language assessor.
	 *
	 * @returns {Object} Containing seo, readability, and inclusiveLanguage with true or false.
	 */
	static shouldAssessorsUpdate(
		configuration,
		contentAssessor = null,
		seoAssessor = null,
		inclusiveLanguageAssessor = null
	) {
		const readability = [
			"contentAnalysisActive",
			"useCornerstone",
			"locale",
			"translations",
			"customAnalysisType",
		];
		const seo = [
			"keywordAnalysisActive",
			"useCornerstone",
			"useTaxonomy",
			"locale",
			"translations",
			"researchData",
			"customAnalysisType",
		];
		const inclusiveLanguage = [
			"inclusiveLanguageAnalysisActive",
			"locale",
			"translations",
		];

		const configurationKeys = Object.keys( configuration );

		return {
			readability: isNull( contentAssessor ) || includesAny( configurationKeys, readability ),
			seo: isNull( seoAssessor ) || includesAny( configurationKeys, seo ),
			inclusiveLanguage: isNull( inclusiveLanguageAssessor ) || includesAny( configurationKeys, inclusiveLanguage ),
		};
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {number}   id                                     The request id.
	 * @param {Object}   configuration                          The configuration object.
	 * @param {boolean}  [configuration.contentAnalysisActive]  Whether the content analysis is active.
	 * @param {boolean}  [configuration.keywordAnalysisActive]  Whether the keyword analysis is active.
	 * @param {boolean}  [configuration.useCornerstone]         Whether the paper is cornerstone or not.
	 * @param {boolean}  [configuration.useTaxonomy]            Whether the taxonomy assessor should be used.
	 * @param {string}   [configuration.locale]                 The locale used in the seo assessor.
	 * @param {Object}   [configuration.translations]           The translation strings.
	 * @param {Object}   [configuration.researchData]           Extra research data.
	 * @param {Object}   [configuration.defaultQueryParams]     The default query params for the Shortlinker.
	 * @param {string}   [configuration.logLevel]               Log level, see: https://github.com/pimterry/loglevel#documentation
	 * @param {string[]} [configuration.enabledFeatures]        A list of feature name flags of the experimental features to enable.
	 *
	 * @returns {void}
	 */
	initialize( id, configuration ) {
		const update = AnalysisWebWorker.shouldAssessorsUpdate(
			configuration,
			this._contentAssessor,
			this._seoAssessor,
			this._inclusiveLanguageAssessor
		);

		if ( has( configuration, "translations" ) ) {
			Object.values( configuration.translations ).forEach( translation => {
				// Don't proceed if translation object is null or otherwise falsy.
				if ( translation ) {
					const { domain, locale_data: localeData } = translation;
					setLocaleData( localeData[ domain ], domain );
				}
			} );
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

		if ( has( configuration, "enabledFeatures" ) ) {
			// Make feature flags available inside of the web worker.
			enableFeatures( configuration.enabledFeatures );
			delete configuration.enabledFeatures;
		}

		this._configuration = merge( this._configuration, configuration );

		if ( update.readability ) {
			this._contentAssessor = this.createContentAssessor();
			/*
			 * Disabled code:
			 * this._contentTreeAssessor = constructReadabilityAssessor( this._treeResearcher, configuration.useCornerstone );
			 */
			this._contentTreeAssessor = null;
		}
		if ( update.seo ) {
			this._seoAssessor = this.createSEOAssessor();
			this._relatedKeywordAssessor = this.createRelatedKeywordsAssessor();
			// Tree assessors
			/*
			 * Disabled code:
			 * const { useCornerstone, useTaxonomy } = this._configuration;
			 * this._seoTreeAssessor = useTaxonomy
			 * 	? this.createSEOTreeAssessor( { taxonomy: true } )
			 * 	: this.createSEOTreeAssessor( { cornerstone: useCornerstone } );
			 * this._relatedKeywordTreeAssessor = this.createSEOTreeAssessor( {
			 * 	cornerstone: useCornerstone, relatedKeyphrase: true,
			 * } );
			 */
		}

		if ( update.inclusiveLanguage ) {
			this._inclusiveLanguageAssessor = this.createInclusiveLanguageAssessor();
		}

		// Reset the paper in order to not use the cached results on analyze.
		this.clearCache();

		this.send( "initialize:done", id );
	}

	/**
	 * Registers a custom assessor.
	 *
	 * @param {string} name The name of the assessor.
	 * @param {Function} AssessorClass The assessor class to instantiate.
	 * @param {Function} shouldUpdate Function that checks whether the assessor should update.
	 *
	 * @returns {void}
	 */
	registerAssessor( name, AssessorClass, shouldUpdate ) {
		const assessor = new AssessorClass( this._researcher );
		this.additionalAssessors[ name ] = { assessor, shouldUpdate };
	}


	/**
	 * Register an assessment for a specific plugin.
	 *
	 * @param {string}   name       The name of the assessment.
	 * @param {function} assessment The function to run as an assessment.
	 * @param {string}   pluginName The name of the plugin associated with the assessment.
	 * @param {string}   type       The type of the assessment. The default type is seo.
	 *
	 * @returns {boolean} Whether registering the assessment was successful.
	 */
	registerAssessment( name, assessment, pluginName, type = "seo" ) {
		const { useCornerstone } = this._configuration;

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

		if ( this._seoAssessor !== null && type === "seo" ) {
			this._seoAssessor.addAssessment( combinedName, assessment );
		}
		if ( this._contentAssessor !== null && type === "readability" ) {
			this._contentAssessor.addAssessment( combinedName, assessment );
		}
		if ( this._contentAssessor !== null && type === "cornerstoneReadability" && useCornerstone ) {
			this._contentAssessor.addAssessment( combinedName, assessment );
		}
		if ( this._relatedKeywordAssessor !== null && type === "relatedKeyphrase" ) {
			this._relatedKeywordAssessor.addAssessment( combinedName, assessment );
		}
		this._registeredAssessments.push( { combinedName, assessment, type } );

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
	 * Register a parser that parses a formatted text
	 * to a structured tree representation that can be further analyzed.
	 *
	 * @param {Object}   parser                              The parser to register.
	 * @param {function(Paper): boolean} parser.isApplicable A method that checks whether this parser is applicable for a paper.
	 * @param {function(Paper): module:parsedPaper/structure.Node } parser.parse A method that parses a paper to a structured tree representation.
	 *
	 * @returns {void}
	 */
	registerParser( parser ) {
		if ( typeof parser.isApplicable !== "function" ) {
			throw new InvalidTypeError( "Failed to register the custom parser. Expected parameter 'parser' to have a method 'isApplicable'." );
		}
		if ( typeof parser.parse !== "function" ) {
			throw new InvalidTypeError( "Failed to register the custom parser. Expected parameter 'parser' to have a method 'parse'." );
		}

		this._registeredParsers.push( parser );
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

		if ( this._paper.getKeyword() !== paper.getKeyword() ) {
			return true;
		}

		// Perform deep comparison between the list of Gutenberg blocks as we want to update the readability analysis
		// if the client IDs of the blocks inside `wpBlocks` change.
		if ( ! isEqual( this._paper._attributes.wpBlocks, paper._attributes.wpBlocks ) ) {
			return true;
		}

		return this._paper.getLocale() !== paper.getLocale();
	}

	/**
	 * Checks if the paper contains changes that are used for inclusive language analysis.
	 *
	 * @param {Paper} paper The paper to check against the cached paper.
	 *
	 * @returns {boolean} True if there are changes detected.
	 */
	shouldInclusiveLanguageUpdate( paper ) {
		if ( this._paper === null ) {
			return true;
		}

		if ( this._paper.getText() !== paper.getText() ) {
			return true;
		}

		if ( this._paper.getTextTitle() !== paper.getTextTitle() ) {
			return true;
		}

		return this._paper.getLocale() !== paper.getLocale();
	}

	/**
	 * Updates the results for the inclusive language assessor.
	 *
	 * @param {boolean} shouldInclusiveLanguageUpdate Whether the results of the inclusive language assessor should be updated.
	 * @returns {void}
	 */
	updateInclusiveLanguageAssessor( shouldInclusiveLanguageUpdate ) {
		if ( this._configuration.inclusiveLanguageAnalysisActive && this._inclusiveLanguageAssessor && shouldInclusiveLanguageUpdate ) {
			this._inclusiveLanguageAssessor.assess( this._paper );
			this._results.inclusiveLanguage = {
				results: this._inclusiveLanguageAssessor.results,
				score: this._inclusiveLanguageAssessor.calculateOverallScore(),
			};
		}
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
	 * Checks whether the additional assessor should be updated.
	 *
	 * @param {Paper} paper The paper to check.
	 * @returns {Object} An object containing the information whether each additional assessor needs to be updated.
	 */
	shouldAdditionalAssessorsUpdate( paper ) {
		const shouldCustomAssessorsUpdate = {};
		Object.keys( this.additionalAssessors ).forEach(
			assessorName => {
				shouldCustomAssessorsUpdate[ assessorName ] = this.additionalAssessors[ assessorName ].shouldUpdate( this._paper, paper );
			}
		);
		return shouldCustomAssessorsUpdate;
	}

	/**
	 * Updates the results for the additional assessor.
	 *
	 * @param {boolean} shouldCustomAssessorsUpdate Whether the results of the additional assessor should be updated.
	 * @returns {void}
	 */
	updateAdditionalAssessors( shouldCustomAssessorsUpdate ) {
		Object.keys( this.additionalAssessors ).forEach(
			assessorName => {
				const { assessor } = this.additionalAssessors[ assessorName ];
				if ( ! this._results[ assessorName ] || shouldCustomAssessorsUpdate[ assessorName ] ) {
					assessor.assess( this._paper );
					this._results[ assessorName ] = {
						results: assessor.results,
						score: assessor.calculateOverallScore(),
					};
				}
			}
		);
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
		const paperHasChanges = this._paper === null || ! this._paper.equals( paper );
		const shouldReadabilityUpdate = this.shouldReadabilityUpdate( paper );
		const shouldInclusiveLanguageUpdate = this.shouldInclusiveLanguageUpdate( paper );
		const shouldCustomAssessorsUpdate = this.shouldAdditionalAssessorsUpdate( paper );

		// Only set the paper and build the tree if the paper has any changes.
		if ( paperHasChanges ) {
			this._paper = paper;
			this._researcher.setPaper( this._paper );

			const languageProcessor = new LanguageProcessor( this._researcher );
			const shortcodes = this._paper._attributes && this._paper._attributes.shortcodes;
			this._paper.setTree( build( this._paper, languageProcessor, shortcodes ) );

			// Update the configuration locale to the paper locale.
			this.setLocale( this._paper.getLocale() );
		}

		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			// Only assess the focus keyphrase if the paper has any changes.
			if ( paperHasChanges ) {
				// Assess the SEO of the content regarding the main keyphrase.
				this._results.seo[ "" ] = await this.assess( this._paper, this._tree, {
					oldAssessor: this._seoAssessor,
					treeAssessor: this._seoTreeAssessor,
					scoreAggregator: this._seoScoreAggregator,
				} );
			}

			// Only assess the related keyphrases when they have been given.
			if ( ! isEmpty( relatedKeywords ) ) {
				// Get the related keyphrase keys (one for each keyphrase).
				const requestedRelatedKeywordKeys = Object.keys( relatedKeywords );

				// Analyze the SEO for each related keyphrase and wait for the results.
				const relatedKeyphraseResults = await this.assessRelatedKeywords( paper, this._tree, relatedKeywords );

				// Put the related keyphrase results on the SEO results, under the right key.
				relatedKeyphraseResults.forEach( result => {
					this._results.seo[ result.key ] = result.results;
				} );

				// Clear the results of unrequested related keyphrases, but only if there are requested related keyphrases.
				if ( requestedRelatedKeywordKeys.length > 1 ) {
					this._results.seo = pickBy( this._results.seo,
						( relatedKeyword, key ) => includes( requestedRelatedKeywordKeys, key ) || key === ""
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
			// Set the locale (we are more lenient for languages that have full analysis support).
			analysisCombination.scoreAggregator.setLocale( this._configuration.locale );
			this._results.readability = await this.assess( this._paper, this._tree, analysisCombination );
		}

		this.updateInclusiveLanguageAssessor( shouldInclusiveLanguageUpdate );

		this.updateAdditionalAssessors( shouldCustomAssessorsUpdate );

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
	 * @param {module:parsedPaper/structure.Node} tree  The tree to analyze.
	 *
	 * @param {Object}                             analysisCombination                 Which assessors and score aggregator to use.
	 * @param {Assessor}                           analysisCombination.oldAssessor     The original assessor.
	 * @param {module:parsedPaper/assess.TreeAssessor}    analysisCombination.treeAssessor    The new assessor.
	 * @param {module:parsedPaper/assess.ScoreAggregator} analysisCombination.scoreAggregator The score aggregator to use.
	 *
	 * @returns {Promise<{score: number, results: AssessmentResult[]}>} The analysis results.
	 */
	async assess( paper, tree, analysisCombination ) {
		// Disabled code: The variable `treeAssessor` is removed from here.
		const { oldAssessor, scoreAggregator } = analysisCombination;
		/*
		 * Assess the paper and the tree
		 * using the original assessor and the tree assessor.
		 */
		oldAssessor.assess( paper );
		const oldAssessmentResults = oldAssessor.results;

		const treeAssessmentResults = [];

		/*
		 * Disable code:
		 * // Only assess tree if it has been built.
		 * if ( tree ) {
		 * const treeAssessorResult = await treeAssessor.assess( paper, tree );
		 * treeAssessmentResults = treeAssessorResult.results;
		 * } else {
		 * // Cannot assess the tree, generate errors on the assessments that use the tree assessor.
		 * const treeAssessments = treeAssessor.getAssessments();
		 * treeAssessmentResults = treeAssessments.map( assessment => this.generateAssessmentError( assessment ) );
		 * }
		 */

		// Combine the results of the tree assessor and old assessor.
		const results = [ ...treeAssessmentResults, ...oldAssessmentResults ];

		// Aggregate the results.
		const score = scoreAggregator.aggregate( results );

		return {
			results: results,
			score: score,
		};
	}

	/**
	 * Generates an error message ("grey bullet") for the given assessment.
	 *
	 * @param {module:parsedPaper/assess.Assessment} assessment The assessment to generate an error message for.
	 *
	 * @returns {AssessmentResult} The generated assessment result.
	 */
	generateAssessmentError( assessment ) {
		const result = new AssessmentResult();

		result.setScore( -1 );
		result.setText( sprintf(
			/* translators: %1$s expands to the name of the assessment. */
			__( "An error occurred in the '%1$s' assessment", "wordpress-seo" ),
			assessment.name
		) );

		return result;
	}

	/**
	 * Assesses the SEO of a paper and tree combination on the given related keyphrases and their synonyms.
	 *
	 * The old assessor as well as the new tree assessor are used and their results are combined.
	 *
	 * @param {Paper}                 paper           The paper to analyze.
	 * @param {module:parsedPaper/structure} tree            The tree to analyze.
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
				results => (
					{ key: key, results: results }
				)
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
	 * Registers custom research to the researcher.
	 *
	 * @param {string} name         The name of the research.
	 * @param {function} research   The research function to add.
	 *
	 * @returns {void}
	 */
	registerResearch( name, research ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to register the custom research. Expected parameter `name` to be a string." );
		}

		if ( ! isObject( research ) ) {
			throw new InvalidTypeError( "Failed to register the custom research. Expected parameter `research` to be a function." );
		}

		const researcher = this._researcher;

		if ( ! researcher.hasResearch( name ) ) {
			researcher.addResearch( name, research );
		}
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

		const researcher = this._researcher;
		// When a specific paper is passed we create a temporary new researcher.
		if ( paper !== null ) {
			researcher.setPaper( paper );
			researcher.addResearchData( "morphology", morphologyData );

			// Build and set the tree if it's not been set before.
			if ( paper.getTree() === null ) {
				const languageProcessor = new LanguageProcessor( researcher );
				const shortcodes = paper._attributes && paper._attributes.shortcodes;
				paper.setTree( build( paper, languageProcessor, shortcodes ) );
			}
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

	/**
	 * Registers a custom helper to the researcher.
	 *
	 * @param {string} name       The name of the helper.
	 * @param {function} helper   The helper function to add.
	 *
	 * @returns {void}
	 */
	registerHelper( name, helper ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to register the custom helper. Expected parameter `name` to be a string." );
		}

		if ( ! isObject( helper ) ) {
			throw new InvalidTypeError( "Failed to register the custom helper. Expected parameter `helper` to be a function." );
		}

		const researcher = this._researcher;

		if ( ! researcher.hasHelper( name ) ) {
			researcher.addHelper( name, helper );
		}
	}

	/**
	 * Registers a configuration to the researcher.
	 *
	 * @param {string}  name                The name of the researcher configuration.
	 * @param {*}       researcherConfig    The researcher configuration to add.
	 *
	 * @returns {void}
	 */
	registerResearcherConfig( name, researcherConfig ) {
		if ( ! isString( name ) ) {
			throw new InvalidTypeError( "Failed to register the custom researcher config. Expected parameter `name` to be a string." );
		}
		if ( isUndefined( researcherConfig ) || isEmpty( researcherConfig ) ) {
			throw new MissingArgumentError( "Failed to register the custom researcher config. Expected parameter `researcherConfig` to be defined." );
		}
		const researcher = this._researcher;

		if ( ! researcher.hasConfig( name ) ) {
			researcher.addConfig( name, researcherConfig );
		}
	}
}
