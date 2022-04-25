import SnippetPreview from "./snippetPreview/snippetPreview.js";

import { setLocaleData } from "@wordpress/i18n";
import { debounce, defaultsDeep, forEach, isArray, isEmpty, isFunction, isObject, isString, isUndefined, merge, throttle } from "lodash-es";
import MissingArgument from "./errors/missingArgument";

import SEOAssessor from "./scoring/seoAssessor.js";
import KeyphraseDistributionAssessment from "./scoring/assessments/seo/KeyphraseDistributionAssessment.js";
import ContentAssessor from "./scoring/contentAssessor.js";
import CornerstoneSEOAssessor from "./scoring/cornerstone/seoAssessor.js";
import CornerstoneContentAssessor from "./scoring/cornerstone/contentAssessor.js";
import AssessorPresenter from "./scoring/renderers/AssessorPresenter.js";
import Pluggable from "./pluggable.js";
import Paper from "./values/Paper.js";
import { measureTextWidth } from "./helpers/createMeasurementElement.js";

import removeHtmlBlocks from "./languageProcessing/helpers/html/htmlParser.js";

const keyphraseDistribution = new KeyphraseDistributionAssessment();

var inputDebounceDelay = 800;

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
var defaults = {
	callbacks: {
		bindElementEvents: function() {},
		updateSnippetValues: function() {},
		saveScores: function() {},
		saveContentScore: function() {},
		updatedContentResults: function() {},
		updatedKeywordsResults: function() {},
	},
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "",
		keyword: "Choose a focus keyword",
		meta: "",
		text: "Start writing your text!",
	},
	queue: [ "wordCount",
		"keywordDensity",
		"subHeadings",
		"stopwords",
		"fleschReading",
		"linkCount",
		"imageCount",
		"slugKeyword",
		"urlLength",
		"metaDescription",
		"pageTitleKeyword",
		"pageTitleWidth",
		"firstParagraph",
		"'keywordDoubles" ],
	typeDelay: 3000,
	typeDelayStep: 1500,
	maxTypeDelay: 5000,
	dynamicDelay: true,
	locale: "en_US",
	translations: {
		domain: "wordpress-seo",
		// eslint-disable-next-line camelcase
		locale_data: {
			"wordpress-seo": {
				"": {},
			},
		},
	},
	replaceTarget: [],
	resetTarget: [],
	elementTarget: [],
	marker: function() {},
	keywordAnalysisActive: true,
	contentAnalysisActive: true,
	hasSnippetPreview: true,
	debounceRefresh: true,
};

/**
 * Creates a default snippet preview, this can be used if no snippet preview has been passed.
 *
 * @private
 * @this App
 *
 * @returns {SnippetPreview} The SnippetPreview object.
 */
function createDefaultSnippetPreview() {
	var targetElement = document.getElementById( this.config.targets.snippet );

	return new SnippetPreview( {
		analyzerApp: this,
		targetElement: targetElement,
		callbacks: {
			saveSnippetData: this.config.callbacks.saveSnippetData,
		},
	} );
}

/**
 * Returns whether or not the given argument is a valid SnippetPreview object.
 *
 * @param   {*}         snippetPreview  The 'object' to check against.
 * @returns {boolean}                   Whether or not it's a valid SnippetPreview object.
 */
function isValidSnippetPreview( snippetPreview ) {
	return ! isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object}      args            The arguments object passed to the App.
 * @returns {void}
 */
function verifyArguments( args ) {
	if ( ! isObject( args.callbacks.getData ) ) {
		throw new MissingArgument( "The app requires an object with a getdata callback." );
	}

	if ( ! isObject( args.targets ) ) {
		throw new MissingArgument( "`targets` is a required App argument, `targets` is not an object." );
	}

	// The args.targets.snippet argument is only required if not SnippetPreview object has been passed.
	if (
		args.hasSnippetPreview &&
		! isValidSnippetPreview( args.snippetPreview ) &&
		! isString( args.targets.snippet ) ) {
		throw new MissingArgument( "A snippet preview is required. When no SnippetPreview object isn't passed to " +
			"the App, the `targets.snippet` is a required App argument. `targets.snippet` is not a string." );
	}
}

/**
 * This should return an object with the given properties
 *
 * @callback YoastSEO.App~getData
 * @returns {Object} data
 * @returns {String} data.keyword The keyword that should be used
 * @returns {String} data.meta
 * @returns {String} data.text The text to analyze
 * @returns {String} data.metaTitle The text in the HTML title tag
 * @returns {String} data.title The title to analyze
 * @returns {String} data.url The URL for the given page
 * @returns {String} data.excerpt Excerpt for the pages
 */

/**
 * @callback YoastSEO.App~getAnalyzerInput
 *
 * @returns {Array} An array containing the analyzer queue
 */

/**
 * @callback YoastSEO.App~bindElementEvents
 *
 * @param {YoastSEO.App} app A reference to the YoastSEO.App from where this is called.
 */

/**
 * @callback YoastSEO.App~updateSnippetValues
 *
 * @param {Object} ev The event emitted from the DOM
 */

/**
 * @callback YoastSEO.App~saveScores
 *
 * @param {int} score The overall keyword score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the keyword score.
 */

/**
 * @callback YoastSEO.App~saveContentScore
 *
 * @param {int} score The overall content score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the content score.
 */

/**
 * @callback YoastSEO.App~updatedContentResults
 *
 * @param {Object[]} result The updated content analysis results.
 * @param {number} result[].score The SEO score.
 * @param {string} result[].rating String representation of the SEO score.
 * @param {string} result[].text Textual explanation of the score.
 * @param {number} overallContentScore The overall content SEO score.
 */

/**
 * @callback YoastSEO.App~updatedKeywordsResults
 *
 * @param {Object[]} result The updated keywords analysis results.
 * @param {number} result[].score The SEO score.
 * @param {string} result[].rating String representation of the SEO score.
 * @param {string} result[].text Textual explanation of the score.
 * @param {number} overallContentScore The overall keywords SEO score.
 */

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 *
 * @param {Object} args The arguments passed to the loader.
 * @param {Object} args.translations Jed compatible translations.
 * @param {Object} args.targets Targets to retrieve or set on.
 * @param {String} args.targets.snippet ID for the snippet preview element.
 * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
 * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the analyzer output.
 * @param {boolean} args.dynamicDelay   Whether to enable dynamic delay, will ignore type delay if the analyzer takes a long time.
 *                                      Applicable on slow devices.
 * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
 * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when dynamic delay is enabled.
 * @param {Object} args.callbacks The callbacks that the app requires.
 * @param {Object} args.assessor The Assessor to use instead of the default assessor.
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been determined by the analyzer.
 * @param {YoastSEO.App~saveContentScore} args.callback.saveContentScore Called when the content score has been
 *                                                                       determined by the assessor.
 * @param {YoastSEO.App~updatedContentResults} args.callbacks.updatedContentResults Called when the score has been determined
 *                                                                                  by the analyzer.
 * @param {YoastSEO.App~updatedKeywordsResults} args.callback.updatedKeywordsResults Called when the content score has been
 *                                                                                   determined by the assessor.
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 * @param {Function} args.marker The marker to use to apply the list of marks retrieved from an assessment.
 *
 * @param {SnippetPreview} args.snippetPreview The SnippetPreview object to be used.
 * @param {boolean} [args.debouncedRefresh] Whether or not to debounce the
 *                                          refresh function. Defaults to true.
 * @param {Researcher} args.researcher The Researcher object to be used.
 *
 * @constructor
 */
var App = function( args ) {
	if ( ! isObject( args ) ) {
		args = {};
	}

	defaultsDeep( args, defaults );

	verifyArguments( args );

	this.config = args;

	if ( args.debouncedRefresh === true ) {
		this.refresh = debounce( this.refresh.bind( this ), inputDebounceDelay );
	}
	this._pureRefresh = throttle( this._pureRefresh.bind( this ), this.config.typeDelay );

	this.callbacks = this.config.callbacks;

	setLocaleData( this.config.translations.locale_data[ "wordpress-seo" ], "wordpress-seo" );

	this.initializeAssessors( args );

	this.pluggable = new Pluggable( this );

	this.getData();

	this.defaultOutputElement = this.getDefaultOutputElement( args );

	if ( this.defaultOutputElement !== "" ) {
		this.showLoadingDialog();
	}

	if ( isValidSnippetPreview( args.snippetPreview ) ) {
		this.snippetPreview = args.snippetPreview;

		/* Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		app.*/
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
		}
	} else if ( args.hasSnippetPreview ) {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}

	this._assessorOptions = {
		useCornerStone: false,
		useKeywordDistribution: false,
	};

	this.initSnippetPreview();
	this.initAssessorPresenters();
};

/**
 * Returns the default output element based on which analyses are active.
 *
 * @param {Object} args The arguments passed to the App.
 * @returns {string} The ID of the target that is active.
 */
App.prototype.getDefaultOutputElement = function( args ) {
	if ( args.keywordAnalysisActive ) {
		return args.targets.output;
	}

	if ( args.contentAnalysisActive ) {
		return args.targets.contentOutput;
	}

	return "";
};

/**
 * Sets the assessors based on the assessor options and refreshes them.
 *
 * @param {Object} assessorOptions The specific options.
 * @returns {void}
 */
App.prototype.changeAssessorOptions = function( assessorOptions ) {
	this._assessorOptions = merge( this._assessorOptions, assessorOptions );

	// Set the assessors based on the new assessor options.
	this.seoAssessor = this.getSeoAssessor();
	this.contentAssessor = this.getContentAssessor();

	// Refresh everything so the user sees the changes.
	this.initAssessorPresenters();
	this.refresh();
};

/**
 * Returns an instance of the seo assessor to use.
 *
 * @returns {Assessor} The assessor instance.
 */
App.prototype.getSeoAssessor = function() {
	const { useCornerStone, useKeywordDistribution } = this._assessorOptions;

	const assessor = useCornerStone ? this.cornerStoneSeoAssessor : this.defaultSeoAssessor;
	if ( useKeywordDistribution && isUndefined( assessor.getAssessment( "keyphraseDistribution" ) ) ) {
		assessor.addAssessment( "keyphraseDistribution", keyphraseDistribution );
	}

	return assessor;
};

/**
 * Returns an instance of the content assessor to use.
 *
 * @returns {Assessor} The assessor instance.
 */
App.prototype.getContentAssessor = function() {
	const { useCornerStone } = this._assessorOptions;

	if ( useCornerStone ) {
		return this.cornerStoneContentAssessor;
	}

	return this.defaultContentAssessor;
};

/**
 * Initializes assessors based on if the respective analysis is active.
 *
 * @param {Object} args The arguments passed to the App.
 * @returns {void}
 */
App.prototype.initializeAssessors = function( args ) {
	this.initializeSEOAssessor( args );
	this.initializeContentAssessor( args );
};

/**
 * Initializes the SEO assessor.
 *
 * @param {Object} args The arguments passed to the App.
 * @returns {void}
 */
App.prototype.initializeSEOAssessor = function( args ) {
	if ( ! args.keywordAnalysisActive ) {
		return;
	}

	this.defaultSeoAssessor = new SEOAssessor( { marker: this.config.marker } );
	this.cornerStoneSeoAssessor = new CornerstoneSEOAssessor( { marker: this.config.marker } );

	// Set the assessor
	if ( isUndefined( args.seoAssessor ) ) {
		this.seoAssessor = this.defaultSeoAssessor;
	} else {
		this.seoAssessor = args.seoAssessor;
	}
};

/**
 * Initializes the content assessor.
 *
 * @param {Object} args The arguments passed to the App.
 * @returns {void}
 */
App.prototype.initializeContentAssessor = function( args ) {
	if ( ! args.contentAnalysisActive ) {
		return;
	}

	this.defaultContentAssessor = new ContentAssessor( { marker: this.config.marker, locale: this.config.locale }  );
	this.cornerStoneContentAssessor = new CornerstoneContentAssessor( { marker: this.config.marker, locale: this.config.locale } );

	// Set the content assessor
	if ( isUndefined( args._contentAssessor ) ) {
		this.contentAssessor = this.defaultContentAssessor;
	} else {
		this.contentAssessor = args._contentAssessor;
	}
};

/**
 * Extend the config with defaults.
 *
 * @param   {Object}    args    The arguments to be extended.
 * @returns {Object}    args    The extended arguments.
 */
App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.locale = args.locale || "en_US";

	return args;
};

/**
 * Extend sample text config with defaults.
 *
 * @param   {Object}    sampleText  The sample text to be extended.
 * @returns {Object}    sampleText  The extended sample text.
 */
App.prototype.extendSampleText = function( sampleText ) {
	var defaultSampleText = defaults.sampleText;

	if ( isUndefined( sampleText ) ) {
		return defaultSampleText;
	}

	for ( var key in sampleText ) {
		if ( isUndefined( sampleText[ key ] ) ) {
			sampleText[ key ] = defaultSampleText[ key ];
		}
	}

	return sampleText;
};

/**
 * Registers a custom data callback.
 *
 * @param {Function} callback The callback to register.
 *
 * @returns {void}
 */
App.prototype.registerCustomDataCallback = function( callback ) {
	if ( ! this.callbacks.custom ) {
		this.callbacks.custom = [];
	}

	if ( isFunction( callback ) ) {
		this.callbacks.custom.push( callback );
	}
};

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 *
 * @returns {void}
 */
App.prototype.getData = function() {
	this.rawData = this.callbacks.getData();

	// Add the custom data to the raw data.
	if ( isArray( this.callbacks.custom ) ) {
		this.callbacks.custom.forEach( ( customCallback ) => {
			const customData = customCallback();

			this.rawData = merge( this.rawData, customData );
		} );
	}

	if ( this.hasSnippetPreview() ) {
		// Gets the data FOR the analyzer
		var data = this.snippetPreview.getAnalyzerData();

		this.rawData.metaTitle = data.title;
		this.rawData.url = data.url;
		this.rawData.meta = data.metaDesc;
	}

	if ( this.pluggable.loaded ) {
		this.rawData.metaTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.metaTitle );
		this.rawData.meta = this.pluggable._applyModifications( "data_meta_desc", this.rawData.meta );
	}

	this.rawData.titleWidth = measureTextWidth( this.rawData.metaTitle );

	this.rawData.locale = this.config.locale;
};

/**
 * Refreshes the analyzer and output of the analyzer, is debounced for a better experience.
 *
 * @returns {void}
 */
App.prototype.refresh = function() {
	// Until all plugins are loaded, do not trigger a refresh.
	if ( ! this.pluggable.loaded ) {
		return;
	}

	this._pureRefresh();
};

/**
 * Refreshes the analyzer and output of the analyzer, is throttled to prevent performance issues.
 *
 * @returns {void}
 *
 * @private
 */
App.prototype._pureRefresh = function() {
	this.getData();
	this.runAnalyzer();
};

/**
 * Determines whether or not this app has a snippet preview.
 *
 * @returns {boolean} Whether or not this app has a snippet preview.
 */
App.prototype.hasSnippetPreview = function() {
	return this.snippetPreview !== null && ! isUndefined( this.snippetPreview );
};

/**
 * Initializes the snippet preview for this App.
 *
 * @returns {void}
 */
App.prototype.initSnippetPreview = function() {
	if ( this.hasSnippetPreview() ) {
		this.snippetPreview.renderTemplate();
		this.snippetPreview.callRegisteredEventBinder();
		this.snippetPreview.bindEvents();
		this.snippetPreview.init();
	}
};

/**
 * Initializes the assessorpresenters for content and SEO.
 *
 * @returns {void}
 */
App.prototype.initAssessorPresenters = function() {
	// Pass the assessor result through to the formatter
	if ( ! isUndefined( this.config.targets.output ) ) {
		this.seoAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.output,
			},
			assessor: this.seoAssessor,
		} );
	}

	if ( ! isUndefined( this.config.targets.contentOutput ) ) {
		// Pass the assessor result through to the formatter
		this.contentAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.contentOutput,
			},
			assessor: this.contentAssessor,
		} );
	}
};

/**
 * Binds the refresh function to the input of the targetElement on the page.
 *
 * @returns {void}
 */
App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.refresh.bind( this ) );
	}
};

/**
 * Runs the rerender function of the snippetPreview if that object is defined.
 *
 * @returns {void}
 */
App.prototype.reloadSnippetText = function() {
	if ( this.hasSnippetPreview() ) {
		this.snippetPreview.reRender();
	}
};

/**
 * Sets the startTime timestamp.
 *
 * @returns {void}
 */
App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * Sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 *
 * @returns {void}
 */
App.prototype.endTime = function() {
	this.endTimestamp = new Date().getTime();
	if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
		if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
			this.config.typeDelay += this.config.typeDelayStep;
		}
	}
};

/**
 * Inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter
 * to format outputs.
 *
 * @returns {void}
 */
App.prototype.runAnalyzer = function() {
	if ( this.pluggable.loaded === false ) {
		return;
	}

	if ( this.config.dynamicDelay ) {
		this.startTime();
	}

	this.analyzerData = this.modifyData( this.rawData );

	if ( this.hasSnippetPreview() ) {
		this.snippetPreview.refresh();
	}

	let text = this.analyzerData.text;

	// Insert HTML stripping code
	text = removeHtmlBlocks( text );

	let titleWidth = this.analyzerData.titleWidth;
	if ( this.hasSnippetPreview() ) {
		titleWidth = this.snippetPreview.getTitleWidth();
	}

	// Create a paper object for the Researcher
	this.paper = new Paper( text, {
		keyword: this.analyzerData.keyword,
		synonyms: this.analyzerData.synonyms,
		description: this.analyzerData.meta,
		slug: this.analyzerData.slug,
		title: this.analyzerData.metaTitle,
		titleWidth: titleWidth,
		locale: this.config.locale,
		permalink: this.analyzerData.permalink,
	} );

	this.config.researcher.setPaper( this.paper );

	this.runKeywordAnalysis();

	this.runContentAnalysis();

	this._renderAnalysisResults();

	if ( this.config.dynamicDelay ) {
		this.endTime();
	}

	if ( this.hasSnippetPreview() ) {
		this.snippetPreview.reRender();
	}
};

/**
 * Runs the keyword analysis and calls the appropriate callbacks.
 *
 * @returns {void}
 */
App.prototype.runKeywordAnalysis = function() {
	if ( this.config.keywordAnalysisActive ) {
		this.seoAssessor.assess( this.paper );
		const overallSeoScore = this.seoAssessor.calculateOverallScore();

		if ( ! isUndefined( this.callbacks.updatedKeywordsResults ) ) {
			this.callbacks.updatedKeywordsResults( this.seoAssessor.results, overallSeoScore );
		}

		if ( ! isUndefined( this.callbacks.saveScores ) ) {
			this.callbacks.saveScores( overallSeoScore, this.seoAssessorPresenter );
		}
	}
};

/**
 * Runs the content analysis and calls the appropriate callbacks.
 *
 * @returns {void}
 */
App.prototype.runContentAnalysis = function() {
	if ( this.config.contentAnalysisActive ) {
		this.contentAssessor.assess( this.paper );
		const overallContentScore = this.contentAssessor.calculateOverallScore();

		if ( ! isUndefined( this.callbacks.updatedContentResults ) ) {
			this.callbacks.updatedContentResults( this.contentAssessor.results, overallContentScore );
		}

		if ( ! isUndefined( this.callbacks.saveContentScore ) ) {
			this.callbacks.saveContentScore( overallContentScore, this.contentAssessorPresenter );
		}
	}
};

/**
 * Modifies the data with plugins before it is sent to the analyzer.
 *
 * @param   {Object}  data      The data to be modified.
 * @returns {Object}            The data with the applied modifications.
 */
App.prototype.modifyData = function( data ) {
	// Copy rawdata to lose object reference.
	data = JSON.parse( JSON.stringify( data ) );

	data.text      = this.pluggable._applyModifications( "content", data.text );
	data.metaTitle = this.pluggable._applyModifications( "title", data.metaTitle );

	return data;
};

/**
 * Function to fire the analyzer when all plugins are loaded, removes the loading dialog.
 *
 * @returns {void}
 */
App.prototype.pluginsLoaded = function() {
	this.removeLoadingDialog();
	this.refresh();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 *
 * @returns {void}
 */
App.prototype.showLoadingDialog = function() {
	var outputElement = document.getElementById( this.defaultOutputElement );

	if ( this.defaultOutputElement !== "" && ! isEmpty( outputElement ) ) {
		var dialogDiv = document.createElement( "div" );
		dialogDiv.className = "YoastSEO_msg";
		dialogDiv.id = "YoastSEO-plugin-loading";
		document.getElementById( this.defaultOutputElement ).appendChild( dialogDiv );
	}
};

/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading.
 *
 * @param   {Object}  plugins   The plugins to be parsed into the dialog.
 * @returns {void}
 */
App.prototype.updateLoadingDialog = function( plugins ) {
	var outputElement = document.getElementById( this.defaultOutputElement );

	if ( this.defaultOutputElement === "" || isEmpty( outputElement ) ) {
		return;
	}

	var dialog = document.getElementById( "YoastSEO-plugin-loading" );
	dialog.textContent = "";

	forEach( plugins, function( plugin, pluginName ) {
		dialog.innerHTML += "<span class=left>" + pluginName + "</span><span class=right " +
							plugin.status + ">" + plugin.status + "</span><br />";
	} );

	dialog.innerHTML += "<span class=bufferbar></span>";
};

/**
 * Removes the pluging load dialog.
 *
 * @returns {void}
 */
App.prototype.removeLoadingDialog = function() {
	var outputElement = document.getElementById( this.defaultOutputElement );
	var loadingDialog = document.getElementById( "YoastSEO-plugin-loading" );

	if ( ( this.defaultOutputElement !== "" && ! isEmpty( outputElement ) ) && ! isEmpty( loadingDialog ) ) {
		document.getElementById( this.defaultOutputElement ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
	}
};

// ***** PLUGGABLE PUBLIC DSL ***** //

/**
 * Delegates to `YoastSEO.app.pluggable.registerPlugin`
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options object.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not it was successfully registered.
 */
App.prototype.registerPlugin = function( pluginName, options ) {
	return this.pluggable._registerPlugin( pluginName, options );
};

/**
 * Delegates to `YoastSEO.app.pluggable.ready`
 *
 * @param {string}  pluginName  The name of the plugin to check.
 * @returns {boolean}           Whether or not the plugin is ready.
 */
App.prototype.pluginReady = function( pluginName ) {
	return this.pluggable._ready( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.reloaded`
 *
 * @param {string} pluginName   The name of the plugin to reload
 * @returns {boolean}           Whether or not the plugin was reloaded.
 */
App.prototype.pluginReloaded = function( pluginName ) {
	return this.pluggable._reloaded( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.registerModification`.
 *
 * @param {string}   modification   The name of the filter
 * @param {function} callable       The callable function
 * @param {string}   pluginName     The plugin that is registering the modification.
 * @param {number}   [priority]     Used to specify the order in which the callables associated with a particular filter are called.
 *                                  Lower numbers correspond with earlier execution.
 *
 * @returns {boolean} Whether or not the modification was successfully registered.
 */
App.prototype.registerModification = function( modification, callable, pluginName, priority ) {
	return this.pluggable._registerModification( modification, callable, pluginName, priority );
};

/**
 * Registers a custom assessment for use in the analyzer, this will result in a new line in the analyzer results.
 * The function needs to use the assessmentresult to return an result  based on the contents of the page/posts.
 *
 * Score 0 results in a grey circle if it is not explicitly set by using setscore
 * Scores 0, 1, 2, 3 and 4 result in a red circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a green circle
 *
 * @param {string} name Name of the test.
 * @param {function} assessment The assessment to run
 * @param {string}   pluginName The plugin that is registering the test.
 * @returns {boolean} Whether or not the test was successfully registered.
 */
App.prototype.registerAssessment = function( name, assessment, pluginName ) {
	if ( ! isUndefined( this.seoAssessor ) ) {
		return this.pluggable._registerAssessment( this.defaultSeoAssessor, name, assessment, pluginName ) &&
		this.pluggable._registerAssessment( this.cornerStoneSeoAssessor, name, assessment, pluginName );
	}
};

/**
 * Disables markers visually in the UI.
 *
 * @returns {void}
 */
App.prototype.disableMarkers = function() {
	if ( ! isUndefined( this.seoAssessorPresenter ) ) {
		this.seoAssessorPresenter.disableMarker();
	}

	if ( ! isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessorPresenter.disableMarker();
	}
};

/**
 * Renders the content and keyword analysis results.
 *
 * @returns {void}
 */
App.prototype._renderAnalysisResults = function() {
	if ( this.config.contentAnalysisActive && ! isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessorPresenter.renderIndividualRatings();
	}
	if ( this.config.keywordAnalysisActive && ! isUndefined( this.seoAssessorPresenter ) ) {
		this.seoAssessorPresenter.setKeyword( this.paper.getKeyword() );
		this.seoAssessorPresenter.render();
	}
};

// Deprecated functions
/**
 * The analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 *
 * @deprecated: 1.3 - Use this.refresh() instead.
 *
 * @returns {void}
 */
App.prototype.analyzeTimer = function() {
	this.refresh();
};

/**
 * Registers a custom test for use in the analyzer, this will result in a new line in the analyzer results. The function
 * has to return a result based on the contents of the page/posts.
 *
 * The scoring object is a special object with definitions about how to translate a result from your analysis function
 * to a SEO score.
 *
 * Negative scores result in a red circle
 * Scores 1, 2, 3, 4 and 5 result in a orange circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a red circle
 *
 * @returns {void}
 *
 * @deprecated since version 1.2
 */
App.prototype.registerTest = function() {
	console.error( "This function is deprecated, please use registerAssessment" );
};

/**
 * Creates the elements for the snippetPreview
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 *
 * @returns {void}
 */
App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Switches between the cornerstone and default assessors.
 *
 * @deprecated 1.35.0 - Use changeAssessorOption instead.
 *
 * @param {boolean} useCornerStone True when cornerstone should be used.
 *
 * @returns {void}
 */
App.prototype.switchAssessors = function( useCornerStone ) {
	// eslint-disable-next-line no-console
	console.warn( "Switch assessor is deprecated since YoastSEO.js version 1.35.0" );

	this.changeAssessorOptions( {
		useCornerStone,
	} );
};

export default App;
