(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var plugins = {
	usedKeywords: require( "./js/bundledPlugins/previouslyUsedKeywords" )
};

var helpers = {
	scoreToRating: require( "./js/interpreters/scoreToRating" )
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

	Paper: require( "./js/values/paper" ),
	AssessmentResult: require( "./js/values/AssessmentResult" ),

	bundledPlugins: plugins,
	helpers: helpers
};

},{"./js/app":2,"./js/assessor":37,"./js/bundledPlugins/previouslyUsedKeywords":38,"./js/contentAssessor":47,"./js/interpreters/scoreToRating":54,"./js/pluggable":57,"./js/researcher":59,"./js/seoAssessor":96,"./js/snippetPreview.js":97,"./js/values/AssessmentResult":131,"./js/values/paper":134}],2:[function(require,module,exports){
/* jshint browser: true */

require( "./config/config.js" );
var SnippetPreview = require( "./snippetPreview.js" );

var defaultsDeep = require( "lodash/defaultsDeep" );
var isObject = require( "lodash/isObject" );
var isString = require( "lodash/isString" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );

var Jed = require( "jed" );

var SEOAssessor = require( "./seoAssessor.js" );
var ContentAssessor = require( "./contentAssessor.js" );
var Researcher = require( "./researcher.js" );
var AssessorPresenter = require( "./renderers/AssessorPresenter.js" );
var Pluggable = require( "./pluggable.js" );
var Paper = require( "./values/Paper.js" );

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
var defaults = {
	callbacks: {
		bindElementEvents: function( ) { },
		updateSnippetValues: function( ) { },
		saveScores: function( ) { },
		saveContentScore: function( ) { }
	},
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "This is an example title - edit by clicking here",
		keyword: "Choose a focus keyword",
		meta: "Modify your meta description by editing it right here",
		text: "Start writing your text!"
	},
	queue: [ "wordCount",
		"keywordDensity",
		"subHeadings",
		"stopwords",
		"fleschReading",
		"linkCount",
		"imageCount",
		"urlKeyword",
		"urlLength",
		"metaDescription",
		"pageTitleKeyword",
		"pageTitleLength",
		"firstParagraph",
		"'keywordDoubles" ],
	typeDelay: 300,
	typeDelayStep: 100,
	maxTypeDelay: 1500,
	dynamicDelay: true,
	locale: "en_US",
	translations: {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	},
	replaceTarget: [],
	resetTarget: [],
	elementTarget: [],
	marker: function() {}
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
			saveSnippetData: this.config.callbacks.saveSnippetData
		}
	} );
}

/**
 * Returns whether or not the given argument is a valid SnippetPreview object.
 *
 * @param   {*}         snippetPreview  The 'object' to check against.
 * @returns {boolean}                   Whether or not it's a valid SnippetPreview object.
 */
function isValidSnippetPreview( snippetPreview ) {
	return !isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object}      args            The arguments object passed to the App.
 * @returns {void}
 */
function verifyArguments( args ) {

	if ( !isObject( args.callbacks.getData ) ) {
		throw new MissingArgument( "The app requires an object with a getdata callback." );
	}

	if ( !isObject( args.targets ) ) {
		throw new MissingArgument( "`targets` is a required App argument, `targets` is not an object." );
	}

	if ( !isString( args.targets.output ) ) {
		throw new MissingArgument( "`targets.output` is a required App argument, `targets.output` is not a string." );
	}

	// The args.targets.snippet argument is only required if not SnippetPreview object has been passed.
	if ( !isValidSnippetPreview( args.snippetPreview ) && !isString( args.targets.snippet ) ) {
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
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 *
 * @param {Object} args The arguments oassed to the loader.
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
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 * @param {Function} args.marker The marker to use to apply the list of marks retrieved from an assessment.
 *
 * @param {SnippetPreview} args.snippetPreview The SnippetPreview object to be used.
 *
 * @constructor
 */
var App = function( args ) {
	if ( !isObject( args ) ) {
		args = {};
	}

	defaultsDeep( args, defaults );

	verifyArguments( args );

	this.config = args;

	this.callbacks = this.config.callbacks;
	this.i18n = this.constructI18n( this.config.translations );

	// Set the assessor
	if ( isUndefined( args.seoAssessor ) ) {
		this.seoAssessor = new SEOAssessor( this.i18n, { marker: this.config.marker } );
	} else {
		this.seoAssessor = args.seoAssessor;
	}

	// Set the content assessor
	if ( isUndefined( args.contentAssessor ) ) {
		this.contentAssessor = new ContentAssessor( this.i18n, { marker: this.config.marker } );
	} else {
		this.contentAssessor = args.contentAssessor;
	}

	this.pluggable = new Pluggable( this );

	this.getData();
	this.showLoadingDialog();

	if ( isValidSnippetPreview( args.snippetPreview ) ) {
		this.snippetPreview = args.snippetPreview;

		/* Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		app.*/
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
			this.snippetPreview.i18n = this.i18n;
		}
	} else {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}
	this.initSnippetPreview();
	this.initAssessorPresenters();

	// Overwrite refresh function to make sure it can be debounced.
	this.refresh = debounce( this.refresh.bind( this ), this.config.typeDelay );

	this.refresh();
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
		sampleText = defaultSampleText;
	} else {
		for ( var key in sampleText ) {
			if ( isUndefined( sampleText[ key ] ) ) {
				sampleText[ key ] = defaultSampleText[ key ];
			}
		}
	}

	return sampleText;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object}  translations    The translations to be used in the current instance.
 * @returns {void}
 */
App.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};

	// Use default object to prevent Jed from erroring out.
	translations = translations || defaultTranslations;

	return new Jed( translations );
};

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 * @returns {void}
 */
App.prototype.getData = function() {
	this.rawData = this.callbacks.getData();

	if ( !isUndefined( this.snippetPreview ) ) {

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
	this.rawData.locale = this.config.locale;
};

/**
 * Refreshes the analyzer and output of the analyzer
 * @returns {void}
 */
App.prototype.refresh = function() {
	this.getData();
	this.runAnalyzer();
};

/**
 * Creates the elements for the snippetPreview
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 * @returns {void}
 */
App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Initializes the snippet preview for this App.
 * @returns {void}
 */
App.prototype.initSnippetPreview = function() {
	this.snippetPreview.renderTemplate();
	this.snippetPreview.callRegisteredEventBinder();
	this.snippetPreview.bindEvents();
	this.snippetPreview.init();
};

/**
 * Initializes the assessorpresenters for content and SEO.
 */
App.prototype.initAssessorPresenters = function() {

	// Pass the assessor result through to the formatter
	this.seoAssessorPresenter = new AssessorPresenter( {
		targets: {
			output: this.config.targets.output
		},
		assessor: this.seoAssessor,
		i18n: this.i18n
	} );

	if ( !isUndefined( this.config.targets.contentOutput ) ) {
		// Pass the assessor result through to the formatter
		this.contentAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.contentOutput
			},
			assessor: this.contentAssessor,
			i18n: this.i18n
		} );
	}
};

/**
 * Binds the refresh function to the input of the targetElement on the page.
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
 * @returns {void}
 */
App.prototype.reloadSnippetText = function() {
	if ( isUndefined( this.snippetPreview ) ) {
		this.snippetPreview.reRender();
	}
};

/**
 * Sets the startTime timestamp
 * @returns {void}
 */
App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * Sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
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

	// Create a paper object for the Researcher
	this.paper = new Paper( this.analyzerData.text, {
		keyword:  this.analyzerData.keyword,
		description: this.analyzerData.meta,
		url: this.analyzerData.url,
		title: this.analyzerData.metaTitle,
		locale: this.config.locale
	} );

	// The new researcher
	if ( isUndefined( this.researcher ) ) {
		this.researcher = new Researcher( this.paper );
	} else {
		this.researcher.setPaper( this.paper );
	}

	this.seoAssessor.assess( this.paper );
	this.contentAssessor.assess( this.paper );

	this.seoAssessorPresenter.setKeyword( this.paper.getKeyword() );
	this.seoAssessorPresenter.render();
	this.callbacks.saveScores( this.seoAssessor.calculateOverallScore(), this.seoAssessorPresenter );

	if ( !isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessorPresenter.renderIndividualRatings();
		this.callbacks.saveContentScore( this.contentAssessor.calculateOverallScore(), this.contentAssessorPresenter );
	}

	if ( this.config.dynamicDelay ) {
		this.endTime();
	}

	this.snippetPreview.reRender();
};

/**
 * Modifies the data with plugins before it is sent to the analyzer.
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
 * @returns {void}
 */
App.prototype.pluginsLoaded = function() {
	this.getData();
	this.removeLoadingDialog();
	this.runAnalyzer();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 * @returns {void}
 */
App.prototype.showLoadingDialog = function() {
	var dialogDiv = document.createElement( "div" );
	dialogDiv.className = "YoastSEO_msg";
	dialogDiv.id = "YoastSEO-plugin-loading";
	document.getElementById( this.config.targets.output ).appendChild( dialogDiv );
};

/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading
 * @param   {Object}  plugins   The plugins to be parsed into the dialog.
 * @returns {void}
 */
App.prototype.updateLoadingDialog = function( plugins ) {
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
 * @returns {void}
 */
App.prototype.removeLoadingDialog = function() {
	document.getElementById( this.config.targets.output ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
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
 * Delegates to `YoastSEO.app.pluggable.registerModification`
 *
 * @param {string}      modification 		The name of the filter
 * @param {function}    callable 		 	The callable function
 * @param {string}      pluginName 		    The plugin that is registering the modification.
 * @param {number}      priority 		 	(optional) Used to specify the order in which the callables associated with a particular filter are
                                            called.
 * 									        Lower numbers correspond with earlier execution.
 * @returns 			{boolean}           Whether or not the modification was successfully registered.
 */
App.prototype.registerModification = function( modification, callable, pluginName, priority ) {
	return this.pluggable._registerModification( modification, callable, pluginName, priority );
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
 * @deprecated since version 1.2
 */
App.prototype.registerTest = function() {
	console.error( "This function is deprecated, please use registerAssessment" );
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
	return this.pluggable._registerAssessment( this.seoAssessor, name, assessment, pluginName );
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

module.exports = App;

},{"./config/config.js":39,"./contentAssessor.js":47,"./errors/missingArgument":49,"./pluggable.js":57,"./renderers/AssessorPresenter.js":58,"./researcher.js":59,"./seoAssessor.js":96,"./snippetPreview.js":97,"./values/Paper.js":133,"jed":135,"lodash/debounce":287,"lodash/defaultsDeep":289,"lodash/forEach":295,"lodash/isObject":311,"lodash/isString":314,"lodash/isUndefined":317}],3:[function(require,module,exports){
var filter = require( "lodash/filter" );
var isSentenceTooLong = require( "../helpers/isValueTooLong" );

/**
 * Checks for too long sentences.
 * @param {array} sentences The array containing sentence lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {array} Array of too long sentences.
 */
module.exports = function( sentences, recommendedValue ) {
	var tooLongSentences = filter( sentences, function( sentence ) {
		return isSentenceTooLong( recommendedValue, sentence.sentenceLength );
	} );

	return tooLongSentences;
};

},{"../helpers/isValueTooLong":52,"lodash/filter":292}],4:[function(require,module,exports){
/**
 * Calculates the score based on the percentage of too long sentences.
 * @param {number} percentage The percentage of too long sentences
 * @returns {number} The score
 */
module.exports = function( percentage ) {

	// Scale percentages from 21.7 to 31.7 to a score. 21.7 scores 9, 31.7 score 3.
	// We use 10 steps (between 9 and 3), so each step is 0.6
	var unboundedScore = 9 - ( 0.6 ) * ( percentage - 21.7 );

	// Scores exceeding 9 are 9, scores below 3 are 3.
	return Math.max( Math.min( unboundedScore, 9 ), 3 );
};

},{}],5:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculates the assessment result based on the fleschReadingScore
 * @param {int} fleschReadingScore The score from the fleschReadingtest
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} object with score, resultText and note
 */
var calculateFleschReadingResult = function( fleschReadingScore, i18n ) {
	if ( fleschReadingScore > 90 ) {
		return {
			score: 9,
			resultText: i18n.dgettext( "js-text-analysis", "very easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 80, 90 ) ) {
		return {
			score: 9,
			resultText:  i18n.dgettext( "js-text-analysis", "easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 70, 80 ) ) {
		return {
			score: 8,
			resultText: i18n.dgettext( "js-text-analysis", "fairly easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 60, 70 ) ) {
		return {
			score: 8,
			resultText: i18n.dgettext( "js-text-analysis", "ok" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 50, 60 ) ) {
		return {
			score: 6,
			resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
		};
	}

	if ( inRange( fleschReadingScore, 30, 50 ) ) {
		return {
			score: 5,
			resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		};
	}

	if ( fleschReadingScore < 30 ) {
		return {
			score: 4,
			resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		};
	}
};

/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {object} paper The paper to run this assessment on
 * @param {object} researcher The researcher used for the assessment
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} an assessmentresult with the score and formatted text.
 */
var fleschReadingEaseAssessment = function( paper, researcher, i18n ) {
	var fleschReadingScore = researcher.getResearch( "calculateFleschReading" );

	/* translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
	 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
	var text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
	var url = "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>";

	// scores must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}
	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	var fleschReadingResult = calculateFleschReadingResult( fleschReadingScore, i18n );

	text = i18n.sprintf( text, fleschReadingScore, url, fleschReadingResult.resultText, fleschReadingResult.note );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( fleschReadingResult.score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = {
	identifier: "fleschReadingEase",
	getResult: fleschReadingEaseAssessment,
	isApplicable: function( paper ) {
		return ( paper.getLocale().indexOf( "en_" ) > -1 );
	}
};

},{"../values/AssessmentResult.js":131,"lodash/inRange":299}],6:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" ).getSubheadings;
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

/**
 * Calculates the result based on the score from the researcher.
 * @param {number} score The lowest score of the subheadings.
 * @param {number} tooLongHeaders The number of subheadings that are too long.
 * @param {number} recommendedValue The recommended maximum length for subheadings.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with text and score.
 */
var subheadingsLengthScore = function( score, tooLongHeaders, recommendedValue, i18n ) {
	if ( score === 0 ) {
		return {};
	}

	if( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$d expands to the recommended maximum number of characters.
					"The length of all subheadings is less than the recommended maximum of %1$d characters, which is great."
				), recommendedValue
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				// translators: %1$d expands to the number of subheadings. %2$d expands to the recommended maximum number of characters.
				"You have %1$d subheading containing more than the recommended maximum of %2$d characters.",
				"You have %1$d subheadings containing more than the recommended maximum of %2$d characters.",
				tooLongHeaders
			), tooLongHeaders, recommendedValue
		)
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingLength = function( paper, researcher, i18n ) {
	var subheadingsLength = researcher.getResearch( "getSubheadingLength" );
	var recommendedValue = 30;
	var tooLong = 0;
	var scores = [];
	var lowestScore = 0;

	if ( subheadingsLength.length > 0 ) {
		forEach( subheadingsLength, function( length ) {
			if( length > recommendedValue ) {
				tooLong++;
			}

			// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 20 steps, each step is 0.3.
			// Up to 23.4  is for scoring a 9, higher numbers give lower scores.
			scores.push( 9 - Math.max( Math.min( ( 0.3 ) * ( length - 23.4 ), 6 ), 0 ) );
		} );

		lowestScore = scores.sort(
			function( a, b ) {
				return a - b;
			}
		)[ 0 ];
	}

	// floatingPointFix because of js rounding errors
	lowestScore = fixFloatingPoint( lowestScore );

	var subheadingsLengthResult = subheadingsLengthScore( lowestScore, tooLong, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );

	return assessmentResult;
};

/**
 * Marks text for the subheading length assessment
 *
 * @param {Paper} paper The paper that should be marked.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
function subheadingLengthMarker( paper ) {
	var subheadings = getSubheadings( paper.getText() );

	var lengthySubheadings = filter( subheadings, function( subheading ) {
		return subheading[ 2 ].length > 30;
	} );

	return map( lengthySubheadings, function( subheading ) {
		var innerText = subheading[ 2 ];
		var outerText = subheading[ 0 ];

		var marked = outerText.replace( innerText, marker( innerText ) );

		return new Mark( {
			original: outerText,
			marked: marked
		} );
	} );
}

module.exports = {
	identifier: "textSubheadingLength",
	getResult: getSubheadingLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingLengthMarker
};

},{"../helpers/fixFloatingPoint.js":51,"../markers/addMark.js":56,"../stringProcessing/getSubheadings.js":112,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/filter":292,"lodash/forEach":295,"lodash/map":320}],7:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the firstParagraph object.
 *
 * @param {object} firstParagraphMatches The object with all firstParagraphMatches.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateFirstParagraphResult = function( firstParagraphMatches, i18n ) {
	if ( firstParagraphMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the first paragraph of the copy." )
		};
	}

	return {
		score: 3,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword doesn\'t appear in the first paragraph of the copy. " +
			"Make sure the topic is clear immediately." )
	};
};

/**
 * Runs the findKeywordInFirstParagraph module, based on this returns an assessment result with score.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var introductionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var firstParagraphMatches = researcher.getResearch( "firstParagraph" );
	var firstParagraphResult = calculateFirstParagraphResult( firstParagraphMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( firstParagraphResult.score );
	assessmentResult.setText( firstParagraphResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "introductionKeyword",
	getResult: introductionHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":131}],8:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Assesses the keyphrase presence and length
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {Jed} i18n The object used for translations
 * @returns {AssessmentResult} The result of this assessment
*/
function keyphraseAssessment( paper, researcher, i18n ) {
	var keyphraseLength = researcher.getResearch( "keyphraseLength" );

	var assessmentResult = new AssessmentResult();

	if ( !paper.hasKeyword() ) {
		assessmentResult.setScore( -999 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "No focus keyword was set for this page. " +
			"If you do not set a focus keyword, no score can be calculated." ) );
	} else if ( keyphraseLength > 10 ) {
		assessmentResult.setScore( 0 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "Your keyphrase is over 10 words, a keyphrase should be shorter." ) );
	}

	return assessmentResult;
}

module.exports = {
	identifier: "keyphraseLength",
	getResult: keyphraseAssessment
};

},{"../values/AssessmentResult.js":131}],9:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var inRange = require( "lodash/inRange" );

/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;

	var keywordDensityPercentage = keywordDensity.toFixed( 1 ) + "%";

	if ( keywordDensity > 3.5 ) {
		score = -50;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is great;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	if ( inRange( keywordDensity, 0, 0.5 ) ) {
		score = 4;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is a bit low;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	return {
		score: score,
		text: text
	};
};

/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var keywordDensityAssessment = function( paper, researcher, i18n ) {

	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = matchWords( paper.getText(), paper.getKeyword() );

	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordDensity",
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	}
};

},{"../stringProcessing/countWords.js":103,"../stringProcessing/matchTextWithWord.js":117,"../values/AssessmentResult.js":131,"lodash/inRange":299}],10:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on the amount of stop words in the keyword.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
				"Your focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				"Your focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				stopWordCount
			)
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var keywordHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInKeyword" );
	var stopWordsResult = calculateStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		"<a href='https://yoast.com/handling-stopwords/' target='new'>",
		"</a>",
		stopWords.length
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":131}],11:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score and text for the description keyword match.
 * @param {number} keywordMatches The number of keyword matches in the description.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateKeywordMatchesResult = function( keywordMatches, i18n ) {
	if ( keywordMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The meta description contains the focus keyword." )
		};
	}
	if ( keywordMatches === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword." )
		};
	}
	return {};
};

/**
 * Runs the metaDescription keyword module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "metaDescriptionKeyword" );
	var descriptionLengthResult = calculateKeywordMatchesResult( keywordMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionKeyword",
	getResult: metaDescriptionHasKeywordAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":131}],12:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score and text for the descriptionLength
 * @param {number} descriptionLength The length of the metadescription.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateDescriptionLengthResult = function( descriptionLength, i18n ) {
	var recommendedValue = 120;
	var maximumValue = 156;
	if ( descriptionLength === 0 ) {
		return {
			score: 1,
			text: i18n.dgettext( "js-text-analysis", "No meta description has been specified, " +
				"search engines will display copy from the page instead." )
		};
	}
	if ( descriptionLength <= recommendedValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters, " +
				"however up to %2$d characters are available." ), recommendedValue, maximumValue )
		};
	}
	if ( descriptionLength > maximumValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The specified meta description is over %1$d characters. " +
				"Reducing it will ensure the entire description is visible." ), maximumValue )
		};
	}
	if ( descriptionLength >= recommendedValue && descriptionLength <= maximumValue ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "In the specified meta description, consider: " +
				"How does it compare to the competition? Could it be made more appealing?" )
		};
	}
};

/**
 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionLengthAssessment = function( paper, researcher, i18n ) {
	var descriptionLength = researcher.getResearch( "metaDescriptionLength" );
	var descriptionLengthResult = calculateDescriptionLengthResult( descriptionLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionLength",
	getResult: metaDescriptionLengthAssessment
};

},{"../values/AssessmentResult.js":131}],13:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var isParagraphTooLong = require( "../helpers/isValueTooLong" );
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

// 150 is the recommendedValue for the maximum paragraph length.
var recommendedValue = 150;

/**
 * Returns an array containing only the paragraphs longer than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too long paragraphs.
 */
var getTooLongParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooLong( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 100 steps, each step is 0.06.
	// Up to 117 is for scoring a 9, higher numbers give lower scores.
	// FloatingPointFix because of js rounding errors.
	var score = 9 - Math.max( Math.min( ( 0.06 ) * ( paragraphsLength[ 0 ].wordCount - 117 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too long, which is great." )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains more than the recommended maximum " +
			"of %2$d words. Are you sure all information is about the same topic, and therefore belongs in one single paragraph?",
			"%1$d of the paragraphs contain more than the recommended maximum of %2$d words. Are you sure all information within each of" +
			" these paragraphs is about the same topic, and therefore belongs in a single paragraph?", tooLongParagraphs.length ),
			tooLongParagraphs.length, recommendedValue )
	};
};

/**
 * Sort the paragraphs based on word count.
 *
 * @param {Array} paragraphs The array with paragraphs.
 * @returns {Array} The array sorted on word counts.
 */
var sortParagraphs = function( paragraphs ) {
	return paragraphs.sort(
		function( a, b ) {
			return b.wordCount - a.wordCount;
		}
	);
};

/**
 * Creates a marker for the paragraphs.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} An array with marked paragraphs.
 */
var paragraphLengthMarker = function( paper, researcher ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	return map( tooLongParagraphs, function( paragraph ) {
		var marked = marker( paragraph.paragraph );
		return new Mark( {
			original: paragraph.paragraph,
			marked: marked
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );

	paragraphsLength = sortParagraphs( paragraphsLength );

	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooLongParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textParagraphTooLong",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: paragraphLengthMarker
};

},{"../helpers/fixFloatingPoint.js":51,"../helpers/isValueTooLong":52,"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/filter":292,"lodash/map":320}],14:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var isParagraphTooShort = require( "../helpers/isValueTooShort" );
var filter = require( "lodash/filter" );

// 40 is the recommendedValue for the minimum paragraph length.
var recommendedValue = 40;

/**
 * Returns an array containing only the paragraphs shorter than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too short paragraphs.
 */
var getTooShortParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooShort( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooShortAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooShortParagraphs The number of too short paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooShortParagraphs, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15
	// Up to 13 is for scoring a 3, higher numbers give higher scores.
	// FloatingPointFix because of js rounding errors.
	var score = 3 + Math.max( Math.min( ( 0.15 ) * ( paragraphsLength[ 0 ].wordCount - 13 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too short, which is great." )
		};
	}
	return {
		score: score,

		// Translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value.
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains less than the recommended minimum " +
				"of %2$d words. Try to expand this paragraph, or connect it to the previous or next paragraph.",
				"%1$d of the paragraphs contain less than the recommended minimum of %2$d words.  Try to expand these paragraphs, " +
				"or connect each of them to the previous or next paragraph.", tooShortParagraphs.length ),
			tooShortParagraphs.length, recommendedValue )
	};
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	paragraphsLength = paragraphsLength.sort(
		function( a, b ) {
			return a.wordCount - b.wordCount;
		}
	);
	var tooShortParagraphs = getTooShortParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooShortParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textParagraphTooShort",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../helpers/fixFloatingPoint.js":51,"../helpers/isValueTooShort":53,"../values/AssessmentResult.js":131,"lodash/filter":292}],15:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var percentage = ( passiveVoice.passives.length / passiveVoice.total ) * 100;
	percentage = fixFloatingPoint( percentage );
	var recommendedValue = 10;

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps, each step is 0.6
	// Up to 6.7% passive sentences scores a 9, higher percentages give lower scores.
	// FloatingPointFix because of js rounding errors
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

						// Translators: %1$d expands to the number of sentences in passive voice.
						"%1$s of the sentences is written in the passive voice, which is within the recommended range." ),
					percentage + "%"
			)
		};
	}
	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",

				// Translators: %1$d expands to the number of sentences in passive voice, %2$d expands to the recommended value
				"%1$s of the sentences is written in the passive voice, which is more than the recommended maximum of %2$s. " +
				"Try to use their active counterparts."
			),
			percentage + "%",
			recommendedValue + "%"
		)
	};
};

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
var passiveVoiceMarker = function( paper, researcher ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );
	return map( passiveVoice.passives, function( sentence ) {
		var marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "passiveVoice",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: passiveVoiceMarker
};

},{"../helpers/fixFloatingPoint.js":51,"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/map":320}],16:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var partition = require ( "lodash/partition" );
var sortBy = require ( "lodash/sortBy" );

/**
 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
 * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
var groupSentenceBeginnings = function( sentenceBeginnings ) {
	var maximumConsecutiveDuplicates = 2;

	var tooOften = partition( sentenceBeginnings, function ( word ) {
		return word.count > maximumConsecutiveDuplicates;
	} );
	if ( tooOften[ 0 ].length === 0 ) {
		return { total: 0 };
	}
	var sortedCounts = sortBy( tooOften[ 0 ], function( word ) {
		return word.count;
	} );
	return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
};

var calculateSentenceBeginningsResult = function( groupedSentenceBeginnings, i18n ) {
	if ( groupedSentenceBeginnings.total > 0 ) {
		return {
			score: 3,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",

					// translators: %1$d expands to the number of instances where 3 or more consecutive sentences start
					// with the same word.
					// %2$d expands to the number of consecutive sentences starting with the same word.
					"Your text contains %2$d consecutive sentences starting with the same word. Try to mix things up!",
					"Your text contains %1$d instances where %2$d or more consecutive sentences start with the same word. " +
					"Try to mix things up!",
					groupedSentenceBeginnings.total
				),
				groupedSentenceBeginnings.total, groupedSentenceBeginnings.lowestCount )
		};
	}
	return {};
};

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	var groupedSentenceBeginnings = groupSentenceBeginnings( sentenceBeginnings );
	var sentenceBeginningsResult = calculateSentenceBeginningsResult ( groupedSentenceBeginnings, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceBeginningsResult.score );
	assessmentResult.setText( sentenceBeginningsResult.text );
	return assessmentResult;
};

module.exports = {
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};


},{"../values/AssessmentResult.js":131,"lodash/partition":325,"lodash/sortBy":329}],17:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );

/**
 * Calculates sentence length score
 * @param {array} sentences The array containing sentences.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var recommendedValue = 20;
	var tooLong = countTooLongSentences( sentences, recommendedValue ).length;
	var percentage = ( tooLong / sentences.length ) * 100;

	var score = calculateTooLongSentences( percentage );

	if ( score >= 7 ) {
		return {
			score: score,
			text:  i18n.dgettext( "js-text-analysis", "The meta description contains no sentences over 20 words." )
		};
	}
	return {
		score: score,
		text: i18n.sprintf( i18n.dngettext(
			"js-text-analysis",
			// translators: %1$d expands to number of sentences
			"The meta description contains %1$d sentence over 20 words. Try to shorten this sentence.",
			"The meta description contains %1$d sentences over 20 words. Try to shorten these sentences.",
			tooLong ), tooLong
		)
	};
};
/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInDescriptionAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromDescription" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionSentenceLength",
	getResult: sentenceLengthInDescriptionAssessment,
	isApplicable: function( paper ) {
		return paper.hasDescription();
	}
};

},{"../values/AssessmentResult.js":131,"./../assessmentHelpers/checkForTooLongSentences.js":3,"./../assessmentHelpers/sentenceLengthPercentageScore.js":4}],18:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );


var map = require( "lodash/map" );

var recommendedValue = 20;
var maximumPercentage = 25;

/**
 * Gets the sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Array} Array with all the sentences considered to be too long.
 */
var tooLongSentences = function( sentences, recommendedValue ) {
	return countTooLongSentences( sentences, recommendedValue );
};

/**
 * Get the total amount of sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Number} The amount of sentences that are considered too long.
 */
var tooLongSentencesTotal = function( sentences, recommendedValue ) {
	return tooLongSentences( sentences, recommendedValue ).length;
};

/**
 * Calculates sentence length score.
 *
 * @param {Object} sentences The object containing sentences and its length.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );
	var percentage = fixFloatingPoint( ( tooLongTotal / sentences.length ) * 100 );
	var score = calculateTooLongSentences( percentage );

	if ( score >= 7 ) {
		return {
			score: score,

			// Translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
			// %3$s expands to the recommended amount of words.
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than %3$d words, " +
				"which is less than the recommended maximum of %2$s." ), percentage + "%", maximumPercentage + "%", recommendedValue )
		};
	}

	return {
		score: score,

		// Translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
		// %3$s expands to the recommended amount of words.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than %3$d words, " +
			"which is more than the recommended maximum of %2$s. Try to shorten your sentences." ),
			percentage + "%", maximumPercentage + "%", recommendedValue )
	};
};

/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInTextAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

/**
 * Mark the sentences.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked sentences.
 */
var sentenceLengthMarker = function( paper, researcher ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceObjects = tooLongSentences( sentenceCount, recommendedValue );

	return map( sentenceObjects, function( sentenceObject ) {
		return new Mark( {
			original: sentenceObject.sentence,
			marked: addMark( sentenceObject.sentence )
		} );
	} );
};

module.exports = {
	identifier: "textSentenceLength",
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: sentenceLengthMarker
};

},{"../helpers/fixFloatingPoint.js":51,"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"./../assessmentHelpers/checkForTooLongSentences.js":3,"./../assessmentHelpers/sentenceLengthPercentageScore.js":4,"lodash/map":320}],19:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculates the score based on the given deviation.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @returns {number} The calculated score.
 */
var calculateScore = function( standardDeviation ) {
	return 3 + Math.max( Math.min( ( 6 ) * ( standardDeviation - 2.33 ), 6 ), 0 );
};

/**
 * Get the result based on the score. When score is 7 or more, the result is good. Below 7 should be improved.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: *}} The calculated result.
 */
var getStandardDeviationResult = function( standardDeviation, i18n ) {
	var score = calculateScore( standardDeviation );
	var recommendedMinimumDeviation = 3;
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$s expands to the calculated score. %2$d expands to the recommended minimum score
					"The sentence variation score is %1$s, which is above the recommended minimum of %2$d. The text " +
					"contains a nice combination of long and short sentences."
				), standardDeviation, recommendedMinimumDeviation
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// translators: %1$s expands to the calculated score. %2$d expands to the recommended minimum score
				"The sentence variation score is %1$s, which is less than the recommended minimum of %2$d. Try to " +
				"alternate more between long and short sentences."
			), standardDeviation, recommendedMinimumDeviation
		)
	};
};

/**
 * Runs the sentenceVariation research and checks scores based on calculated deviation.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSentenceVariation = function( paper, researcher, i18n ) {
	var standardDeviation = researcher.getResearch( "sentenceVariation" );
	var sentenceDeviationResult =  getStandardDeviationResult( standardDeviation, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceDeviationResult.score );
	assessmentResult.setText( sentenceDeviationResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textSentenceLengthVariation",
	getResult: getSentenceVariation,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};


},{"../values/AssessmentResult.js":131}],20:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooLong = require( "../helpers/isValueTooLong" );
var filter = require( "lodash/filter" );

/**
 * Counts the number of subheading texts that are too long.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} recommendedValue The recommended maximum value of the subheading text length
 * @returns {number} The number of subheading texts that are too long.
 */
var getTooLongSubheadingTexts = function( subheadingTextsLength, recommendedValue ) {
	var tooLongTexts = filter( subheadingTextsLength, isTextTooLong.bind( null, recommendedValue ) );
	return tooLongTexts.length;
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {number} recommendedValue The recommended maximum value of the subheading text length
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooLongTexts, recommendedValue, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 100 steps, each step is 0.06.
	// Up to 267  is for scoring a 9, higher numbers give lower scores.
	var score = 9 - Math.max( Math.min( ( 0.06 ) * ( subheadingTextsLength[ 0 ] - 267 ), 6 ), 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"The amount of words following after each of your subheadings don't exceed the recommended maximum of %1$d words, which is great."
				), recommendedValue )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.",
				"%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.",
				tooLongTexts ),
			tooLongTexts, recommendedValue
		)
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return b - a;
		}
	);
	var recommendedValue = 300;
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength, recommendedValue );
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooLongTexts, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsTooLong",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../helpers/isValueTooLong":52,"../values/AssessmentResult.js":131,"lodash/filter":292}],21:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooShort = require( "../helpers/isValueTooShort" );
var filter = require( "lodash/filter" );

/**
 * Counts the number of subheading texts that are too short.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @returns {number} The number of subheading texts that are too short.
 */
var getTooShortSubheadingTexts = function( subheadingTextsLength, recommendedValue ) {
	var tooShortTexts = filter( subheadingTextsLength, isTextTooShort.bind( null, recommendedValue ) );
	return tooShortTexts.length;
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooShortTexts The number of subheading texts that are too long.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooShortTexts, recommendedValue, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15.
	// Up to 267  is for scoring a 9, higher numbers give lower scores.
	var score = 3 + Math.max( Math.min( ( 6 / 40 ) * ( subheadingTextsLength[ 0 ] - 13 ), 6 ), 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
			i18n.dgettext(
					"js-text-analysis",
					"The amount of words following after each of your subheadings all exceed the recommended minimum of %1$d words, which is great."
			), recommendedValue )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
		i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by less than the recommended minimum of %2$d words. " +
				"Consider deleting that particular subheading, or the following subheading.",
				"%1$d of the subheadings are followed by less than the recommended minimum of %2$d words. " +
				"Consider deleting those particular subheadings, or the subheading following each of them.",
				tooShortTexts ),
			tooShortTexts, recommendedValue
		)
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return a - b;
		}
	);
	var recommendedValue = 40;
	var tooShortTexts = getTooShortSubheadingTexts( subheadingTextsLength, recommendedValue );
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooShortTexts, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );
	return assessmentResult;
};

module.exports = {
	identifier: "subheadingTooShort",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../helpers/isValueTooShort":53,"../values/AssessmentResult.js":131,"lodash/filter":292}],22:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score based on the number of subheadings found.
 * @param {number} subheadingPresence The number of subheadings found.
 * @param {object} i18n The object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateSubheadingPresenceResult = function( subheadingPresence, i18n ) {
	if( subheadingPresence > 0 ) {
		return {
			score: 9,

			// translators: %1$d expands to the number of subheadings
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					"The text contains %1$d subheading, which is great.",
					"The text contains %1$d subheadings, which is great.",
					subheadingPresence
				), subheadingPresence
			)
		};
	}

	return {
		score: 3,
		text: i18n.dgettext( "js-text-analysis", "The text does not contain any subheadings. Add at least one subheading." )
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingPresence = function( paper, researcher, i18n ) {
	var subheadingPresence = researcher.getResearch( "getSubheadingPresence" );
	var result = calculateSubheadingPresenceResult( subheadingPresence, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( result.score );
	assessmentResult.setText( result.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingPresence",
	getResult: getSubheadingPresence,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":131}],23:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the keyword matches object.
 *
 * @param {object} subHeadings The object with all subHeadings matches.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with score and text.
 */
var calculateKeywordMatchesResult = function( subHeadings, i18n ) {
	if ( subHeadings.matches === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "You have not used your focus keyword in any subheading (such as an H2) in your copy." )
		};
	}
	if ( subHeadings.matches >= 1 ) {
		return {
			score: 9,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. " +
				"While not a major ranking factor, this is beneficial." ), subHeadings.count, subHeadings.matches )
		};
	}
	return {};
};

/**
 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var subheadingsHaveKeywordAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateKeywordMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsKeyword",
	getResult: subheadingsHaveKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":131}],24:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount > 150 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, this is more than the %2$d word recommended minimum.",
				"The text contains %1$d words, this is more than the %2$d word recommended minimum.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				"The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 100, 125 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 50, 100 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 0, 50 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word, this is far too low and should be increased.",
				"The text contains %1$d words, this is far too low and should be increased.",
				wordCount
			)
		};
	}
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var taxonomyTextLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, 150 ) );

	return assessmentResult;
};

module.exports = {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment
};

},{"../values/AssessmentResult.js":131,"lodash/inRange":299}],25:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Returns a score and text based on the number of links.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkCountResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.keyword.totalKeyword > 0 ) {
		return {
			score: 2,
			text: i18n.dgettext( "js-text-analysis", "You\'re linking to another page with the focus keyword you want this page to rank for. " +
				"Consider changing that if you truly want this page to rank." )
		};
	}
	return {};
};

/**
 * Runs the linkCount module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasCompetingLinksAssessment = function( paper, researcher, i18n ) {
	var linkCount = researcher.getResearch( "getLinkStatistics" );

	var linkCountResult = calculateLinkCountResult( linkCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( linkCountResult.score );
	assessmentResult.setText( linkCountResult.text );

	return assessmentResult;
};

/**
 * Mark the anchors.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked anchors.
 */
var competingLinkMarker = function( paper, researcher ) {
	var competingLinks = researcher.getResearch( "getLinkStatistics" );

	return map( competingLinks.keyword.matchedAnchors, function( matchedAnchor ) {
		return new Mark( {
			original: matchedAnchor,
			marked: addMark( matchedAnchor )
		} );
	} );
};

module.exports = {
	identifier: "textCompetingLinks",
	getResult: textHasCompetingLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText() && paper.hasKeyword();
	},
	getMarks: competingLinkMarker
};

},{"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/map":320}],26:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Calculate the score based on the current image count.
 * @param {number} imageCount The amount of images to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateImageCountResult = function( imageCount, i18n ) {
	if ( imageCount === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "No images appear in this page, consider adding some as appropriate." )
		};
	}

	return {};
};

/**
 * Calculate the score based on the current image alt-tag count.
 * @param {object} altProperties An object containing the various alt-tags.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var assessImages = function( altProperties, i18n ) {
	// Has alt-tag and keywords
	if ( altProperties.withAltKeyword > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes with the focus keyword." )
		};
	}

	// Has alt-tag, but no keywords and it's not okay
	if ( altProperties.withAltNonKeyword > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt attributes containing your focus keyword." )
		};
	}

	// Has alt-tag, but no keyword is set
	if ( altProperties.withAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes." )
		};
	}

	// Has no alt-tag
	if ( altProperties.noAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt attributes." )
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var textHasImagesAssessment = function( paper, researcher, i18n ) {
	var assessmentResult = new AssessmentResult();

	var imageCount = researcher.getResearch( "imageCount" );
	var imageCountResult = calculateImageCountResult( imageCount, i18n );

	if ( isEmpty( imageCountResult ) ) {
		var altTagCount = researcher.getResearch( "altTagCount" );
		var altTagCountResult = assessImages( altTagCount, i18n );

		assessmentResult.setScore( altTagCountResult.score );
		assessmentResult.setText( altTagCountResult.text );

		return assessmentResult;
	}

	assessmentResult.setScore( imageCountResult.score );
	assessmentResult.setText( imageCountResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textImages",
	getResult: textHasImagesAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":131,"lodash/isEmpty":306}],27:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount > 300 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word. This is more than the %2$d word recommended minimum.",
				"The text contains %1$d words. This is more than the %2$d word recommended minimum.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 250, 300 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word. This is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				"The text contains %1$d words. This is slightly below the %2$d word recommended minimum. Add a bit more copy.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 200, 250 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word. This is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words. This is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 100, 200 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word. This is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				"The text contains %1$d words. This is below the %2$d word recommended minimum. Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 0, 100 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word. This is far too low and should be increased.",
				"The text contains %1$d words. This is far too low and should be increased.",
				wordCount
			)
		};
	}
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var textLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, 300 ) );

	return assessmentResult;
};

module.exports = {
	identifier: "textLength",
	getResult: textLengthAssessment
};

},{"../values/AssessmentResult.js":131,"lodash/inRange":299}],28:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.total === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No links appear in this page, consider adding some as appropriate." )
		};
	}

	if ( linkStatistics.externalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			/* translators: %1$s expands the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.total ) {
		return {
			score: 8,
			/* translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed link(s) and %2$s normal outbound link(s)." ),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* translators: %1$s expands to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal )
		};
	}
};

/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasLinksAssessment = function( paper, researcher, i18n ) {
	var linkStatistics = researcher.getResearch( "getLinkStatistics" );
	var assessmentResult = new AssessmentResult();
	if ( !isEmpty( linkStatistics ) ) {
		var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );
		assessmentResult.setScore( linkStatisticsResult.score );
		assessmentResult.setText( linkStatisticsResult.text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "textLinks",
	getResult: textHasLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":131,"lodash/isEmpty":306}],29:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the subheading matches object.
 *
 * @param {object} subHeadings The object with all subHeadings matches.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with score and text.
 */
var calculateSubheadingMatchesResult = function( subHeadings, i18n ) {
	if ( subHeadings.count === 0 ) {
		return {
			score: 4,
			text: i18n.dgettext( "js-text-analysis", "No subheading tags (like an H2) appear in the copy." )
		};
	}
	return {};
};

/**
 * Runs the match subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var textHasSubheadingsAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateSubheadingMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textSubheadings",
	getResult: textHasSubheadingsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};


},{"../values/AssessmentResult.js":131}],30:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Executes the pagetitle keyword assessment and returns an assessment result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment with text and score
 */
var titleHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
	var score, text;

	if ( keywordMatches.matches === 0 ) {
		score = 2;
		text = i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does not appear in the SEO title." ), paper.getKeyword() );
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position === 0 ) {
		score = 9;
		text = i18n.dgettext( "js-text-analysis", "The SEO title contains the focus keyword, at the beginning which is considered " +
			"to improve rankings." );
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position > 0 ) {
		score = 6;
		text = i18n.dgettext( "js-text-analysis", "The SEO title contains the focus keyword, but it does not appear at the beginning;" +
			" try and move it to the beginning." );
	}
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleKeyword",
	getResult: titleHasKeywordAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":131}],31:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Returns the score and text for the pageTitleLength
 * @param {number} pageTitleLength The length of the pageTitle.
 * @param {object} i18n The i18n object used for translations.
 * @returns {object} The result object.
 */
var calculatePageTitleLengthResult = function( pageTitleLength, i18n ) {
	var minLength = 35;
	var maxLength = 65;

	if ( inRange( pageTitleLength, 1, 35 ) ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* translators: %1$d expands to the number of characters in the page title,
					%2$d to the minimum number of characters for the title */
					"The page title contains %1$d character, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					"The page title contains %1$d characters, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
				pageTitleLength ),
				pageTitleLength, minLength )
		};
	}

	if ( inRange( pageTitleLength, 35, 66 ) ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					/* translators: %1$d expands to the minimum number of characters in the page title, %2$d to the maximum number of characters */
					"The page title is between the %1$d character minimum and the recommended %2$d character maximum." ),
				minLength, maxLength )
		};
	}

	if ( pageTitleLength > maxLength ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* translators: %1$d expands to the number of characters in the page title, %2$d to the maximum number
					of characters for the title */
					"The page title contains %1$d character, which is more than the viewable limit of %2$d characters; " +
					"some words will not be visible to users in your listing.",
					"The page title contains %1$d characters, which is more than the viewable limit of %2$d characters; " +
					"some words will not be visible to users in your listing.",
					pageTitleLength ),
				pageTitleLength, maxLength )
		};
	}

	return {
		score: 1,
		text: i18n.dgettext( "js-text-analysis", "Please create a page title." )
	};
};

/**
 * Runs the pageTitleLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var titleLengthAssessment = function( paper, researcher, i18n ) {
	var pageTitleLength = researcher.getResearch( "pageTitleLength" );
	var pageTitleLengthResult = calculatePageTitleLengthResult( pageTitleLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( pageTitleLengthResult.score );
	assessmentResult.setText( pageTitleLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleLength",
	getResult: titleLengthAssessment
};

},{"../values/AssessmentResult.js":131,"lodash/inRange":299}],32:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score, unboundedScore;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;

	if ( percentage <= 23.3 ) {
		// The 10 percentage points from 13.3 to 23.3 are scaled to a range of 6 score points: 6/10 = 0.6.
		// 23.3 scores 9, 13.3 scores 3.
		unboundedScore = 3 + ( 0.6  * ( percentage - 13.3 ) );

		// Scores exceeding 9 are 9, scores below 3 are 3.
		score = Math.max( Math.min( unboundedScore, 9 ), 3 );
		if ( score < 7 ) {
			var recommendedMinimum = 20;
			return {
				score: score,
				text: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
						"which is less than the recommended minimum of %2$s." ),
					percentage.toFixed( 1 ) + "%", recommendedMinimum + "%" )
			};
		}
	}

	if ( percentage >= 26.7 ) {
		// The 10 percentage points from 26.7 to 36.7 are scaled to a range of 6 score points: 6/10 = 0.6.
		// 26.7 scores 9, 36.7 scores 3.
		unboundedScore = 9 - ( 0.6 * ( percentage - 26.7 ) );

		// Scores exceeding 9 are 9, scores below 3 are 3.
		score = Math.max( Math.min( unboundedScore, 9 ), 3 );
		if ( score < 7 ) {
			var recommendedMaximum = 30;
			return {
				score: score,
				text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
					"which is more than the recommended maximum of %2$s." ), percentage.toFixed( 1 ) + "%", recommendedMaximum + "%" )
			};
		}
	}

	if ( isUndefined( score ) ) {
		score = 9;
	}

	return {
		score: score,
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, which is great."
		), percentage.toFixed( 1 ) + "%" )
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */
var transitionWordsAssessment = function( paper, researcher, i18n ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	var transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher containing the necessary research.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
var transitionWordsMarker = function( paper, researcher ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		var sentence = sentenceResult.sentence;

		return new Mark( {
			original: sentence,
			marked: marker( sentence )
		} );
	} );
};

module.exports = {
	identifier: "textTransitionWords",
	getResult: transitionWordsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: transitionWordsMarker
};

},{"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/isUndefined":317,"lodash/map":320}],33:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on whether or not there's a keyword in the url.
 * @param {number} keywordsResult The amount of keywords to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlKeywordCountResult = function( keywordsResult, i18n ) {

	if ( keywordsResult > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page." )
		};
	}

	return {
		score: 6,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. " +
		                                         "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" )
	};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywords = researcher.getResearch( "keywordCountInUrl" );
	var keywordsResult = calculateUrlKeywordCountResult( keywords, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( keywordsResult.score );
	assessmentResult.setText( keywordsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "urlKeyword",
	getResult: urlHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword() && paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":131}],34:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * The assessment that checks the url length
 *
 * @param {Paper} paper The paper to run this assessment on.
 * @param {object} researcher The researcher used for the assessment.
 * @param {object} i18n The i18n-object used for parsing translations.
 * @returns {object} an AssessmentResult with the score and the formatted text.
 */
var urlLengthAssessment = function( paper, researcher, i18n ) {
	var urlIsTooLong = researcher.getResearch( "urlLength" );
	var assessmentResult = new AssessmentResult();
	if ( urlIsTooLong ) {
		var score = 5;
		var text = i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." );
		assessmentResult.setScore( score );
		assessmentResult.setText( text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "urlLength",
	getResult: urlLengthAssessment,
	isApplicable: function ( paper ) {
		return paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":131}],35:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on the amount of stop words in the url.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
				"The slug for this page contains a %1$sstop word%2$s, consider removing it.",
				"The slug for this page contains %1$sstop words%2$s, consider removing them.",
				stopWordCount
			)
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInUrl" );
	var stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		"<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>",
		"</a>"
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "urlStopWords",
	getResult: urlHasStopWordsAssessment
};

},{"../values/AssessmentResult.js":131}],36:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

// The maximum recommended value is 3 syllables. With more than 3 syllables a word is considered complex.
var recommendedValue = 3;

/**
 * Filters the words that aren't too long.
 *
 * @param {Array} words The array with words to filter on complexity.
 * @returns {Array} The filtered list with complex words.
 */
var filterComplexity = function( words ) {
	return filter( words, function( word ) {
		return( word.complexity > recommendedValue );
	} );
};

/**
 * Calculates the complexity of the text based on the syllables in words.
 * @param {number} wordCount The number of words used.
 * @param {Array} wordComplexity The list of words with their syllable count.
 * @param {Object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculateComplexity = function( wordCount, wordComplexity, i18n ) {
	var tooComplexWords = filterComplexity( wordComplexity ).length;
	var percentage = ( tooComplexWords / wordCount ) * 100;
	percentage = fixFloatingPoint( percentage );
	var recommendedMaximum = 10;
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps. each step i 0.6
	// Up to 6.7 percent is for scoring a 9, higher percentages give lower scores.
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint( score );

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// Translators: %1$s expands to the percentage of complex words, %2$d expands to the recommended number of syllables,
					// %3$s expands to the recommend maximum
					"%1$s of the words contain over %2$d syllables, which is less than or equal to the recommended maximum of %3$s." ),
				percentage + "%", recommendedValue, recommendedMaximum + "%"  )
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to the percentage of too complex words, %2$d expands to the recommended number of syllables
				// %3$s expands to the recommend maximum
				"%1$s of the words contain over %2$d syllables, which is more than the recommended maximum of %3$s." ),
			percentage + "%", recommendedValue, recommendedMaximum + "%" )
	};
};

/**
 * Creates markers of words that are complex.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @returns {Array} A list with markers
 */
var wordComplexityMarker = function( paper, researcher ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var complexWords = filterComplexity( wordComplexity );
	return map( complexWords, function( complexWord ) {
		return new Mark( {
			original: complexWord.word,
			marked:  addMark( complexWord.word )
		} );
	} );
};

/**
 * Execute the word complexity assessment and return a result based on the syllables in words
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The object used for translations
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var wordComplexityAssessment = function( paper, researcher, i18n ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var wordCount = wordComplexity.length;

	var complexityResult = calculateComplexity( wordCount, wordComplexity, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( complexityResult.score );
	assessmentResult.setText( complexityResult.text );
	return assessmentResult;
};

module.exports = {
	identifier: "wordComplexity",
	getResult: wordComplexityAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	},
	getMarks: wordComplexityMarker
};

},{"../helpers/fixFloatingPoint.js":51,"../markers/addMark.js":56,"../values/AssessmentResult.js":131,"../values/Mark.js":132,"lodash/filter":292,"lodash/map":320}],37:[function(require,module,exports){
var Researcher = require( "./researcher.js" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isFunction = require( "lodash/isFunction" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var findIndex = require( "lodash/findIndex" );
var find = require( "lodash/find" );

var ScoreRating = 9;

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var Assessor = function( i18n, options ) {
	this.setI18n( i18n );
	this._assessments = [];

	this._options = options || {};
};

/**
 * Checks if the i18n object is defined and sets it.
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 */
Assessor.prototype.setI18n = function( i18n ) {
	if ( isUndefined( i18n ) ) {
		throw new MissingArgument( "The assessor requires an i18n object." );
	}
	this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function() {
	return this._assessments;
};

/**
 * Checks whether or not the Assessment is applicable.
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function( assessment, paper, researcher ) {
	if ( assessment.hasOwnProperty( "isApplicable" ) ) {
		return assessment.isApplicable( paper, researcher );
	}

	return true;
};

/**
 * Determines whether or not an assessment has a marker
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function( assessment ) {
	return isFunction( this._options.marker ) && assessment.hasOwnProperty( "getMarks" );
};

/**
 * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
 *
 * @param {Object} assessment The assessment for which we are retrieving the composed marker.
 * @param {Paper} paper The paper to retrieve the marker for.
 * @param {Researcher} researcher The researcher for the paper.
 * @returns {Function} A function that can mark the given paper according to the given assessment.
 */
Assessor.prototype.getMarker = function( assessment, paper, researcher ) {
	var specificMarker = this._options.marker;

	return function() {
		var marks = assessment.getMarks( paper, researcher );
		specificMarker( paper, marks );
	};
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @param {Paper} paper The paper to run assessments on.
 */
Assessor.prototype.assess = function( paper ) {
	var result;
	var researcher = new Researcher( paper );
	var assessments = this.getAvailableAssessments();
	this.results = [];

	assessments = filter( assessments, function( assessment ) {
		return this.isApplicable( assessment, paper, researcher );
	}.bind( this ) );

	this.results = map( assessments, function( assessment ) {
		result = assessment.getResult( paper, researcher, this.i18n );

		result.setIdentifier( assessment.identifier );

		if ( this.hasMarker( assessment ) ) {
			result.setMarker( this.getMarker( assessment, paper, researcher ) );
		}

		return result;
	}.bind( this ) );
};

/**
 * Filters out all assessmentresults that have no score and no text.
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function() {
	return filter( this.results, function( result ) {
		return this.isValidResult( result );
	}.bind( this ) );
};

/**
 * Returns if an assessmentResult is valid.
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function( assessmentResult ) {
	return assessmentResult.hasScore() && assessmentResult.hasText();
};

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore  = function() {
	var results = this.getValidResults();
	var totalScore = 0;

	forEach( results, function( assessmentResult ) {
		totalScore += assessmentResult.getScore();
	} );

	return Math.round( totalScore / ( results.length * ScoreRating ) * 100 );
};

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function( name, assessment ) {
	if ( !assessment.hasOwnProperty( "identifier" ) ) {
		assessment.identifier = name;
	}

	this._assessments.push( assessment );
	return true;
};

/**
 * Remove a specific Assessment from the list of Assessments.
 * @param {string} name The Assessment to remove from the list of assessments.
 */
Assessor.prototype.removeAssessment = function( name ) {
	var toDelete = findIndex( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && name === assessment.identifier;
	} );

	if ( -1 !== toDelete ) {
		this._assessments.splice( toDelete, 1 );
	}
};

/**
 * Returns an assessment by identifier
 *
 * @param {string} identifier The identifier of the assessment.
 * @returns {undefined|Object} The object if found, otherwise undefined.
 */
Assessor.prototype.getAssessment = function( identifier ) {
	return find( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && identifier === assessment.identifier;
	} );
};

module.exports = Assessor;

},{"./errors/missingArgument":49,"./researcher.js":59,"lodash/filter":292,"lodash/find":293,"lodash/findIndex":294,"lodash/forEach":295,"lodash/isFunction":307,"lodash/isUndefined":317,"lodash/map":320}],38:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );

var MissingArgument = require( "../../js/errors/missingArgument" );
/**
 * @param {object} app The app
 * @param {object} args An arguments object with usedKeywords, searchUrl, postUrl,
 * @param {object} args.usedKeywords An object with keywords and ids where they are used.
 * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
 * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
 * @constructor
 */
var PreviouslyUsedKeyword = function( app, args ) {
	if ( isUndefined( app ) ) {
		throw new MissingArgument( "The previously keyword plugin requires the YoastSEO app" );
	}

	if ( isUndefined( args ) ) {
		args = {
			usedKeywords: {},
			searchUrl: "",
			postUrl: ""
		};
	}

	this.app = app;
	this.usedKeywords = args.usedKeywords;
	this.searchUrl = args.searchUrl;
	this.postUrl = args.postUrl;
};

/**
 * Registers the assessment with the assessor.
 */
PreviouslyUsedKeyword.prototype.registerPlugin = function() {
	this.app.registerAssessment( "usedKeywords", {
		getResult: this.assess.bind( this ),
		isApplicable: function( paper ) {
			return paper.hasKeyword();
		}
	}, "previouslyUsedKeywords" );
};

/**
 * Updates the usedKeywords
 * @param {object} usedKeywords An object with keywords and ids where they are used.
 */
PreviouslyUsedKeyword.prototype.updateKeywordUsage = function( usedKeywords ) {
	this.usedKeywords = usedKeywords;
};

/**
 * Scores the previously used keyword assessment based on the count.
 *
 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
 * @param {Paper} paper The paper object to research.
 * @param {Jed} i18n The i18n object.
 * @returns {object} the scoreobject with text and score.
 */
PreviouslyUsedKeyword.prototype.scoreAssessment = function( previouslyUsedKeywords, paper, i18n ) {
	var count = previouslyUsedKeywords.count;
	var id = previouslyUsedKeywords.id;
	if( count === 0 ) {
		return {
			text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ),
			score: 9
		};
	}
	if( count === 1 ) {
		var url = "<a href='" + this.postUrl.replace( "{id}", id ) + "' target='_blank'>";
		return {
			/* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, " +
				"be sure to make very clear which URL on your site is the most important for this keyword." ), url, "</a>" ),
			score: 6
		};
	}
	if ( count > 1 ) {
		url = "<a href='" + this.searchUrl.replace( "{keyword}", paper.getKeyword() )+ "' target='_blank'>";
		return {
			/* translators: %1$s and $3$s expand to the admin search page for the focus keyword, %2$d expands to the number of times this focus
			 keyword has been used before, %4$s and %5$s expand to a link to an article on yoast.com about cornerstone content */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$s%2$d times before%3$s, " +
				"it's probably a good idea to read %4$sthis post on cornerstone content%5$s and improve your keyword strategy." ),
				url, count, "</a>", "<a href='https://yoast.com/cornerstone-content-rank/' target='_blank'>", "</a>" ),
			score: 1
		};
	}
};

/**
 * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
 *
 * @param {Paper} paper The paper object to research.
 * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
 */
PreviouslyUsedKeyword.prototype.researchPreviouslyUsedKeywords = function( paper ) {
	var keyword = paper.getKeyword();
	var count = 0;
	var id = 0;

	if ( !isUndefined( this.usedKeywords[ keyword ] ) ) {
		count = this.usedKeywords[ keyword ].length;
		id = this.usedKeywords[ keyword ][ 0 ];
	}

	return {
		id: id,
		count: count
	};
};

/**
 * The assessment for the previously used keywords.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The assessment result of the assessment
 */
PreviouslyUsedKeyword.prototype.assess = function( paper, researcher, i18n ) {
	var previouslyUsedKeywords = this.researchPreviouslyUsedKeywords( paper );
	var previouslyUsedKeywordsResult = this.scoreAssessment( previouslyUsedKeywords, paper, i18n );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( previouslyUsedKeywordsResult.score );
	assessmentResult.setText( previouslyUsedKeywordsResult.text );

	return assessmentResult;
};

module.exports = PreviouslyUsedKeyword;

},{"../../js/errors/missingArgument":49,"../values/AssessmentResult.js":131,"lodash/isUndefined":317}],39:[function(require,module,exports){
var analyzerConfig = {
	queue: [ "wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescriptionLength", "metaDescriptionKeyword", "pageTitleKeyword", "pageTitleLength", "firstParagraph", "urlStopwords", "keywordDoubles", "keyphraseSizeCheck" ],
	stopWords: [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ],
	wordsToRemove: [ " a", " in", " an", " on", " for", " the", " and" ],
	maxSlugLength: 20,
	maxUrlLength: 40,
	maxMeta: 156
};

module.exports = analyzerConfig;

},{}],40:[function(require,module,exports){
/** @module config/diacritics */

/**
 * Returns the diacritics map
 *
 * @returns {array} diacritics map
 */
module.exports = function() {
	return [
		{
			base: "a",
			letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{ base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
		{
			base: "c",
			letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		},
		{
			base: "d",
			letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
			base: "e",
			letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
			base: "g",
			letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
		},
		{
			base: "h",
			letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
			base: "i",
			letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
			base: "k",
			letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
		},
		{
			base: "l",
			letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{ base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
		{
			base: "n",
			letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
			base: "o",
			letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{ base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
			base: "r",
			letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
		},
		{
			base: "s",
			letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
		},
		{
			base: "t",
			letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
			base: "u",
			letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		},
		{ base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
		{ base: "vy", letters: /[\uA761]/g },
		{
			base: "w",
			letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
			base: "y",
			letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
		},
		{
			base: "z",
			letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		}
	];
};

},{}],41:[function(require,module,exports){
/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
module.exports = function ( i18n ) {
	return {
		feedback: {
			className: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Has feedback" )
		},
		bad: {
			className: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Bad SEO score" )
		},
		ok: {
			className: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "OK SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: OK SEO score" )
		},
		good: {
			className: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Good SEO score" )
		}
	};
};

},{}],42:[function(require,module,exports){
/** @module config/removalWords */

/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */
module.exports = function() {
	return [ " a", " in", " an", " on", " for", " the", " and" ];
};

},{}],43:[function(require,module,exports){
/** @module config/stopwords */

/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {Array} stopwords The array filled with stopwords.
 */
module.exports = function() {
	return [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
};

},{}],44:[function(require,module,exports){
/** @module config/syllables */

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
module.exports = function() {
	return {
		subtractSyllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e\\b", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
		addSyllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]l", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]" ],
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 }
		]
	};
};

},{}],45:[function(require,module,exports){
/** @module config/transitionWords */

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [ "about", "above all", "absolutely", "accordingly", "additionally", "after", "after all", "afterward", "afterwards", "again", "albeit", "all in all", "all of a sudden", "all things considered", "also", "although", "although this may be true", "altogether", "analogous to", "another", "another key point", "as", "as a matter of fact", "as a result", "as an illustration", "as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown", "as long as", "as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last", "at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time", "balanced against", "basically", "be that as it may", "because", "before", "being that", "besides", "but", "by all means", "by and large", "by comparison", "by the same token", "by the time", "certainly", "chiefly", "comparatively", "compared to", "concurrently", "consequently", "contrarily", "conversely", "correspondingly", "coupled with", "definitely", "despite", "different from", "doubtedly", "due to", "during", "e.g.", "earlier", "emphatically", "equally", "equally important", "especially", "eternally", "even if", "even more", "even so", "even though", "eventually", "evidently", "explicitly", "expressively", "expressly", "extremely", "finally", "first", "first thing to remember", "firstly", "following", "for example", "for fear that", "for instance", "for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose", "for this reason", "formerly", "forthwith", "fourth", "fourthly", "from time to time", "further", "furthermore", "generally", "given that", "given these points", "granted", "hence", "henceforth", "however", "i.e.", "identically", "immediately", "important to realize", "in a word", "in addition", "in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast", "in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of", "in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality", "in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that", "in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of", "in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place", "in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as", "including", "indeed", "instantly", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover", "most compelling evidence", "most important", "must be remembered", "namely", "naturally", "nevertheless", "next", "nonetheless", "nor", "not only", "not to mention", "notably", "notwithstanding", "now", "now that", "obviously", "occasionally", "of course", "on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary", "on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once", "once in a while", "only if", "or", "ordinarily", "otherwise", "overall", "owing to", "particularly", "point often overlooked", "positively", "presently", "previously", "prior to", "provided that", "rather", "regardless", "second", "secondly", "seeing that", "shortly", "significantly", "similarly", "simultaneously", "since", "so", "so as to", "so far", "so long as", "so that", "soon", "sooner or later", "specifically", "still", "straightaway", "subsequently", "such as", "summing up", "surely", "surprisingly", "take the case of", "than", "that is", "that is to say", "then", "then again", "thereafter", "therefore", "thereupon", "third", "thirdly", "this time", "though", "thus", "till", "to be sure", "to begin with", "to clarify", "to conclude", "to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "to list", "to point out", "to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up", "to summarize", "to that end", "to the end that", "to this end", "together with", "too", "truly", "ultimately", "undeniably", "under those circumstances", "undoubtedly", "uniquely", "unless", "unlike", "unquestionably", "until", "until now", "up against", "up to the present time", "usually", "vis a vis", "what's more", "when", "whenever", "where", "whereas", "while", "while it may be true", "while this may be true", "with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind", "without a doubt", "without delay", "without doubt", "without reservation" ];
};

},{}],46:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [ [ "both", "and" ], [ "if", "then" ], [ "not only", "but also" ], [ "neither", "nor" ], [ "either", "or" ], [ "not", "but" ],
		[ "whether", "or" ], [ "no sooner", "than" ] ];
};


},{}],47:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		wordComplexity,
		getSubheadingPresence,
		subheadingDistributionTooLong,
		subheadingDistributionTooShort,
		subHeadingLength,
		paragraphTooLong,
		paragraphTooShort,
		sentenceLengthInText,
		sentenceLengthInDescription,
		transitionWords,
		sentenceVariation,
		sentenceBeginnings,
		passiveVoice
	];
};

module.exports = ContentAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"./assessments/fleschReadingEaseAssessment.js":5,"./assessments/getSubheadingLengthAssessment.js":6,"./assessments/paragraphTooLongAssessment.js":13,"./assessments/paragraphTooShortAssessment.js":14,"./assessments/passiveVoiceAssessment.js":15,"./assessments/sentenceBeginningsAssessment.js":16,"./assessments/sentenceLengthInDescriptionAssessment.js":17,"./assessments/sentenceLengthInTextAssessment.js":18,"./assessments/sentenceVariationAssessment.js":19,"./assessments/subheadingDistributionTooLongAssessment.js":20,"./assessments/subheadingDistributionTooShortAssessment.js":21,"./assessments/subheadingPresenceAssessment.js":22,"./assessments/transitionWordsAssessment.js":32,"./assessments/wordComplexityAssessment.js":36,"./assessor.js":37,"util":478}],48:[function(require,module,exports){
/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 * @returns {void}
 */
module.exports = function InvalidTypeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":478}],49:[function(require,module,exports){
module.exports = function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":478}],50:[function(require,module,exports){
var forEach = require( "lodash/forEach" );

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 * @returns {void}
 */
var addClass = function( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 * @returns {void}
 */
var removeClass = function( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 * @returns {void}
 */
var removeClasses = function( element, classes ) {
	forEach( classes, this.removeClass.bind( null, element ) );
};

/**
 * Checks whether an element has a specific class.
 *
 * @param {HTMLElement} element The element to check for the class.
 * @param {string} className The class to look for.
 * @returns {boolean} Whether or not the class is present.
 */
var hasClass = function( element, className ) {
	return element.className.indexOf( className ) > -1;
};

module.exports = {
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	removeClasses: removeClasses
};

},{"lodash/forEach":295}],51:[function(require,module,exports){
/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */
module.exports = function ( number ) {
	return Math.round( number * 100 ) / 100;
};

},{}],52:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is greater than the recommendedValue, false if it is smaller.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength > recommendedValue;
};

},{}],53:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is smaller than the recommendedValue, false if it is bigger.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength < recommendedValue;
};

},{}],54:[function(require,module,exports){
/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {Number} score The score to interpreter.
 * @returns {string} The rating, given based on the score.
 */
var ScoreToRating = function( score ) {

	if ( score === 0 ) {
		return "feedback";
	}

	if ( score <= 4 ) {
		return "bad";
	}

	if ( score > 4 && score <= 7 ) {
		return "ok";
	}

	if ( score > 7 ) {
		return "good";
	}

	return "";
};

module.exports = ScoreToRating;

},{}],55:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [ "A", "An", "The", "This", "That", "These", "Those", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten" ];
};

},{}],56:[function(require,module,exports){
/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
};

},{}],57:[function(require,module,exports){
/* global console: true */
/* global setTimeout: true */
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var reduce = require( "lodash/reduce" );
var isString = require( "lodash/isString" );
var isObject = require( "lodash/isObject" );
var InvalidTypeError = require( "./errors/invalidType" );

/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
 *
 * A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications.
 * In order to do so, it must first register itself as a plugin with YoastSEO.js. To keep our content analysis fast, we
 * don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify
 * the content. If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once
 * preloaded.
 *
 * To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically
 * fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded
 * by calling `reloaded`.
 *
 * @todo: add list of supported modifications and compare on registration of modification
 */

/**
 * Setup Pluggable and set its default values.
 *
 * @constructor
 * @param       {App}       app                 The App object to attach to.
 * @property    {number}    preloadThreshold	The maximum time plugins are allowed to preload before we load our content analysis.
 * @property    {object}    plugins             The plugins that have been registered.
 * @property    {object}    modifications 	    The modifications that have been registered. Every modification contains an array with callables.
 * @property    {Array}     customTests         All tests added by plugins.
 */
var Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

	// Allow plugins 1500 ms to register before we start polling their
	setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
};

//  ***** DSL IMPLEMENTATION ***** //

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options passed by the plugin.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not the plugin was successfully registered.
 */
Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( !isUndefined( options ) && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[ pluginName ] = options;
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param {string} pluginName	The name of the plugin to be declared as ready.
 * @returns {boolean}           Whether or not the plugin was successfully declared ready.
 */
Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[ pluginName ].status = "ready";
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param {string} pluginName   The name of the plugin to be declared as reloaded.
 * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
 */
Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.app.refresh();
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param {string}      modification	The name of the filter
 * @param {function}    callable 	    The callable
 * @param {string}      pluginName 	    The plugin that is registering the modification.
 * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									    Lower numbers correspond with earlier execution.
 * @returns {boolean}                   Whether or not applying the hook was successfull.
 */
Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

	var callableObject = {
		callable: callable,
		origin: pluginName,
		priority: prio
	};

	// Make sure modification is defined on modifications object
	if ( isUndefined( this.modifications[ modification ] ) ) {
		this.modifications[ modification ] = [];
	}

	this.modifications[ modification ].push( callableObject );

	return true;
};

/**
 * Register test for a specific plugin
 *
 * @deprecated
 */
Pluggable.prototype._registerTest = function() {
	console.error( "This function is deprecated, please use _registerAssessment" );
};

/**
 * Register an assessment for a specific plugin
 *
 * @param {object} assessor The assessor object where the assessments needs to be added.
 * @param {string} name The name of the assessment.
 * @param {function} assessment The function to run as an assessment.
 * @param {string} pluginName The name of the plugin associated with the assessment.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Pluggable.prototype._registerAssessment = function( assessor, name, assessment, pluginName ) {
	if ( !isString( name ) ) {
		throw new InvalidTypeError( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
	}

	if ( !isObject( assessment ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `assessment` to be a function." );
	}

	if ( !isString( pluginName ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `pluginName` to be a string." );
	}

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	assessor.addAssessment( name, assessment );

	return true;
};

// ***** PRIVATE HANDLERS *****//

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = isUndefined( pollTime ) ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean} Whether or not all registered plugins are loaded.
 * @private
 */
Pluggable.prototype._allReady = function() {
	return reduce( this.plugins, function( allReady, plugin ) {
		return allReady && plugin.status === "ready";
	}, true );
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollTimeExceeded = function() {
	forEach( this.plugins, function( plugin, pluginName ) {
		if ( !isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
			console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
			delete this.plugins[ pluginName ];
		}
	} );
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param	{string}    modification	The name of the filter
 * @param   {*}         data 		    The data to filter
 * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
 * @returns {*} 		                The filtered data
 * @private
 */
Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[ modification ];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		forEach( callChain, function( callableObject ) {
			var callable = callableObject.callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callableObject.origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		} );
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer              The analyzer that the test will be added to.
 * @param {Object}            pluginTest            The test to be added.
 * @param {string}            pluginTest.name       The name of the test.
 * @param {function}          pluginTest.callable   The function associated with the test.
 * @param {function}          pluginTest.analysis   The function associated with the analyzer.
 * @param {Object}            pluginTest.scoring    The scoring object to be used.
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
 * @returns {Array} callChain 	 The stripped version of the callChain.
 * @private
 */
Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	forEach( callChain, function( callableObject, index ) {
		if ( this._validateOrigin( callableObject.origin ) === false ) {
			delete callChain[ index ];
		}
	}.bind( this ) );

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
 * @returns {boolean}                   Whether or not the origin is valid.
 * @private
 */
Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[ pluginName ].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
 * @returns {boolean}                   Whether or not the plugin has a unique name.
 * @private
 */
Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( !isUndefined( this.plugins[ pluginName ] ) ) {
		return false;
	}
	return true;
};

module.exports = Pluggable;

},{"./errors/invalidType":48,"lodash/forEach":295,"lodash/isObject":311,"lodash/isString":314,"lodash/isUndefined":317,"lodash/reduce":327}],58:[function(require,module,exports){
/* jshint browser: true */

var forEach = require( "lodash/forEach" );
var isNumber = require( "lodash/isNumber" );
var isObject = require( "lodash/isObject" );
var isUndefined = require( "lodash/isUndefined" );
var difference = require( "lodash/difference" );
var template = require( "../templates.js" ).assessmentPresenterResult;
var scoreToRating = require( "../interpreters/scoreToRating.js" );
var createConfig = require( "../config/presenter.js" );

var domManipulation = require( "../helpers/domManipulation.js" );

/**
 * Constructs the AssessorPresenter.
 *
 * @param {Object} args A list of arguments to use in the presenter.
 * @param {object} args.targets The HTML elements to render the output to.
 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
 * @param {Jed} args.i18n The translation object.
 *
 * @constructor
 */
var AssessorPresenter = function( args ) {
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall || "overallScore";
	this.presenterConfig = createConfig( args.i18n );
};

/**
 * Sets the keyword
 * @param {string} keyword The keyword to use.
 */
AssessorPresenter.prototype.setKeyword = function( keyword ) {
	this.keyword = keyword;
};

/**
 * Checks whether or not a specific property exists in the presenter configuration.
 * @param {string} property The property name to search for.
 * @returns {boolean} Whether or not the property exists.
 */
AssessorPresenter.prototype.configHasProperty = function( property ) {
	return this.presenterConfig.hasOwnProperty( property );
};

/**
 * Gets a fully formatted indicator object that can be used.
 * @param {string} rating The rating to use.
 * @returns {Object} An object containing the class, the screen reader text, and the full text.
 */
AssessorPresenter.prototype.getIndicator = function( rating ) {
	return {
		className: this.getIndicatorColorClass( rating ),
		screenReaderText: this.getIndicatorScreenReaderText( rating ),
		fullText: this.getIndicatorFullText( rating )
	};
};

/**
 * Gets the indicator color class from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} String containing the CSS class to be used.
 */
AssessorPresenter.prototype.getIndicatorColorClass = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].className;
};

/**
 * Get the indicator screen reader text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the screen reader text to be used.
 */
AssessorPresenter.prototype.getIndicatorScreenReaderText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].screenReaderText;
};

/**
 * Get the indicator full text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the full text to be used.
 */
AssessorPresenter.prototype.getIndicatorFullText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].fullText;
};

/**
 * Adds a rating based on the numeric score.
 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
 * @returns {Object} The Assessment result object with the rating added.
 */
AssessorPresenter.prototype.resultToRating = function( result ) {
	if ( !isObject( result ) ) {
		return "";
	}

	result.rating = scoreToRating( result.score );

	return result;
};

/**
 * Takes the individual assessment results, sorts and rates them.
 * @returns {Object} Object containing all the individual ratings.
 */
AssessorPresenter.prototype.getIndividualRatings = function() {
	var ratings = {};
	var validResults = this.sort( this.assessor.getValidResults() );
	var mappedResults = validResults.map( this.resultToRating );

	forEach( mappedResults, function( item, key ) {
		ratings[ key ] = this.addRating( item );
	}.bind( this ) );

	return ratings;
};

/**
 * Excludes items from the results that are present in the exclude array.
 * @param {Array} results Array containing the items to filter through.
 * @param {Array} exclude Array of results to exclude.
 * @returns {Array} Array containing items that remain after exclusion.
 */
AssessorPresenter.prototype.excludeFromResults = function( results, exclude ) {
	return difference( results, exclude );
};

/**
 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
 * @param {Array} results Array containing the results that need to be sorted.
 * @returns {Array} Array containing the sorted results.
 */
AssessorPresenter.prototype.sort = function ( results ) {
	var unsortables = this.getUndefinedScores( results );
	var sortables = this.excludeFromResults( results, unsortables );

	sortables.sort( function( a, b ) {
		return a.score - b.score;
	} );

	return unsortables.concat( sortables );
};

/**
 * Returns a subset of results that have an undefined score or a score set to zero.
 * @param {Array} results The results to filter through.
 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
 */
AssessorPresenter.prototype.getUndefinedScores = function ( results ) {
	return results.filter( function( result ) {
		return isUndefined( result.score ) || result.score === 0;
	} );
};

/**
 * Creates a rating object based on the item that is being passed.
 * @param {AssessmentResult} item The item to check and create a rating object from.
 * @returns {Object} Object containing a parsed item, including a colored indicator.
 */
AssessorPresenter.prototype.addRating = function( item ) {
	var indicator = this.getIndicator( item.rating );
	indicator.text = item.text;
	indicator.identifier = item.getIdentifier();

	if ( item.hasMarker() ) {
		indicator.marker = item.getMarker();
	}

	return indicator;
};

/**
 * Calculates the overall rating score based on the overall score.
 * @param {Number} overallScore The overall score to use in the calculation.
 * @returns {Object} The rating based on the score.
 */
AssessorPresenter.prototype.getOverallRating = function( overallScore ) {
	var rating = 0;

	if ( this.keyword === "" ) {
		return this.resultToRating( { score: rating } );
	}

	if ( isNumber( overallScore ) ) {
		rating = ( overallScore / 10 );
	}

	return this.resultToRating( { score: rating } );
};

/**
 * Toggles the marker button class depending on its state.
 *
 * @param {HTMLElement} element The element to toggle the class on.
 */
AssessorPresenter.prototype.toggleMarkerClass = function( element ) {
	var markers = document.getElementsByClassName( "assessment-results__mark" );

	// Reset all other items prior to activating the currently active marker.
	forEach( markers, function( marker ) {
		domManipulation.removeClass( marker, "icon-eye-active" );
		domManipulation.addClass( marker, "icon-eye-inactive" );
	} );

	domManipulation.removeClass( element, "icon-eye-inactive" );
	domManipulation.addClass( element, "icon-eye-active" );
};

/**
 * Adds an event listener for the marker button
 *
 * @param {string} identifier The identifier for the assessment the marker belongs to.
 * @param {Function} marker The marker function that can mark the assessment in the text.
 */
AssessorPresenter.prototype.addMarkerEventHandler = function( identifier, marker ) {
	var container = document.getElementById( this.output );
	var markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

	markButton.addEventListener( "click", function( event ) {
		this.toggleMarkerClass( event.target );
		marker();
	}.bind( this ) );
};

/**
 * Renders out both the individual and the overall ratings.
 */
AssessorPresenter.prototype.render = function() {
	this.renderIndividualRatings();
	this.renderOverallRating();
};

/**
 * Adds event handlers to the mark buttons
 *
 * @param {Array} scores The list of rendered scores.
 */
AssessorPresenter.prototype.bindMarkButtons = function( scores ) {
	// Make sure the button works for every score with a marker.
	forEach( scores, function ( score ) {
		if ( score.hasOwnProperty( "marker" ) ) {
			this.addMarkerEventHandler( score.identifier, score.marker );
		}
	}.bind( this ) );
};

/**
 * Renders out the individual ratings.
 */
AssessorPresenter.prototype.renderIndividualRatings = function() {
	var outputTarget = document.getElementById( this.output );
	var scores = this.getIndividualRatings();

	outputTarget.innerHTML = template( {
		scores: scores
	} );

	this.bindMarkButtons( scores );
};

/**
 * Renders out the overall rating.
 */
AssessorPresenter.prototype.renderOverallRating = function() {
	var overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
	var overallRatingElement = document.getElementById( this.overall );

	if ( !overallRatingElement ) {
		return;
	}

	overallRatingElement.className = "overallScore " + this.getIndicatorColorClass( overallRating.rating );
};

module.exports = AssessorPresenter;

},{"../config/presenter.js":41,"../helpers/domManipulation.js":50,"../interpreters/scoreToRating.js":54,"../templates.js":130,"lodash/difference":290,"lodash/forEach":295,"lodash/isNumber":310,"lodash/isObject":311,"lodash/isUndefined":317}],59:[function(require,module,exports){
var merge = require( "lodash/merge" );
var InvalidTypeError = require( "./errors/invalidType" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

// Researches
var wordCountInText = require( "./researches/wordCountInText.js" );
var getLinkStatistics = require( "./researches/getLinkStatistics.js" );
var linkCount = require( "./researches/countLinks.js" );
var urlLength = require( "./researches/urlIsTooLong.js" );
var findKeywordInPageTitle = require( "./researches/findKeywordInPageTitle.js" );
var matchKeywordInSubheadings = require( "./researches/matchKeywordInSubheadings.js" );
var getKeywordDensity = require( "./researches/getKeywordDensity.js" );
var stopWordsInKeyword = require( "./researches/stopWordsInKeyword" );
var stopWordsInUrl = require( "./researches/stopWordsInUrl" );
var calculateFleschReading = require( "./researches/calculateFleschReading.js" );
var metaDescriptionLength = require( "./researches/metaDescriptionLength.js" );
var imageCount = require( "./researches/imageCountInText.js" );
var altTagCount = require( "./researches/imageAltTags.js" );
var keyphraseLength = require( "./researches/keyphraseLength" );
var metaDescriptionKeyword = require( "./researches/metaDescriptionKeyword.js" );
var keywordCountInUrl = require( "./researches/keywordCountInUrl" );
var findKeywordInFirstParagraph = require( "./researches/findKeywordInFirstParagraph.js" );
var pageTitleLength = require( "./researches/pageTitleLength.js" );
var wordComplexity = require( "./researches/getWordComplexity.js" );
var getParagraphLength = require( "./researches/getParagraphLength.js" );
var countSentencesFromText = require( "./researches/countSentencesFromText.js" );
var countSentencesFromDescription = require( "./researches/countSentencesFromDescription.js" );
var getSubheadingLength = require( "./researches/getSubheadingLength.js" );
var getSubheadingTextLengths = require( "./researches/getSubheadingTextLengths.js" );
var getSubheadingPresence = require( "./researches/getSubheadingPresence.js" );
var findTransitionWords = require( "./researches/findTransitionWords.js" );
var sentenceVariation = require( "./researches/sentenceVariation.js" );
var passiveVoice = require( "./researches/getPassiveVoice.js" );
var getSentenceBeginnings = require( "./researches/getSentenceBeginnings.js" );

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.setPaper( paper );

	this.defaultResearches = {
		"urlLength": urlLength,
		"wordCountInText": wordCountInText,
		"findKeywordInPageTitle": findKeywordInPageTitle,
		"calculateFleschReading": calculateFleschReading,
		"getLinkStatistics": getLinkStatistics,
		"linkCount": linkCount,
		"imageCount": imageCount,
		"altTagCount": altTagCount,
		"matchKeywordInSubheadings": matchKeywordInSubheadings,
		"getKeywordDensity": getKeywordDensity,
		"stopWordsInKeyword": stopWordsInKeyword,
		"stopWordsInUrl": stopWordsInUrl,
		"metaDescriptionLength": metaDescriptionLength,
		"keyphraseLength": keyphraseLength,
		"keywordCountInUrl": keywordCountInUrl,
		"firstParagraph": findKeywordInFirstParagraph,
		"metaDescriptionKeyword": metaDescriptionKeyword,
		"pageTitleLength": pageTitleLength,
		"wordComplexity": wordComplexity,
		"getParagraphLength": getParagraphLength,
		"countSentencesFromText": countSentencesFromText,
		"countSentencesFromDescription": countSentencesFromDescription,
		"getSubheadingLength": getSubheadingLength,
		"getSubheadingTextLengths": getSubheadingTextLengths,
		"getSubheadingPresence": getSubheadingPresence,
		"findTransitionWords": findTransitionWords,
		"sentenceVariation": sentenceVariation,
		"passiveVoice": passiveVoice,
		"getSentenceBeginnings": getSentenceBeginnings
	};

	this.customResearches = {};
};

/**
 * Set the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @returns {void}
 */
Researcher.prototype.setPaper = function( paper ) {
	this.paper = paper;
};

/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 * @throws {MissingArgument} Research name cannot be empty.
 * @throws {InvalidTypeError} The research requires a valid Function callback.
 * @returns {void}
 */
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires a Function callback." );
	}

	this.customResearches[ name ] = research;
};

/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() ).filter(
	function( research ) {
		return research === name;
	} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !this.hasResearch( name ) ) {
		return false;
	}

	return this.getAvailableResearches()[ name ]( this.paper );
};

module.exports = Researcher;

},{"./errors/invalidType":48,"./errors/missingArgument":49,"./researches/calculateFleschReading.js":60,"./researches/countLinks.js":61,"./researches/countSentencesFromDescription.js":62,"./researches/countSentencesFromText.js":63,"./researches/findKeywordInFirstParagraph.js":64,"./researches/findKeywordInPageTitle.js":65,"./researches/findTransitionWords.js":66,"./researches/getKeywordDensity.js":67,"./researches/getLinkStatistics.js":68,"./researches/getParagraphLength.js":70,"./researches/getPassiveVoice.js":71,"./researches/getSentenceBeginnings.js":72,"./researches/getSubheadingLength.js":73,"./researches/getSubheadingPresence.js":74,"./researches/getSubheadingTextLengths.js":75,"./researches/getWordComplexity.js":76,"./researches/imageAltTags.js":77,"./researches/imageCountInText.js":78,"./researches/keyphraseLength":79,"./researches/keywordCountInUrl":80,"./researches/matchKeywordInSubheadings.js":81,"./researches/metaDescriptionKeyword.js":82,"./researches/metaDescriptionLength.js":83,"./researches/pageTitleLength.js":84,"./researches/sentenceVariation.js":90,"./researches/stopWordsInKeyword":91,"./researches/stopWordsInUrl":93,"./researches/urlIsTooLong.js":94,"./researches/wordCountInText.js":95,"lodash/isEmpty":306,"lodash/isUndefined":317,"lodash/merge":322}],60:[function(require,module,exports){
/** @module analyses/calculateFleschReading */

var cleanText = require( "../stringProcessing/cleanText.js" );
var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	text = cleanText( text );
	text = stripHTMLTags( text );
	var wordCount = countWords( text );

	text = stripNumbers( text );
	var sentenceCount = countSentences( text );
	var syllableCount = countSyllables( text );
	var score = 206.835 - ( 1.015 * ( wordCount / sentenceCount ) ) - ( 84.6 * ( syllableCount / wordCount ) );

	return score.toFixed( 1 );
};

},{"../stringProcessing/cleanText.js":100,"../stringProcessing/countSentences.js":101,"../stringProcessing/countSyllables.js":102,"../stringProcessing/countWords.js":103,"../stringProcessing/stripHTMLTags.js":124,"../stringProcessing/stripNumbers.js":126}],61:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var anchors = getLinks( text );

	return anchors.length;
};

},{"./getLinks":69}],62:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":110,"./../stringProcessing/sentencesLength.js":122}],63:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":110,"./../stringProcessing/sentencesLength.js":122}],64:[function(require,module,exports){
/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var paragraph = matchParagraphs( paper.getText() );
	return wordMatch( paragraph[ 0 ], paper.getKeyword() );
};

},{"../stringProcessing/matchParagraphs.js":115,"../stringProcessing/matchTextWithWord.js":117}],65:[function(require,module,exports){
/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	var title = paper.getTitle();
	var keyword = paper.getKeyword();
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword );
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};

},{"../stringProcessing/matchTextWithWord.js":117}],66:[function(require,module,exports){
var transitionWords = require( "../config/transitionWords.js" );
var twoPartTransitionWords = require( "../config/twoPartTransitionWords.js" );
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var createRegexFromArray = require( "../stringProcessing/createRegexFromArray.js" );
var forEach = require( "lodash/forEach" );

/**
 * Matches the sentence against two part transition words.
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function( sentence ) {
	return sentence.match( createRegexFromDoubleArray( twoPartTransitionWords() ) );
};

/**
 * Matches the sentence against transition words.
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function( sentence ) {
	return sentence.match( createRegexFromArray( transitionWords() ) );
};

/**
 * Checks the passed sentences to see if they contain transitional words.
 * @param {Array} sentences The sentences to match against.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transitional words.
 */
var checkSentencesForTransitionWords = function( sentences ) {
	var results = [];

	forEach( sentences, function( sentence ) {
		var twoPartMatches = matchTwoPartTransitionWords( sentence );

		if ( twoPartMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: twoPartMatches
			} );

			return;
		}

		var transitionWordMatches = matchTransitionWords( sentence );

		if ( transitionWordMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: transitionWordMatches
			} );

			return;
		}
	} );

	return results;
};

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceResults = checkSentencesForTransitionWords( sentences );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length
	};
};

},{"../config/transitionWords.js":45,"../config/twoPartTransitionWords.js":46,"../stringProcessing/createRegexFromArray.js":104,"../stringProcessing/createRegexFromDoubleArray.js":105,"../stringProcessing/getSentences.js":110,"lodash/forEach":295}],67:[function(require,module,exports){
/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = matchWords( text, keyword );
	return ( keywordCount / wordCount ) * 100;
};

},{"../stringProcessing/countWords.js":103,"../stringProcessing/matchTextWithWord.js":117}],68:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function( keyword, anchor ) {
	if ( keyword === "" ) {
		return false;
	}

	return findKeywordInUrl( anchor, keyword );
};

/**
 * Counts the links found in the text.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
var countLinkTypes = function( paper ) {
	var url = paper.getUrl();
	var keyword = paper.getKeyword();
	var anchors = getLinks( paper.getText() );

	var linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		keyword: {
			totalKeyword: 0,
			matchedAnchors: []
		},
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0
	};

	for ( var i = 0; i < anchors.length; i++ ) {
		var currentAnchor = anchors[ i ];

		if ( keywordInAnchor( keyword, currentAnchor ) ) {

			linkCount.keyword.totalKeyword++;
			linkCount.keyword.matchedAnchors.push( currentAnchor );
		}

		var linkType = getLinkType( currentAnchor, url );
		var linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
};

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( paper ) {
	return countLinkTypes( paper );
};

},{"../stringProcessing/checkNofollow.js":99,"../stringProcessing/findKeywordInUrl.js":106,"../stringProcessing/getLinkType.js":109,"./getLinks.js":69}],69:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} text The text
 * @returns {Array} An array with the anchors
 */
module.exports = function( text ) {
	return getAnchors( text );
};

},{"../stringProcessing/getAnchorsFromText.js":108}],70:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords.js" );
var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var filter = require( "lodash/filter" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
 * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
	paragraphs.map( function ( paragraph ) {
		paragraphsLength.push( {
			wordCount: countWords( paragraph ),
			paragraph: paragraph
		} );
	} );

	return filter( paragraphsLength, function ( paragraphLength ) {
		return ( paragraphLength.wordCount > 0 );
	} );
};

},{"../stringProcessing/countWords.js":103,"../stringProcessing/matchParagraphs.js":115,"lodash/filter":292}],71:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var nonverbEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var determiners = require( "./passivevoice-english/determiners.js" )();

var auxiliaries = require( "./passivevoice-english/auxiliaries.js" )();
var irregulars = require( "./passivevoice-english/irregulars.js" )();
var stopwords = require( "./passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

/**
 * Matches string with an array, returns the word and the index it was found on
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matchArray The array with strings to match
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var matchArray = function( sentence, matchArray ) {
	var matches = matchArray;
	var matchedParts = [];
	forEach( matches, function( part ) {
		part = stripSpaces( part );

		// Search for each part in the array and filter on index -1
		var index = sentence.search( stringToRegex( part ) );
		if ( index > -1 ) {
			matchedParts.push( { index: index, match: part } );
		}
	} );
	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 * @param {Array} indices The array with indices to be filtered
 * @returns {Array} The filtered array
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {

		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( !isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function( sentence ) {

	// Matches the sentences with words ending in ing
	var matches = sentence.match( /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	var exclusionArray = [ "king", "cling", "ring", "being" ];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return matchArray( stripSpaces( match ), exclusionArray ).length === 0;
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine subsentences.
 * Stopwords are filtered because they can contain duplicate matches, like "even though" and "though".
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs
 * @returns {Array} The array with valid indices to use for determining subsentences.
 */
var getSentenceBreakers = function( sentence ) {
	var auxiliaryIndices = matchArray( sentence, auxiliaries );

	var stopwordIndices = matchArray( sentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = matchArray( sentence, ingVerbs );

	// Concat all indices arrays and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	return sortIndices( indices );
};

/**
 * Gets the subsentences from a sentence by determining sentence breakers
 * @param {string} sentence The sentence to split up in subsentences
 * @returns {Array} The array with all subsentences of a sentence that have an auxiliary
 */
var getSubsentences = function( sentence ) {
	var auxiliaryRegex = arrayToRegex( auxiliaries );
	var subSentences = [];

	// First check if there is an auxiliary word in the sentence
	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );

		// Get the words after the found auxiliary
		for ( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if ( !isUndefined( indices[ i + 1 ] ) ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );
			subSentences.push( subSentence );
		}
	}

	// If a subsentence doesn't have an auxiliary, we don't need it, so it can be filtered out.
	subSentences = filter( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 * Gets regular passive verbs.
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getRegularVerbs = function( subSentence ) {

	// Matches the sentences with words ending in ed
	var matches = subSentence.match( /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ) {

		// Strips spaces from the match
		return matchArray( stripSpaces( match ), nonverbEndingEd ).length === 0;
	} );
};

/**
 * Gets irregular passive verbs
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getIrregularVerbs = function( subSentence ) {
	var irregularVerbs = matchArray( subSentence, irregulars );
	return filter( irregularVerbs, function( verb ) {
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if ( verb.match === "rid" ) {
			var exclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
			if ( matchArray( subSentence, exclusionArray ).length > 0 ) {
				return false;
			}
		}
		return true;
	} );
};

/**
 * Matches having with a verb directly following it. If so, it is not passive.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isHavingException = function( subSentence, verbs ) {

	// Match having with a verb directly following it. If so it is active.
	var indexOfHaving = subSentence.indexOf( "having" );
	if ( indexOfHaving > -1 ) {
		var verbIndices = matchArray( subSentence, verbs );

		// 7 is the number of characters of the word 'having' including space
		return verbIndices[ 0 ].index <= subSentence.indexOf( "having" ) + 7;
	}
	return false;
};

/**
 * Match the left. If left is preceeded by `a` or `the`, it isn't a verb.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isLeftException = function ( subSentence, verbs ) {

	// Matches left with the or a preceeding.
	var matchLeft = subSentence.match( /(the|a)\sleft/ig ) || [];
	return matchLeft.length > 0 && verbs[ 0 ].match === "left";
};

/**
 * If the word 'fit' is preceeded by a determiner, it shouldn't be marked as active.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isFitException = function( subSentence ) {
	var indexOfFit = subSentence.indexOf( "fit" );
	if ( indexOfFit > -1 ) {
		var subString = subSentence.substr( 0, indexOfFit );
		var determinerIndices = matchArray( subString, determiners );
		return determinerIndices.length > 1;
	}
	return false;
};

/**
 * Gets the exceptions. Some combinations shouldn't be marked as passive, so we need to filter them out.
 * @param {string} subSentence The subsentence to check for exceptions.
 * @param {array} verbs The array of verbs, used to determine exceptions.
 * @returns {boolean} Wether there is an exception or not.
 */
var getExceptions = function( subSentence, verbs ) {
	var havingException = isHavingException( subSentence, verbs );
	var leftException = isLeftException( subSentence, verbs );
	var fitException = isFitException( subSentence );

	// If any of the exceptions is true, return true.
	return havingException || leftException || fitException;
};

/**
 * Checks the subsentence for any passive verb.
 * @param {string} subSentence The subsentence to check for passives.
 * @returns {boolean} True if passive is found, false if no passive is found.
 */
var determinePassives = function( subSentence ) {
	var regularVerbs = getRegularVerbs( subSentence );
	var irregularVerbs = getIrregularVerbs( subSentence );
	var verbs = regularVerbs.concat( irregularVerbs );

	// Checks for exceptions in the found verbs.
	var exceptions = getExceptions( subSentence, verbs );

	// If there is any exception, this subsentence cannot be passive.
	return verbs.length > 0 && exceptions === false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveSentences = [];

	// Get subsentences for each sentence.
	forEach( sentences, function( sentence ) {
		var subSentences = getSubsentences( sentence );
		var passive = false;
		forEach( subSentences, function( subSentence ) {
			passive = determinePassives( subSentence );
		} );
		if ( passive === true ) {
			passiveSentences.push( sentence );
			passive = false;
		}
	} );

	return {
		total: sentences.length,
		passives: passiveSentences
	};
};

},{"../stringProcessing/createRegexFromArray.js":104,"../stringProcessing/getSentences.js":110,"../stringProcessing/stringToRegex.js":123,"../stringProcessing/stripSpaces.js":127,"./passivevoice-english/auxiliaries.js":85,"./passivevoice-english/determiners.js":86,"./passivevoice-english/irregulars.js":87,"./passivevoice-english/non-verb-ending-ed.js":88,"./passivevoice-english/stopwords.js":89,"lodash/filter":292,"lodash/forEach":295,"lodash/isUndefined":317}],72:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var removeNonWordCharacters = require( "../stringProcessing/removeNonWordCharacters.js" );
var firstWordExceptions = require ( "../language/en/firstWordExceptions.js" )();

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {number} i The iterator for the sentenceBeginning array.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var matchSentenceBeginnings = function( sentenceBeginnings, i ) {
	if ( sentenceBeginnings[ i ] === sentenceBeginnings[ i + 1 ] ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings ) {
	var counts = [];
	var count = 1;
	for ( var i = 0; i < sentenceBeginnings.length; i++ ) {
		if ( matchSentenceBeginnings( sentenceBeginnings, i ) ) {
			count++;
		} else {
			counts.push( { word: sentenceBeginnings[ i ], count: count } );
			count = 1;
		}
	}
	return counts;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceBeginnings = sentences.map( function( sentence ) {
		var words = getWords( stripSpaces( sentence ) );
		var firstWord = removeNonWordCharacters( words[ 0 ] );
		if ( firstWordExceptions.indexOf( firstWord ) > -1 ) {
			firstWord += " " + removeNonWordCharacters( words[ 1 ] );
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings );
};

},{"../language/en/firstWordExceptions.js":55,"../stringProcessing/getSentences.js":110,"../stringProcessing/getWords.js":113,"../stringProcessing/removeNonWordCharacters.js":118,"../stringProcessing/stripSpaces.js":127}],73:[function(require,module,exports){
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;
var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var matches = getSubheadingContents( text );

	var subHeadings = [];
	forEach( matches, function( subHeading ) {
		subHeading = stripTags( subHeading ).length;
		if ( subHeading > 0 ) {
			subHeadings.push( subHeading );
		}
	} );

	return subHeadings;
};

},{"../stringProcessing/getSubheadings.js":112,"../stringProcessing/stripHTMLTags.js":124,"lodash/forEach":295}],74:[function(require,module,exports){
var getSubheadingsContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there is a subheading present in the text
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {number} Number of headings found.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var headings = getSubheadingsContents( text ) || [];
	return headings.length;
};

},{"../stringProcessing/getSubheadings.js":112}],75:[function(require,module,exports){
var getSubheadingTexts = require( "../stringProcessing/getSubheadingTexts.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var matches = getSubheadingTexts( text );

	var subHeadingTexts = [];
	forEach( matches, function( subHeading ) {

		subHeadingTexts.push( countWords( subHeading ) );
	} );
	return subHeadingTexts;
};


},{"../stringProcessing/countWords.js":103,"../stringProcessing/getSubheadingTexts.js":111,"lodash/forEach":295}],76:[function(require,module,exports){
var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var words = getWords( paper.getText() );
	var wordComplexity = [];
	words.map( function( word ) {
		wordComplexity.push( { word: word, complexity: countSyllables( word ) } );
	} );
	return wordComplexity;
};


},{"../stringProcessing/countSyllables.js":102,"../stringProcessing/getWords.js":113}],77:[function(require,module,exports){
/** @module researches/imageAltTags */

var imageInText = require( "../stringProcessing/imageInText" );
var imageAlttag = require( "../stringProcessing/getAlttagContent" );
var wordMatch = require( "../stringProcessing/matchTextWithWord" );

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function( imageMatches, keyword ) {
	var altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0
	};

	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( keyword === "" && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		if ( wordMatch( alttag, keyword ) === 0 && alttag !== "" ) {

			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( wordMatch( alttag, keyword ) > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}

	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function( paper ) {
	return matchAltProperties( imageInText( paper.getText() ), paper.getKeyword() );
};

},{"../stringProcessing/getAlttagContent":107,"../stringProcessing/imageInText":114,"../stringProcessing/matchTextWithWord":117}],78:[function(require,module,exports){
/** @module researches/imageInText */

var imageInText = require( "./../stringProcessing/imageInText" );

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( paper ) {
	return imageInText( paper.getText() ).length;
};

},{"./../stringProcessing/imageInText":114}],79:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords" );
var sanitizeString = require( "../stringProcessing/sanitizeString" );

/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch( paper ) {
	var keyphrase = sanitizeString( paper.getKeyword() );

	return countWords( keyphrase );
}

module.exports = keyphraseLengthResearch;

},{"../stringProcessing/countWords":103,"../stringProcessing/sanitizeString":121}],80:[function(require,module,exports){
/** @module researches/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword().replace( "'", "" ).replace( /\s/ig, "-" );

	return wordMatch( paper.getUrl(), keyword );
};

},{"../stringProcessing/matchTextWithWord.js":117}],81:[function(require,module,exports){
/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "../stringProcessing/subheadingsMatch.js" );
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword );
	}

	return result;
};


},{"../stringProcessing/getSubheadings.js":112,"../stringProcessing/stripNonTextTags.js":125,"../stringProcessing/subheadingsMatch.js":128}],82:[function(require,module,exports){
var matchTextWithWord = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function( paper ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	return matchTextWithWord( paper.getDescription(), paper.getKeyword() );
};


},{"../stringProcessing/matchTextWithWord.js":117}],83:[function(require,module,exports){
/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */
module.exports = function( paper ) {
	return paper.getDescription().length;
};

},{}],84:[function(require,module,exports){
/**
 * Check the length of the title.
 * @param {Paper} paper The paper object containing the title.
 * @returns {number} The length of the title.
 */
module.exports = function( paper ) {
	return paper.getTitle().length;
};

},{}],85:[function(require,module,exports){
module.exports = function() {
	return [
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};

},{}],86:[function(require,module,exports){
module.exports = function() {
	return [
		"a",
		"an",
		"the",
		"my",
		"her",
		"his",
		"their",
		"its",
		"our",
		"your",
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};


},{}],87:[function(require,module,exports){
module.exports = function() {
	return [
		"arisen",
		"awoken",
		"reawoken",
		"babysat",
		"backslid",
		"backslidden",
		"beat",
		"beaten",
		"become",
		"begun",
		"bent",
		"unbent",
		"bet",
		"bid",
		"outbid",
		"rebid",
		"underbid",
		"overbid",
		"bidden",
		"bitten",
		"blown",
		"bought",
		"overbought",
		"bound",
		"unbound",
		"rebound",
		"broadcast",
		"rebroadcast",
		"broken",
		"brought",
		"browbeat",
		"browbeaten",
		"built",
		"prebuilt",
		"rebuilt",
		"overbuilt",
		"burnt",
		"burst",
		"bust",
		"cast",
		"miscast",
		"recast",
		"caught",
		"chosen",
		"clung",
		"come",
		"overcome",
		"cost",
		"crept",
		"cut",
		"undercut",
		"recut",
		"daydreamt",
		"dealt",
		"misdealt",
		"redealt",
		"disproven",
		"done",
		"predone",
		"outdone",
		"misdone",
		"redone",
		"overdone",
		"undone",
		"drawn",
		"outdrawn",
		"redrawn",
		"overdrawn",
		"dreamt",
		"driven",
		"outdriven",
		"drunk",
		"outdrunk",
		"overdrunk",
		"dug",
		"dwelt",
		"eaten",
		"overeaten",
		"fallen",
		"felt",
		"fit",
		"refit",
		"retrofit",
		"flown",
		"outflown",
		"flung",
		"forbidden",
		"forecast",
		"foregone",
		"foreseen",
		"foretold",
		"forgiven",
		"forgotten",
		"forsaken",
		"fought",
		"outfought",
		"found",
		"frostbitten",
		"frozen",
		"unfrozen",
		"given",
		"gone",
		"undergone",
		"got",
		"gotten",
		"ground",
		"reground",
		"grown",
		"outgrown",
		"regrown",
		"had",
		"handwritten",
		"heard",
		"reheard",
		"misheard",
		"overheard",
		"held",
		"hewn",
		"hidden",
		"unhidden",
		"hit",
		"hung",
		"rehung",
		"overhung",
		"unhung",
		"hurt",
		"inlaid",
		"input",
		"interwound",
		"interwoven",
		"jerry-built",
		"kept",
		"knelt",
		"knit",
		"reknit",
		"unknit",
		"known",
		"laid",
		"mislaid",
		"relaid",
		"overlaid",
		"lain",
		"underlain",
		"leant",
		"leapt",
		"outleapt",
		"learnt",
		"unlearnt",
		"relearnt",
		"mislearnt",
		"left",
		"lent",
		"let",
		"lip-read",
		"lit",
		"relit",
		"lost",
		"made",
		"premade",
		"remade",
		"meant",
		"met",
		"mown",
		"offset",
		"paid",
		"prepaid",
		"repaid",
		"overpaid",
		"partaken",
		"proofread",
		"proven",
		"put",
		"quick-frozen",
		"quit",
		"read",
		"misread",
		"reread",
		"retread",
		"rewaken",
		"rid",
		"ridden",
		"outridden",
		"overridden",
		"risen",
		"roughcast",
		"run",
		"outrun",
		"rerun",
		"overrun",
		"rung",
		"said",
		"sand-cast",
		"sat",
		"outsat",
		"sawn",
		"seen",
		"overseen",
		"sent",
		"resent",
		"set",
		"preset",
		"reset",
		"misset",
		"sewn",
		"resewn",
		"oversewn",
		"unsewn",
		"shaken",
		"shat",
		"shaven",
		"shit",
		"shone",
		"outshone",
		"shorn",
		"shot",
		"outshot",
		"overshot",
		"shown",
		"shrunk",
		"preshrunk",
		"shut",
		"sight-read",
		"slain",
		"slept",
		"outslept",
		"overslept",
		"slid",
		"slit",
		"slung",
		"unslung",
		"slunk",
		"smelt",
		"outsmelt",
		"snuck",
		"sold",
		"undersold",
		"presold",
		"outsold",
		"resold",
		"oversold",
		"sought",
		"sown",
		"spat",
		"spelt",
		"misspelt",
		"spent",
		"underspent",
		"outspent",
		"misspent",
		"overspent",
		"spilt",
		"overspilt",
		"spit",
		"split",
		"spoilt",
		"spoken",
		"outspoken",
		"misspoken",
		"overspoken",
		"spread",
		"sprung",
		"spun",
		"unspun",
		"stolen",
		"stood",
		"understood",
		"misunderstood",
		"strewn",
		"stricken",
		"stridden",
		"striven",
		"struck",
		"strung",
		"unstrung",
		"stuck",
		"unstuck",
		"stung",
		"stunk",
		"sublet",
		"sunburnt",
		"sung",
		"outsung",
		"sunk",
		"sweat",
		"swept",
		"swollen",
		"sworn",
		"outsworn",
		"swum",
		"outswum",
		"swung",
		"taken",
		"undertaken",
		"mistaken",
		"retaken",
		"overtaken",
		"taught",
		"mistaught",
		"retaught",
		"telecast",
		"test-driven",
		"test-flown",
		"thought",
		"outthought",
		"rethought",
		"overthought",
		"thrown",
		"outthrown",
		"overthrown",
		"thrust",
		"told",
		"retold",
		"torn",
		"retorn",
		"trod",
		"trodden",
		"typecast",
		"typeset",
		"upheld",
		"upset",
		"waylaid",
		"wept",
		"wet",
		"rewet",
		"withdrawn",
		"withheld",
		"withstood",
		"woken",
		"won",
		"rewon",
		"worn",
		"reworn",
		"wound",
		"rewound",
		"overwound",
		"unwound",
		"woven",
		"rewoven",
		"unwoven",
		"written",
		"typewritten",
		"underwritten",
		"outwritten",
		"miswritten",
		"rewritten",
		"overwritten",
		"wrung"
	];
};

},{}],88:[function(require,module,exports){
module.exports = function() {
	return [
		"ablebodied",
		"abovementioned",
		"absentminded",
		"accoladed",
		"accompanied",
		"acculturized",
		"accursed",
		"acerated",
		"acerbated",
		"acetylized",
		"achromatised",
		"achromatized",
		"acidified",
		"acned",
		"actualised",
		"adrenalised",
		"adulated",
		"adversed",
		"aestheticised",
		"affectioned",
		"affined",
		"affricated",
		"aforementioned",
		"agerelated",
		"aggrieved",
		"airbed",
		"aircooled",
		"airspeed",
		"alcoholized",
		"alcoved",
		"alkalised",
		"allianced",
		"aluminized",
		"alveolated",
		"ambered",
		"ammonified",
		"amplified",
		"anagrammatised",
		"anagrammatized",
		"anathematised",
		"aniseed",
		"ankled",
		"annualized",
		"anonymised",
		"anthologized",
		"antlered",
		"anucleated",
		"anviled",
		"anvilshaped",
		"apostrophised",
		"apostrophized",
		"appliqued",
		"apprized",
		"arbitrated",
		"armored",
		"articled",
		"ashamed",
		"assented",
		"atomised",
		"atrophied",
		"auricled",
		"auriculated",
		"aurified",
		"autopsied",
		"axled",
		"babied",
		"backhoed",
		"badmannered",
		"badtempered",
		"balustered",
		"baned",
		"barcoded",
		"bareboned",
		"barefooted",
		"barelegged",
		"barnacled",
		"bayoneted",
		"beadyeyed",
		"beaked",
		"beaned",
		"beatified",
		"beautified",
		"beavered",
		"bed",
		"bedamned",
		"bedecked",
		"behoved",
		"belated",
		"bellbottomed",
		"bellshaped",
		"benighted",
		"bequeathed",
		"berried",
		"bespectacled",
		"bewhiskered",
		"bighearted",
		"bigmouthed",
		"bigoted",
		"bindweed",
		"binucleated",
		"biopsied",
		"bioturbed",
		"biped",
		"bipinnated",
		"birdfeed",
		"birdseed",
		"bisegmented",
		"bitterhearted",
		"blabbermouthed",
		"blackhearted",
		"bladed",
		"blankminded",
		"blearyeyed",
		"bleed",
		"blissed",
		"blobbed",
		"blondhaired",
		"bloodied",
		"bloodred",
		"bloodshed",
		"blueblooded",
		"boatshaped",
		"bobsled",
		"bodied",
		"boldhearted",
		"boogied",
		"boosed",
		"bosomed",
		"bottlefed",
		"bottlefeed",
		"bottlenecked",
		"bouldered",
		"bowlegged",
		"bowlshaped",
		"brandied",
		"bravehearted",
		"breastfed",
		"breastfeed",
		"breed",
		"brighteyed",
		"brindled",
		"broadhearted",
		"broadleaved",
		"broadminded",
		"brokenhearted",
		"broomed",
		"broomweed",
		"buccaned",
		"buckskinned",
		"bucktoothed",
		"buddied",
		"buffaloed",
		"bugeyed",
		"bugleweed",
		"bugweed",
		"bulletined",
		"bunked",
		"busied",
		"butterfingered",
		"cabbed",
		"caddied",
		"cairned",
		"calcified",
		"canalized",
		"candied",
		"cannulated",
		"canoed",
		"canopied",
		"canvased",
		"caped",
		"capsulated",
		"cassocked",
		"castellated",
		"catabolised",
		"catheterised",
		"caudated",
		"cellmediated",
		"cellulosed",
		"certified",
		"chagrined",
		"chambered",
		"chested",
		"chevroned",
		"chickenfeed",
		"chickenhearted",
		"chickweed",
		"chilblained",
		"childbed",
		"chinned",
		"chromatographed",
		"ciliated",
		"cindered",
		"cingulated",
		"circumstanced",
		"cisgendered",
		"citrullinated",
		"clappered",
		"clarified",
		"classified",
		"clawshaped",
		"claysized",
		"cleanhearted",
		"clearminded",
		"clearsighted",
		"cliched",
		"clodded",
		"cloistered",
		"closefisted",
		"closehearted",
		"closelipped",
		"closemouthed",
		"closeted",
		"cloudseed",
		"clubfooted",
		"clubshaped",
		"clued",
		"cockeyed",
		"codified",
		"coed",
		"coevolved",
		"coffined",
		"coiffed",
		"coinfected",
		"coldblooded",
		"coldhearted",
		"collateralised",
		"colonialised",
		"colorcoded",
		"colorised",
		"colourised",
		"columned",
		"commoditized",
		"compactified",
		"companioned",
		"complexioned",
		"conceited",
		"concerned",
		"concussed",
		"coneshaped",
		"congested",
		"contented",
		"convexed",
		"coralled",
		"corymbed",
		"cottonseed",
		"countrified",
		"countrybred",
		"courtmartialled",
		"coved",
		"coveralled",
		"cowshed",
		"cozied",
		"cragged",
		"crayoned",
		"credentialed",
		"creed",
		"crenulated",
		"crescentshaped",
		"cressweed",
		"crewed",
		"cricked",
		"crispated",
		"crossbarred",
		"crossbed",
		"crossbred",
		"crossbreed",
		"crossclassified",
		"crosseyed",
		"crossfertilised",
		"crossfertilized",
		"crossindexed",
		"crosslegged",
		"crossshaped",
		"crossstratified",
		"crossstriated",
		"crotched",
		"crucified",
		"cruelhearted",
		"crutched",
		"cubeshaped",
		"cubified",
		"cuckolded",
		"cucumbershaped",
		"cumbered",
		"cuminseed",
		"cupshaped",
		"curated",
		"curded",
		"curfewed",
		"curlicued",
		"curlycued",
		"curried",
		"curtsied",
		"cyclized",
		"cylindershaped",
		"damed",
		"dandified",
		"dangered",
		"darkhearted",
		"daybed",
		"daylighted",
		"deacidified",
		"deacylated",
		"deadhearted",
		"deadlined",
		"deaminized",
		"deathbed",
		"decalcified",
		"decertified",
		"deckbed",
		"declassified",
		"declutched",
		"decolourated",
		"decreed",
		"deed",
		"deeprooted",
		"deepseated",
		"defensed",
		"defied",
		"deflexed",
		"deglamorised",
		"degunkified",
		"dehumidified",
		"deified",
		"deled",
		"delegitimised",
		"demoded",
		"demystified",
		"denasalized",
		"denazified",
		"denied",
		"denitrified",
		"denticulated",
		"deseed",
		"desexualised",
		"desposited",
		"detoxified",
		"deuced",
		"devitrified",
		"dewlapped",
		"dezincified",
		"diagonalised",
		"dialogued",
		"died",
		"digitated",
		"dignified",
		"dilled",
		"dimwitted",
		"diphthonged",
		"disaffected",
		"disaggregated",
		"disarrayed",
		"discalced",
		"discolorated",
		"discolourated",
		"discshaped",
		"diseased",
		"disembodied",
		"disencumbered",
		"disfranchised",
		"diskshaped",
		"disproportionated",
		"disproportioned",
		"disqualified",
		"distempered",
		"districted",
		"diversified",
		"diverticulated",
		"divested",
		"divvied",
		"dizzied",
		"dogged",
		"dogsbodied",
		"dogsled",
		"domeshaped",
		"domiciled",
		"dormered",
		"doublebarrelled",
		"doublestranded",
		"doublewalled",
		"downhearted",
		"duckbilled",
		"eared",
		"echeloned",
		"eddied",
		"edified",
		"eggshaped",
		"elasticated",
		"electrified",
		"elegized",
		"embed",
		"embodied",
		"emceed",
		"empaneled",
		"empanelled",
		"emptyhearted",
		"emulsified",
		"engined",
		"ennobled",
		"envied",
		"enzymecatalysed",
		"enzymecatalyzed",
		"epitomised",
		"epoxidized",
		"epoxied",
		"etherised",
		"etherized",
		"evilhearted",
		"evilminded",
		"exceed",
		"exemplified",
		"exponentiated",
		"expurgated",
		"extravasated",
		"extraverted",
		"extroverted",
		"fabled",
		"facelifted",
		"facsimiled",
		"fainthearted",
		"falcated",
		"falsehearted",
		"falsified",
		"famed",
		"fancified",
		"fanged",
		"fanshaped",
		"fantasied",
		"farsighted",
		"fated",
		"fatted",
		"fazed",
		"featherbed",
		"fed",
		"federalized",
		"feeblehearted",
		"feebleminded",
		"feeblewitted",
		"feed",
		"fendered",
		"fenestrated",
		"ferried",
		"fevered",
		"fibered",
		"fibred",
		"ficklehearted",
		"fiercehearted",
		"figged",
		"filigreed",
		"filterfeed",
		"fireweed",
		"firmhearted",
		"fissured",
		"flanged",
		"flanneled",
		"flannelled",
		"flatbed",
		"flatfooted",
		"flatted",
		"flaxenhaired",
		"flaxseed",
		"flaxweed",
		"flighted",
		"floodgenerated",
		"flowerbed",
		"fluidised",
		"fluidized",
		"flurried",
		"fobbed",
		"fonded",
		"forcefeed",
		"foreshortened",
		"foresighted",
		"forkshaped",
		"formfeed",
		"fortified",
		"fortressed",
		"foulmouthed",
		"foureyed",
		"foxtailed",
		"fractionalised",
		"fractionalized",
		"frankhearted",
		"freed",
		"freehearted",
		"freespirited",
		"frenzied",
		"friezed",
		"frontiered",
		"fructified",
		"frumped",
		"fullblooded",
		"fullbodied",
		"fullfledged",
		"fullhearted",
		"funnelshaped",
		"furnaced",
		"gaitered",
		"galleried",
		"gangliated",
		"ganglionated",
		"gangrened",
		"gargoyled",
		"gasified",
		"gaunted",
		"gauntleted",
		"gauzed",
		"gavelled",
		"gelatinised",
		"gemmed",
		"genderized",
		"gentled",
		"gentlehearted",
		"gerrymandered",
		"gladhearted",
		"glamored",
		"globed",
		"gloried",
		"glorified",
		"glycosylated",
		"goateed",
		"gobletshaped",
		"godspeed",
		"goodhearted",
		"goodhumored",
		"goodhumoured",
		"goodnatured",
		"goodtempered",
		"goosed",
		"goosenecked",
		"goutweed",
		"grainfed",
		"grammaticalized",
		"grapeseed",
		"gratified",
		"graved",
		"gravelbed",
		"grayhaired",
		"greathearted",
		"greed",
		"greenweed",
		"grommeted",
		"groundspeed",
		"groved",
		"gruffed",
		"guiled",
		"gulled",
		"gumshoed",
		"gunkholed",
		"gussied",
		"guyed",
		"gyrostabilized",
		"hackneyed",
		"hagged",
		"haired",
		"halfcivilized",
		"halfhearted",
		"halfwitted",
		"haloed",
		"handballed",
		"handfed",
		"handfeed",
		"hardcoded",
		"hardhearted",
		"hardnosed",
		"hared",
		"harelipped",
		"hasted",
		"hatred",
		"haunched",
		"hawkeyed",
		"hayseed",
		"hayweed",
		"hearsed",
		"hearted",
		"heartshaped",
		"heavenlyminded",
		"heavyfooted",
		"heavyhearted",
		"heed",
		"heired",
		"heisted",
		"helicoptered",
		"helmed",
		"helmeted",
		"hemagglutinated",
		"hemolyzed",
		"hempseed",
		"hempweed",
		"heparinised",
		"heparinized",
		"herbed",
		"highheeled",
		"highminded",
		"highpriced",
		"highspeed",
		"highspirited",
		"hilled",
		"hipped",
		"hispanicised",
		"hocked",
		"hoed",
		"hogweed",
		"holstered",
		"homaged",
		"hoodooed",
		"hoofed",
		"hooknosed",
		"hooved",
		"horned",
		"horrified",
		"horseshoed",
		"horseweed",
		"hotbed",
		"hotblooded",
		"hothearted",
		"hotted",
		"hottempered",
		"hued",
		"humansized",
		"humidified",
		"humped",
		"hundred",
		"hutched",
		"hyperinflated",
		"hyperpigmented",
		"hyperstimulated",
		"hypertrophied",
		"hyphened",
		"hypophysectomised",
		"hypophysectomized",
		"hypopigmented",
		"hypostatised",
		"hysterectomized",
		"iconified",
		"iconised",
		"iconized",
		"ideologised",
		"illbred",
		"illconceived",
		"illdefined",
		"illdisposed",
		"illequipped",
		"illfated",
		"illfavored",
		"illfavoured",
		"illflavored",
		"illfurnished",
		"illhumored",
		"illhumoured",
		"illimited",
		"illmannered",
		"illnatured",
		"illomened",
		"illproportioned",
		"illqualified",
		"illscented",
		"illtempered",
		"illumed",
		"illusioned",
		"imbed",
		"imbossed",
		"imbued",
		"immatured",
		"impassioned",
		"impenetrated",
		"imperfected",
		"imperialised",
		"imperturbed",
		"impowered",
		"imputed",
		"inarticulated",
		"inbred",
		"inbreed",
		"incapsulated",
		"incased",
		"incrustated",
		"incrusted",
		"indebted",
		"indeed",
		"indemnified",
		"indentured",
		"indigested",
		"indisposed",
		"inexperienced",
		"infrared",
		"intensified",
		"intentioned",
		"interbedded",
		"interbred",
		"interbreed",
		"interluded",
		"introverted",
		"inured",
		"inventoried",
		"iodinated",
		"iodised",
		"irked",
		"ironfisted",
		"ironweed",
		"itchweed",
		"ivied",
		"ivyweed",
		"jagged",
		"jellified",
		"jerseyed",
		"jetlagged",
		"jetpropelled",
		"jeweled",
		"jewelled",
		"jewelweed",
		"jiggered",
		"jimmyweed",
		"jimsonweed",
		"jointweed",
		"joyweed",
		"jungled",
		"juried",
		"justiceweed",
		"justified",
		"karstified",
		"kerchiefed",
		"kettleshaped",
		"kibbled",
		"kidneyshaped",
		"kimonoed",
		"kindhearted",
		"kindred",
		"kingsized",
		"kirtled",
		"knacked",
		"knapweed",
		"kneed",
		"knobbed",
		"knobweed",
		"knopweed",
		"knotweed",
		"lakebed",
		"lakeweed",
		"lamed",
		"lamellated",
		"lanceshaped",
		"lanceted",
		"landbased",
		"lapeled",
		"lapelled",
		"largehearted",
		"lariated",
		"lased",
		"latticed",
		"lauded",
		"lavaged",
		"lavendered",
		"lawned",
		"led",
		"lefteyed",
		"legitimatised",
		"legitimatized",
		"leisured",
		"lensshaped",
		"leveed",
		"levied",
		"lichened",
		"lichenized",
		"lidded",
		"lifesized",
		"lightfingered",
		"lightfooted",
		"lighthearted",
		"lightminded",
		"lightspeed",
		"lignified",
		"likeminded",
		"lilylivered",
		"limbed",
		"linearised",
		"linearized",
		"linefeed",
		"linseed",
		"lionhearted",
		"liquefied",
		"liquified",
		"lithified",
		"liveried",
		"lobbied",
		"locoweed",
		"longarmed",
		"longhaired",
		"longhorned",
		"longlegged",
		"longnecked",
		"longsighted",
		"longwinded",
		"lopsided",
		"loudmouthed",
		"louvered",
		"louvred",
		"lowbred",
		"lowpriced",
		"lowspirited",
		"lozenged",
		"lunated",
		"lyrated",
		"lysinated",
		"maced",
		"macroaggregated",
		"macrodissected",
		"maculated",
		"madweed",
		"magnified",
		"maidenweed",
		"maladapted",
		"maladjusted",
		"malnourished",
		"malrotated",
		"maned",
		"mannered",
		"manuevered",
		"manyhued",
		"manyshaped",
		"manysided",
		"masted",
		"mealymouthed",
		"meanspirited",
		"membered",
		"membraned",
		"metaled",
		"metalized",
		"metallised",
		"metallized",
		"metamerized",
		"metathesized",
		"meted",
		"methylated",
		"mettled",
		"microbrecciated",
		"microminiaturized",
		"microstratified",
		"middleaged",
		"midsized",
		"miffed",
		"mildhearted",
		"milkweed",
		"miniskirted",
		"misactivated",
		"misaligned",
		"mischiefed",
		"misclassified",
		"misdeed",
		"misdemeaned",
		"mismannered",
		"misnomered",
		"misproportioned",
		"miswired",
		"mitred",
		"mitted",
		"mittened",
		"moneyed",
		"monocled",
		"mononucleated",
		"monospaced",
		"monotoned",
		"monounsaturated",
		"mortified",
		"moseyed",
		"motorised",
		"motorized",
		"moussed",
		"moustached",
		"muddied",
		"mugweed",
		"multiarmed",
		"multibarreled",
		"multibladed",
		"multicelled",
		"multichambered",
		"multichanneled",
		"multichannelled",
		"multicoated",
		"multidirected",
		"multiengined",
		"multifaceted",
		"multilaminated",
		"multilaned",
		"multilayered",
		"multilobed",
		"multilobulated",
		"multinucleated",
		"multipronged",
		"multisegmented",
		"multisided",
		"multispeed",
		"multistemmed",
		"multistoried",
		"multitalented",
		"multitoned",
		"multitowered",
		"multivalued",
		"mummied",
		"mummified",
		"mustached",
		"mustachioed",
		"mutinied",
		"myelinated",
		"mystified",
		"mythicised",
		"naked",
		"narcotised",
		"narrowminded",
		"natured",
		"neaped",
		"nearsighted",
		"necrosed",
		"nectared",
		"need",
		"needleshaped",
		"newfangled",
		"newlywed",
		"nibbed",
		"nimblewitted",
		"nippled",
		"nixed",
		"nobled",
		"noduled",
		"noised",
		"nonaccented",
		"nonactivated",
		"nonadsorbed",
		"nonadulterated",
		"nonaerated",
		"nonaffiliated",
		"nonaliased",
		"nonalienated",
		"nonaligned",
		"nonarchived",
		"nonarmored",
		"nonassociated",
		"nonattenuated",
		"nonblackened",
		"nonbreastfed",
		"nonbrecciated",
		"nonbuffered",
		"nonbuttered",
		"noncarbonated",
		"noncarbonized",
		"noncatalogued",
		"noncatalyzed",
		"noncategorized",
		"noncertified",
		"nonchlorinated",
		"nonciliated",
		"noncircumcised",
		"noncivilized",
		"nonclassified",
		"noncoated",
		"noncodified",
		"noncoerced",
		"noncommercialized",
		"noncommissioned",
		"noncompacted",
		"noncompiled",
		"noncomplicated",
		"noncomposed",
		"noncomputed",
		"noncomputerized",
		"nonconcerted",
		"nonconditioned",
		"nonconfirmed",
		"noncongested",
		"nonconjugated",
		"noncooled",
		"noncorrugated",
		"noncoupled",
		"noncreated",
		"noncrowded",
		"noncultured",
		"noncurated",
		"noncushioned",
		"nondecoded",
		"nondecomposed",
		"nondedicated",
		"nondeferred",
		"nondeflated",
		"nondegenerated",
		"nondegraded",
		"nondelegated",
		"nondelimited",
		"nondelineated",
		"nondemarcated",
		"nondeodorized",
		"nondeployed",
		"nonderivatized",
		"nonderived",
		"nondetached",
		"nondetailed",
		"nondifferentiated",
		"nondigested",
		"nondigitized",
		"nondilapidated",
		"nondilated",
		"nondimensionalised",
		"nondimensionalized",
		"nondirected",
		"nondisabled",
		"nondisciplined",
		"nondispersed",
		"nondisputed",
		"nondisqualified",
		"nondisrupted",
		"nondisseminated",
		"nondissipated",
		"nondissolved",
		"nondistressed",
		"nondistributed",
		"nondiversified",
		"nondiverted",
		"nondocumented",
		"nondomesticated",
		"nondoped",
		"nondrafted",
		"nondrugged",
		"nondubbed",
		"nonducted",
		"nonearthed",
		"noneclipsed",
		"nonedged",
		"nonedited",
		"nonelasticized",
		"nonelectrified",
		"nonelectroplated",
		"nonelectroporated",
		"nonelevated",
		"noneliminated",
		"nonelongated",
		"nonembedded",
		"nonembodied",
		"nonemphasized",
		"nonencapsulated",
		"nonencoded",
		"nonencrypted",
		"nonendangered",
		"nonengraved",
		"nonenlarged",
		"nonenriched",
		"nonentangled",
		"nonentrenched",
		"nonepithelized",
		"nonequilibrated",
		"nonestablished",
		"nonetched",
		"nonethoxylated",
		"nonethylated",
		"nonetiolated",
		"nonexaggerated",
		"nonexcavated",
		"nonexhausted",
		"nonexperienced",
		"nonexpired",
		"nonfabricated",
		"nonfalsified",
		"nonfeathered",
		"nonfeatured",
		"nonfed",
		"nonfederated",
		"nonfeed",
		"nonfenestrated",
		"nonfertilized",
		"nonfilamented",
		"nonfinanced",
		"nonfinished",
		"nonfinned",
		"nonfissured",
		"nonflagellated",
		"nonflagged",
		"nonflared",
		"nonflavored",
		"nonfluidized",
		"nonfluorinated",
		"nonfluted",
		"nonforested",
		"nonformalized",
		"nonformatted",
		"nonfragmented",
		"nonfragranced",
		"nonfranchised",
		"nonfreckled",
		"nonfueled",
		"nonfumigated",
		"nonfunctionalized",
		"nonfunded",
		"nongalvanized",
		"nongated",
		"nongelatinized",
		"nongendered",
		"nongeneralized",
		"nongenerated",
		"nongifted",
		"nonglazed",
		"nonglucosated",
		"nonglucosylated",
		"nonglycerinated",
		"nongraded",
		"nongrounded",
		"nonhalogenated",
		"nonhandicapped",
		"nonhospitalised",
		"nonhospitalized",
		"nonhydrated",
		"nonincorporated",
		"nonindexed",
		"noninfected",
		"noninfested",
		"noninitialized",
		"noninitiated",
		"noninoculated",
		"noninseminated",
		"noninstitutionalized",
		"noninsured",
		"nonintensified",
		"noninterlaced",
		"noninterpreted",
		"nonintroverted",
		"noninvestigated",
		"noninvolved",
		"nonirrigated",
		"nonisolated",
		"nonisomerized",
		"nonissued",
		"nonitalicized",
		"nonitemized",
		"noniterated",
		"nonjaded",
		"nonlabelled",
		"nonlaminated",
		"nonlateralized",
		"nonlayered",
		"nonlegalized",
		"nonlegislated",
		"nonlesioned",
		"nonlexicalized",
		"nonliberated",
		"nonlichenized",
		"nonlighted",
		"nonlignified",
		"nonlimited",
		"nonlinearized",
		"nonlinked",
		"nonlobed",
		"nonlobotomized",
		"nonlocalized",
		"nonlysed",
		"nonmachined",
		"nonmalnourished",
		"nonmandated",
		"nonmarginalized",
		"nonmassaged",
		"nonmatriculated",
		"nonmatted",
		"nonmatured",
		"nonmechanized",
		"nonmedicated",
		"nonmedullated",
		"nonmentioned",
		"nonmetabolized",
		"nonmetallized",
		"nonmetastasized",
		"nonmetered",
		"nonmethoxylated",
		"nonmilled",
		"nonmineralized",
		"nonmirrored",
		"nonmodeled",
		"nonmoderated",
		"nonmodified",
		"nonmonetized",
		"nonmonitored",
		"nonmortgaged",
		"nonmotorized",
		"nonmottled",
		"nonmounted",
		"nonmultithreaded",
		"nonmutilated",
		"nonmyelinated",
		"nonnormalized",
		"nonnucleated",
		"nonobjectified",
		"nonobligated",
		"nonoccupied",
		"nonoiled",
		"nonopinionated",
		"nonoxygenated",
		"nonpaginated",
		"nonpaired",
		"nonparalyzed",
		"nonparameterized",
		"nonparasitized",
		"nonpasteurized",
		"nonpatterned",
		"nonphased",
		"nonphosphatized",
		"nonphosphorized",
		"nonpierced",
		"nonpigmented",
		"nonpiloted",
		"nonpipelined",
		"nonpitted",
		"nonplussed",
		"nonpuffed",
		"nonrandomized",
		"nonrated",
		"nonrefined",
		"nonregistered",
		"nonregulated",
		"nonrelated",
		"nonretarded",
		"nonsacred",
		"nonsalaried",
		"nonsanctioned",
		"nonsaturated",
		"nonscented",
		"nonscheduled",
		"nonseasoned",
		"nonsecluded",
		"nonsegmented",
		"nonsegregated",
		"nonselected",
		"nonsolidified",
		"nonspecialized",
		"nonspored",
		"nonstandardised",
		"nonstandardized",
		"nonstratified",
		"nonstressed",
		"nonstriated",
		"nonstriped",
		"nonstructured",
		"nonstylised",
		"nonstylized",
		"nonsubmerged",
		"nonsubscripted",
		"nonsubsidised",
		"nonsubsidized",
		"nonsubstituted",
		"nonsyndicated",
		"nonsynthesised",
		"nontabulated",
		"nontalented",
		"nonthreaded",
		"nontinted",
		"nontolerated",
		"nontranslated",
		"nontunnelled",
		"nonunified",
		"nonunionised",
		"nonupholstered",
		"nonutilised",
		"nonutilized",
		"nonvalued",
		"nonvaried",
		"nonverbalized",
		"nonvitrified",
		"nonvolatilised",
		"nonvolatilized",
		"normed",
		"nosebleed",
		"notated",
		"notified",
		"nuanced",
		"nullified",
		"numerated",
		"oarweed",
		"objectified",
		"obliqued",
		"obtunded",
		"occupied",
		"octupled",
		"odored",
		"oilseed",
		"oinked",
		"oldfashioned",
		"onesided",
		"oophorectomized",
		"opaqued",
		"openhearted",
		"openminded",
		"openmouthed",
		"opiated",
		"opinionated",
		"oracled",
		"oreweed",
		"ossified",
		"outbreed",
		"outmoded",
		"outrigged",
		"outriggered",
		"outsized",
		"outskated",
		"outspeed",
		"outtopped",
		"outtrumped",
		"outvoiced",
		"outweed",
		"ovated",
		"overadorned",
		"overaged",
		"overalled",
		"overassured",
		"overbred",
		"overbreed",
		"overcomplicated",
		"overdamped",
		"overdetailed",
		"overdiversified",
		"overdyed",
		"overequipped",
		"overfatigued",
		"overfed",
		"overfeed",
		"overindebted",
		"overintensified",
		"overinventoried",
		"overmagnified",
		"overmodified",
		"overpreoccupied",
		"overprivileged",
		"overproportionated",
		"overqualified",
		"overseed",
		"oversexed",
		"oversimplified",
		"oversized",
		"oversophisticated",
		"overstudied",
		"oversulfated",
		"ovicelled",
		"ovoidshaped",
		"ozonated",
		"pacified",
		"packeted",
		"palatalized",
		"paled",
		"palsied",
		"paned",
		"panicled",
		"parabled",
		"parallelepiped",
		"parallelized",
		"parallelopiped",
		"parenthesised",
		"parodied",
		"parqueted",
		"passioned",
		"paunched",
		"pauperised",
		"pedigreed",
		"pedimented",
		"pedunculated",
		"pegged",
		"peglegged",
		"penanced",
		"pencilshaped",
		"permineralized",
		"personified",
		"petrified",
		"photodissociated",
		"photoduplicated",
		"photoed",
		"photoinduced",
		"photolysed",
		"photolyzed",
		"pied",
		"pigeoned",
		"pigtailed",
		"pigweed",
		"pilastered",
		"pillared",
		"pilloried",
		"pimpled",
		"pinealectomised",
		"pinealectomized",
		"pinfeathered",
		"pinnacled",
		"pinstriped",
		"pixellated",
		"pixilated",
		"pixillated",
		"plainclothed",
		"plantarflexed",
		"pled",
		"plumaged",
		"pocked",
		"pokeweed",
		"polychlorinated",
		"polyunsaturated",
		"ponytailed",
		"pooched",
		"poorspirited",
		"popeyed",
		"poppyseed",
		"porcelainized",
		"porched",
		"poshed",
		"pottered",
		"poxed",
		"preachified",
		"precertified",
		"preclassified",
		"preconized",
		"preinoculated",
		"premed",
		"prenotified",
		"preoccupied",
		"preposed",
		"prequalified",
		"preshaped",
		"presignified",
		"prespecified",
		"prettified",
		"pried",
		"principled",
		"proceed",
		"prophesied",
		"propounded",
		"prosed",
		"protonated",
		"proudhearted",
		"proxied",
		"pulpified",
		"pumpkinseed",
		"puppied",
		"purebred",
		"pured",
		"pureed",
		"purified",
		"pustuled",
		"putrefied",
		"pyjamaed",
		"quadruped",
		"qualified",
		"quantified",
		"quantised",
		"quantized",
		"quarried",
		"queried",
		"questoned",
		"quicktempered",
		"quickwitted",
		"quiesced",
		"quietened",
		"quizzified",
		"racemed",
		"radiosensitised",
		"ragweed",
		"raindrenched",
		"ramped",
		"rapeseed",
		"rarefied",
		"rarified",
		"ratified",
		"razoredged",
		"reaccelerated",
		"reaccompanied",
		"reachieved",
		"reacknowledged",
		"readdicted",
		"readied",
		"reamplified",
		"reannealed",
		"reassociated",
		"rebadged",
		"rebiopsied",
		"recabled",
		"recategorised",
		"receipted",
		"recentred",
		"recertified",
		"rechoreographed",
		"reclarified",
		"reclassified",
		"reconferred",
		"recrystalized",
		"rectified",
		"recursed",
		"redblooded",
		"redefied",
		"redenied",
		"rednecked",
		"redshifted",
		"redweed",
		"redyed",
		"reed",
		"reembodied",
		"reenlighted",
		"refeed",
		"refereed",
		"reflexed",
		"refortified",
		"refronted",
		"refuged",
		"reglorified",
		"reimpregnated",
		"reinitialized",
		"rejustified",
		"reliquefied",
		"remedied",
		"remodified",
		"remonetized",
		"remythologized",
		"renotified",
		"renullified",
		"renumerated",
		"reoccupied",
		"repacified",
		"repurified",
		"reputed",
		"requalified",
		"rescinded",
		"reseed",
		"reshoed",
		"resolidified",
		"resorbed",
		"respecified",
		"restudied",
		"retabulated",
		"reticulated",
		"retinted",
		"retreed",
		"retroacted",
		"reunified",
		"reverified",
		"revested",
		"revivified",
		"rewed",
		"ridgepoled",
		"riffled",
		"rightminded",
		"rigidified",
		"rinded",
		"riped",
		"rited",
		"ritualised",
		"riverbed",
		"rivered",
		"roached",
		"roadbed",
		"robotised",
		"robotized",
		"romanized",
		"rosetted",
		"rosined",
		"roughhearted",
		"rubied",
		"ruddied",
		"runcinated",
		"russeted",
		"sabled",
		"sabred",
		"sabretoothed",
		"sacheted",
		"sacred",
		"saddlebred",
		"sainted",
		"salaried",
		"samoyed",
		"sanctified",
		"satellited",
		"savvied",
		"sawtoothed",
		"scandalled",
		"scarified",
		"scarped",
		"sceptred",
		"scissored",
		"screed",
		"screwshaped",
		"scrupled",
		"sculked",
		"scurried",
		"scuttled",
		"seabed",
		"seaweed",
		"seed",
		"seedbed",
		"selfassured",
		"selforganized",
		"semicivilized",
		"semidetached",
		"semidisassembled",
		"semidomesticated",
		"semipetrified",
		"semipronated",
		"semirefined",
		"semivitrified",
		"sentineled",
		"sepaled",
		"sepalled",
		"sequinned",
		"sexed",
		"shagged",
		"shaggycoated",
		"shaggyhaired",
		"shaled",
		"shammed",
		"sharpangled",
		"sharpclawed",
		"sharpcornered",
		"sharpeared",
		"sharpedged",
		"sharpeyed",
		"sharpflavored",
		"sharplimbed",
		"sharpnosed",
		"sharpsighted",
		"sharptailed",
		"sharptongued",
		"sharptoothed",
		"sharpwitted",
		"sharpworded",
		"shed",
		"shellbed",
		"shieldshaped",
		"shimmied",
		"shinned",
		"shirted",
		"shirtsleeved",
		"shoed",
		"shortbeaked",
		"shortbilled",
		"shortbodied",
		"shorthaired",
		"shortlegged",
		"shortlimbed",
		"shortnecked",
		"shortnosed",
		"shortsighted",
		"shortsleeved",
		"shortsnouted",
		"shortstaffed",
		"shorttailed",
		"shorttempered",
		"shorttoed",
		"shorttongued",
		"shortwinded",
		"shortwinged",
		"shotted",
		"shred",
		"shrewsized",
		"shrined",
		"shrinkproofed",
		"sickbed",
		"sickleshaped",
		"sickleweed",
		"signalised",
		"signified",
		"silicified",
		"siliconized",
		"silkweed",
		"siltsized",
		"silvertongued",
		"simpleminded",
		"simplified",
		"singlebarreled",
		"singlebarrelled",
		"singlebed",
		"singlebladed",
		"singlebreasted",
		"singlecelled",
		"singlefooted",
		"singlelayered",
		"singleminded",
		"singleseeded",
		"singleshelled",
		"singlestranded",
		"singlevalued",
		"sissified",
		"sistered",
		"sixgilled",
		"sixmembered",
		"sixsided",
		"sixstoried",
		"skulled",
		"slickered",
		"slipcased",
		"slowpaced",
		"slowwitted",
		"slurried",
		"smallminded",
		"smoothened",
		"smoothtongued",
		"snaggletoothed",
		"snouted",
		"snowballed",
		"snowcapped",
		"snowshed",
		"snowshoed",
		"snubnosed",
		"so-called",
		"sofabed",
		"softhearted",
		"sogged",
		"soled",
		"solidified",
		"soliped",
		"sorbed",
		"souled",
		"spearshaped",
		"specified",
		"spectacled",
		"sped",
		"speeched",
		"speechified",
		"speed",
		"spied",
		"spiffied",
		"spindleshaped",
		"spiritualised",
		"spirted",
		"splayfooted",
		"spoonfed",
		"spoonfeed",
		"spoonshaped",
		"spreadeagled",
		"squarejawed",
		"squareshaped",
		"squareshouldered",
		"squaretoed",
		"squeegeed",
		"staled",
		"starshaped",
		"starspangled",
		"starstudded",
		"statechartered",
		"statesponsored",
		"statued",
		"steadied",
		"steampowered",
		"steed",
		"steelhearted",
		"steepled",
		"sterned",
		"stiffnecked",
		"stilettoed",
		"stimied",
		"stinkweed",
		"stirrupshaped",
		"stockinged",
		"storeyed",
		"storied",
		"stouthearted",
		"straitlaced",
		"stratified",
		"strawberryflavored",
		"streambed",
		"stressinduced",
		"stretchered",
		"strictured",
		"strongbodied",
		"strongboned",
		"strongflavored",
		"stronghearted",
		"stronglimbed",
		"strongminded",
		"strongscented",
		"strongwilled",
		"stubbled",
		"studied",
		"stultified",
		"stupefied",
		"styed",
		"stymied",
		"subclassified",
		"subcommissioned",
		"subminiaturised",
		"subsaturated",
		"subulated",
		"suburbanised",
		"suburbanized",
		"suburbed",
		"succeed",
		"sueded",
		"sugarrelated",
		"sulfurized",
		"sunbed",
		"superhardened",
		"superinfected",
		"supersimplified",
		"surefooted",
		"sweetscented",
		"swifted",
		"swordshaped",
		"syllabified",
		"syphilized",
		"tabularized",
		"talented",
		"tarpapered",
		"tautomerized",
		"teated",
		"teed",
		"teenaged",
		"teetotaled",
		"tenderhearted",
		"tentacled",
		"tenured",
		"termed",
		"ternated",
		"testbed",
		"testified",
		"theatricalised",
		"theatricalized",
		"themed",
		"thicketed",
		"thickskinned",
		"thickwalled",
		"thighed",
		"thimbled",
		"thimblewitted",
		"thonged",
		"thoroughbred",
		"thralled",
		"threated",
		"throated",
		"throughbred",
		"thyroidectomised",
		"thyroidectomized",
		"tiaraed",
		"ticktocked",
		"tidied",
		"tightassed",
		"tightfisted",
		"tightlipped",
		"timehonoured",
		"tindered",
		"tined",
		"tinselled",
		"tippytoed",
		"tiptoed",
		"titled",
		"toed",
		"tomahawked",
		"tonged",
		"toolshed",
		"toothplated",
		"toplighted",
		"torchlighted",
		"toughhearted",
		"traditionalized",
		"trajected",
		"tranced",
		"transgendered",
		"transliterated",
		"translocated",
		"transmogrified",
		"treadled",
		"treed",
		"treelined",
		"tressed",
		"trialled",
		"triangled",
		"trifoliated",
		"trifoliolated",
		"trilobed",
		"trucklebed",
		"truehearted",
		"trumpetshaped",
		"trumpetweed",
		"tuberculated",
		"tumbleweed",
		"tunnelshaped",
		"turbaned",
		"turreted",
		"turtlenecked",
		"tuskshaped",
		"tweed",
		"twigged",
		"typified",
		"ulcered",
		"ultracivilised",
		"ultracivilized",
		"ultracooled",
		"ultradignified",
		"ultradispersed",
		"ultrafiltered",
		"ultrared",
		"ultrasimplified",
		"ultrasophisticated",
		"unabandoned",
		"unabashed",
		"unabbreviated",
		"unabetted",
		"unabolished",
		"unaborted",
		"unabraded",
		"unabridged",
		"unabsolved",
		"unabsorbed",
		"unaccelerated",
		"unaccented",
		"unaccentuated",
		"unacclimatised",
		"unacclimatized",
		"unaccompanied",
		"unaccomplished",
		"unaccosted",
		"unaccredited",
		"unaccrued",
		"unaccumulated",
		"unaccustomed",
		"unacidulated",
		"unacquainted",
		"unacquitted",
		"unactivated",
		"unactuated",
		"unadapted",
		"unaddicted",
		"unadjourned",
		"unadjudicated",
		"unadjusted",
		"unadmonished",
		"unadopted",
		"unadored",
		"unadorned",
		"unadsorbed",
		"unadulterated",
		"unadvertised",
		"unaerated",
		"unaffiliated",
		"unaggregated",
		"unagitated",
		"unaimed",
		"unaired",
		"unaliased",
		"unalienated",
		"unaligned",
		"unallocated",
		"unalloyed",
		"unalphabetized",
		"unamassed",
		"unamortized",
		"unamplified",
		"unanaesthetised",
		"unanaesthetized",
		"unaneled",
		"unanesthetised",
		"unanesthetized",
		"unangered",
		"unannealed",
		"unannexed",
		"unannihilated",
		"unannotated",
		"unanointed",
		"unanticipated",
		"unappareled",
		"unappendaged",
		"unapportioned",
		"unapprenticed",
		"unapproached",
		"unappropriated",
		"unarbitrated",
		"unarched",
		"unarchived",
		"unarmored",
		"unarmoured",
		"unarticulated",
		"unascertained",
		"unashamed",
		"unaspirated",
		"unassembled",
		"unasserted",
		"unassessed",
		"unassociated",
		"unassorted",
		"unassuaged",
		"unastonished",
		"unastounded",
		"unatoned",
		"unattained",
		"unattainted",
		"unattenuated",
		"unattributed",
		"unauctioned",
		"unaudited",
		"unauthenticated",
		"unautographed",
		"unaverted",
		"unawaked",
		"unawakened",
		"unawarded",
		"unawed",
		"unbaffled",
		"unbaited",
		"unbalconied",
		"unbanded",
		"unbanished",
		"unbaptised",
		"unbaptized",
		"unbarreled",
		"unbarrelled",
		"unbattered",
		"unbeaded",
		"unbearded",
		"unbeneficed",
		"unbesotted",
		"unbetrayed",
		"unbetrothed",
		"unbiased",
		"unbiassed",
		"unbigoted",
		"unbilled",
		"unblackened",
		"unblanketed",
		"unblasphemed",
		"unblazoned",
		"unblistered",
		"unblockaded",
		"unbloodied",
		"unbodied",
		"unbonded",
		"unbothered",
		"unbounded",
		"unbracketed",
		"unbranded",
		"unbreaded",
		"unbrewed",
		"unbridged",
		"unbridled",
		"unbroached",
		"unbudgeted",
		"unbuffed",
		"unbuffered",
		"unburnished",
		"unbutchered",
		"unbuttered",
		"uncached",
		"uncaked",
		"uncalcified",
		"uncalibrated",
		"uncamouflaged",
		"uncamphorated",
		"uncanceled",
		"uncancelled",
		"uncapitalized",
		"uncarbonated",
		"uncarpeted",
		"uncased",
		"uncashed",
		"uncastrated",
		"uncatalogued",
		"uncatalysed",
		"uncatalyzed",
		"uncategorised",
		"uncatered",
		"uncaulked",
		"uncelebrated",
		"uncensored",
		"uncensured",
		"uncertified",
		"unchambered",
		"unchanneled",
		"unchannelled",
		"unchaperoned",
		"uncharacterized",
		"uncharted",
		"unchartered",
		"unchastened",
		"unchastised",
		"unchelated",
		"uncherished",
		"unchilled",
		"unchristened",
		"unchronicled",
		"uncircumcised",
		"uncircumscribed",
		"uncited",
		"uncivilised",
		"uncivilized",
		"unclarified",
		"unclassed",
		"unclassified",
		"uncleaved",
		"unclimbed",
		"unclustered",
		"uncluttered",
		"uncoagulated",
		"uncoded",
		"uncodified",
		"uncoerced",
		"uncoined",
		"uncollapsed",
		"uncollated",
		"uncolonised",
		"uncolonized",
		"uncolumned",
		"uncombined",
		"uncommented",
		"uncommercialised",
		"uncommercialized",
		"uncommissioned",
		"uncommitted",
		"uncompacted",
		"uncompartmentalized",
		"uncompartmented",
		"uncompensated",
		"uncompiled",
		"uncomplicated",
		"uncompounded",
		"uncomprehened",
		"uncomputed",
		"unconcealed",
		"unconceded",
		"unconcluded",
		"uncondensed",
		"unconditioned",
		"unconfined",
		"unconfirmed",
		"uncongested",
		"unconglomerated",
		"uncongratulated",
		"unconjugated",
		"unconquered",
		"unconsecrated",
		"unconsoled",
		"unconsolidated",
		"unconstipated",
		"unconstricted",
		"unconstructed",
		"unconsumed",
		"uncontacted",
		"uncontracted",
		"uncontradicted",
		"uncontrived",
		"unconverted",
		"unconveyed",
		"unconvicted",
		"uncooked",
		"uncooled",
		"uncoordinated",
		"uncopyrighted",
		"uncored",
		"uncorrelated",
		"uncorroborated",
		"uncosted",
		"uncounseled",
		"uncounselled",
		"uncounterfeited",
		"uncoveted",
		"uncrafted",
		"uncramped",
		"uncrannied",
		"uncrazed",
		"uncreamed",
		"uncreased",
		"uncreated",
		"uncredentialled",
		"uncredited",
		"uncrested",
		"uncrevassed",
		"uncrippled",
		"uncriticised",
		"uncriticized",
		"uncropped",
		"uncrosslinked",
		"uncrowded",
		"uncrucified",
		"uncrumbled",
		"uncrystalized",
		"uncrystallised",
		"uncrystallized",
		"uncubed",
		"uncuddled",
		"uncued",
		"unculled",
		"uncultivated",
		"uncultured",
		"uncupped",
		"uncurated",
		"uncurbed",
		"uncurried",
		"uncurtained",
		"uncushioned",
		"undamped",
		"undampened",
		"undappled",
		"undarkened",
		"undated",
		"undaubed",
		"undazzled",
		"undeadened",
		"undeafened",
		"undebated",
		"undebunked",
		"undeceased",
		"undecimalized",
		"undeciphered",
		"undecked",
		"undeclared",
		"undecomposed",
		"undeconstructed",
		"undedicated",
		"undefeated",
		"undeferred",
		"undefied",
		"undefined",
		"undeflected",
		"undefrauded",
		"undefrayed",
		"undegassed",
		"undejected",
		"undelegated",
		"undeleted",
		"undelimited",
		"undelineated",
		"undemented",
		"undemolished",
		"undemonstrated",
		"undenatured",
		"undenied",
		"undented",
		"undeodorized",
		"undepicted",
		"undeputized",
		"underaged",
		"underarmed",
		"underassessed",
		"underbred",
		"underbudgeted",
		"undercapitalised",
		"undercapitalized",
		"underdiagnosed",
		"underdocumented",
		"underequipped",
		"underexploited",
		"underexplored",
		"underfed",
		"underfeed",
		"underfurnished",
		"undergoverned",
		"undergrazed",
		"underinflated",
		"underinsured",
		"underinvested",
		"underived",
		"undermaintained",
		"undermentioned",
		"undermotivated",
		"underperceived",
		"underpowered",
		"underprivileged",
		"underqualified",
		"underrehearsed",
		"underresourced",
		"underripened",
		"undersaturated",
		"undersexed",
		"undersized",
		"underspecified",
		"understaffed",
		"understocked",
		"understressed",
		"understudied",
		"underutilised",
		"underventilated",
		"undescaled",
		"undesignated",
		"undetached",
		"undetailed",
		"undetained",
		"undeteriorated",
		"undeterred",
		"undetonated",
		"undevised",
		"undevoted",
		"undevoured",
		"undiagnosed",
		"undialed",
		"undialysed",
		"undialyzed",
		"undiapered",
		"undiffracted",
		"undigested",
		"undignified",
		"undiluted",
		"undiminished",
		"undimmed",
		"undipped",
		"undirected",
		"undisciplined",
		"undiscouraged",
		"undiscussed",
		"undisfigured",
		"undisguised",
		"undisinfected",
		"undismayed",
		"undisposed",
		"undisproved",
		"undisputed",
		"undisrupted",
		"undissembled",
		"undissipated",
		"undissociated",
		"undissolved",
		"undistilled",
		"undistorted",
		"undistracted",
		"undistributed",
		"undisturbed",
		"undiversified",
		"undiverted",
		"undivulged",
		"undoctored",
		"undocumented",
		"undomesticated",
		"undosed",
		"undramatised",
		"undrilled",
		"undrugged",
		"undubbed",
		"unduplicated",
		"uneclipsed",
		"unedged",
		"unedited",
		"unejaculated",
		"unejected",
		"unelaborated",
		"unelapsed",
		"unelected",
		"unelectrified",
		"unelevated",
		"unelongated",
		"unelucidated",
		"unemaciated",
		"unemancipated",
		"unemasculated",
		"unembalmed",
		"unembed",
		"unembellished",
		"unembodied",
		"unemboldened",
		"unemerged",
		"unenacted",
		"unencoded",
		"unencrypted",
		"unencumbered",
		"unendangered",
		"unendorsed",
		"unenergized",
		"unenfranchised",
		"unengraved",
		"unenhanced",
		"unenlarged",
		"unenlivened",
		"unenraptured",
		"unenriched",
		"unentangled",
		"unentitled",
		"unentombed",
		"unentranced",
		"unentwined",
		"unenumerated",
		"unenveloped",
		"unenvied",
		"unequaled",
		"unequalised",
		"unequalized",
		"unequalled",
		"unequipped",
		"unerased",
		"unerected",
		"uneroded",
		"unerupted",
		"unescorted",
		"unestablished",
		"unevaluated",
		"unexaggerated",
		"unexampled",
		"unexcavated",
		"unexceeded",
		"unexcelled",
		"unexecuted",
		"unexerted",
		"unexhausted",
		"unexpensed",
		"unexperienced",
		"unexpired",
		"unexploited",
		"unexplored",
		"unexposed",
		"unexpurgated",
		"unextinguished",
		"unfabricated",
		"unfaceted",
		"unfanned",
		"unfashioned",
		"unfathered",
		"unfathomed",
		"unfattened",
		"unfavored",
		"unfavoured",
		"unfazed",
		"unfeathered",
		"unfed",
		"unfeigned",
		"unfermented",
		"unfertilised",
		"unfertilized",
		"unfilleted",
		"unfiltered",
		"unfinished",
		"unflavored",
		"unflavoured",
		"unflawed",
		"unfledged",
		"unfleshed",
		"unflurried",
		"unflushed",
		"unflustered",
		"unfluted",
		"unfocussed",
		"unforested",
		"unformatted",
		"unformulated",
		"unfortified",
		"unfractionated",
		"unfractured",
		"unfragmented",
		"unfrequented",
		"unfretted",
		"unfrosted",
		"unfueled",
		"unfunded",
		"unfurnished",
		"ungarbed",
		"ungarmented",
		"ungarnished",
		"ungeared",
		"ungerminated",
		"ungifted",
		"unglazed",
		"ungoverned",
		"ungraded",
		"ungrasped",
		"ungratified",
		"ungroomed",
		"ungrounded",
		"ungrouped",
		"ungummed",
		"ungusseted",
		"unhabituated",
		"unhampered",
		"unhandicapped",
		"unhardened",
		"unharvested",
		"unhasped",
		"unhatched",
		"unheralded",
		"unhindered",
		"unhomogenised",
		"unhomogenized",
		"unhonored",
		"unhonoured",
		"unhooded",
		"unhusked",
		"unhyphenated",
		"unified",
		"unillustrated",
		"unimpacted",
		"unimpaired",
		"unimpassioned",
		"unimpeached",
		"unimpelled",
		"unimplemented",
		"unimpregnated",
		"unimprisoned",
		"unimpugned",
		"unincorporated",
		"unincubated",
		"unincumbered",
		"unindemnified",
		"unindexed",
		"unindicted",
		"unindorsed",
		"uninduced",
		"unindustrialised",
		"unindustrialized",
		"uninebriated",
		"uninfected",
		"uninflated",
		"uninflected",
		"uninhabited",
		"uninhibited",
		"uninitialised",
		"uninitialized",
		"uninitiated",
		"uninoculated",
		"uninseminated",
		"uninsulated",
		"uninsured",
		"uninterpreted",
		"unintimidated",
		"unintoxicated",
		"unintroverted",
		"uninucleated",
		"uninverted",
		"uninvested",
		"uninvolved",
		"unissued",
		"unjaundiced",
		"unjointed",
		"unjustified",
		"unkeyed",
		"unkindled",
		"unlabelled",
		"unlacquered",
		"unlamented",
		"unlaminated",
		"unlarded",
		"unlaureled",
		"unlaurelled",
		"unleaded",
		"unleavened",
		"unled",
		"unlettered",
		"unlicenced",
		"unlighted",
		"unlimbered",
		"unlimited",
		"unlined",
		"unlipped",
		"unliquidated",
		"unlithified",
		"unlittered",
		"unliveried",
		"unlobed",
		"unlocalised",
		"unlocalized",
		"unlocated",
		"unlogged",
		"unlubricated",
		"unmagnified",
		"unmailed",
		"unmaimed",
		"unmaintained",
		"unmalted",
		"unmangled",
		"unmanifested",
		"unmanipulated",
		"unmannered",
		"unmanufactured",
		"unmapped",
		"unmarred",
		"unmastered",
		"unmatriculated",
		"unmechanised",
		"unmechanized",
		"unmediated",
		"unmedicated",
		"unmentioned",
		"unmerged",
		"unmerited",
		"unmetabolised",
		"unmetabolized",
		"unmetamorphosed",
		"unmethylated",
		"unmineralized",
		"unmitigated",
		"unmoderated",
		"unmodernised",
		"unmodernized",
		"unmodified",
		"unmodulated",
		"unmolded",
		"unmolested",
		"unmonitored",
		"unmortgaged",
		"unmotivated",
		"unmotorised",
		"unmotorized",
		"unmounted",
		"unmutated",
		"unmutilated",
		"unmyelinated",
		"unnaturalised",
		"unnaturalized",
		"unnotched",
		"unnourished",
		"unobligated",
		"unobstructed",
		"unoccupied",
		"unoiled",
		"unopposed",
		"unoptimised",
		"unordained",
		"unorganised",
		"unorganized",
		"unoriented",
		"unoriginated",
		"unornamented",
		"unoxidized",
		"unoxygenated",
		"unpacified",
		"unpackaged",
		"unpaired",
		"unparalleled",
		"unparallelled",
		"unparasitized",
		"unpardoned",
		"unparodied",
		"unpartitioned",
		"unpasteurised",
		"unpasteurized",
		"unpatented",
		"unpaved",
		"unpedigreed",
		"unpenetrated",
		"unpenned",
		"unperfected",
		"unperjured",
		"unpersonalised",
		"unpersuaded",
		"unperturbed",
		"unperverted",
		"unpestered",
		"unphosphorylated",
		"unphotographed",
		"unpigmented",
		"unpiloted",
		"unpledged",
		"unploughed",
		"unplumbed",
		"unpoised",
		"unpolarized",
		"unpoliced",
		"unpolled",
		"unpopulated",
		"unposed",
		"unpowered",
		"unprecedented",
		"unpredicted",
		"unprejudiced",
		"unpremeditated",
		"unprescribed",
		"unpressurised",
		"unpressurized",
		"unpriced",
		"unprimed",
		"unprincipled",
		"unprivileged",
		"unprized",
		"unprocessed",
		"unprofaned",
		"unprofessed",
		"unprohibited",
		"unprompted",
		"unpronounced",
		"unproposed",
		"unprospected",
		"unproved",
		"unpruned",
		"unpublicised",
		"unpublicized",
		"unpublished",
		"unpuckered",
		"unpunctuated",
		"unpurified",
		"unqualified",
		"unquantified",
		"unquenched",
		"unquoted",
		"unranked",
		"unrated",
		"unratified",
		"unrebuked",
		"unreckoned",
		"unrecompensed",
		"unreconciled",
		"unreconstructed",
		"unrectified",
		"unredeemed",
		"unrefined",
		"unrefreshed",
		"unrefrigerated",
		"unregarded",
		"unregimented",
		"unregistered",
		"unregulated",
		"unrehearsed",
		"unrelated",
		"unrelieved",
		"unrelinquished",
		"unrenewed",
		"unrented",
		"unrepealed",
		"unreplicated",
		"unreprimanded",
		"unrequited",
		"unrespected",
		"unrestricted",
		"unretained",
		"unretarded",
		"unrevised",
		"unrevived",
		"unrevoked",
		"unrifled",
		"unripened",
		"unrivaled",
		"unrivalled",
		"unroasted",
		"unroofed",
		"unrounded",
		"unruffled",
		"unsalaried",
		"unsalted",
		"unsanctified",
		"unsanctioned",
		"unsanded",
		"unsaponified",
		"unsated",
		"unsatiated",
		"unsatisfied",
		"unsaturated",
		"unscaled",
		"unscarred",
		"unscathed",
		"unscented",
		"unscheduled",
		"unschooled",
		"unscreened",
		"unscripted",
		"unseamed",
		"unseared",
		"unseasoned",
		"unseeded",
		"unsegmented",
		"unsegregated",
		"unselected",
		"unserviced",
		"unsexed",
		"unshamed",
		"unshaped",
		"unsharpened",
		"unsheared",
		"unshielded",
		"unshifted",
		"unshirted",
		"unshoed",
		"unshuttered",
		"unsifted",
		"unsighted",
		"unsilenced",
		"unsimplified",
		"unsized",
		"unskewed",
		"unskinned",
		"unslaked",
		"unsliced",
		"unsloped",
		"unsmoothed",
		"unsoiled",
		"unsoldered",
		"unsolicited",
		"unsolved",
		"unsophisticated",
		"unsorted",
		"unsourced",
		"unsoured",
		"unspaced",
		"unspanned",
		"unspecialised",
		"unspecialized",
		"unspecified",
		"unspiced",
		"unstaged",
		"unstandardised",
		"unstandardized",
		"unstapled",
		"unstarched",
		"unstarred",
		"unstated",
		"unsteadied",
		"unstemmed",
		"unsterilised",
		"unsterilized",
		"unstickered",
		"unstiffened",
		"unstifled",
		"unstigmatised",
		"unstigmatized",
		"unstilted",
		"unstippled",
		"unstipulated",
		"unstirred",
		"unstocked",
		"unstoked",
		"unstoppered",
		"unstratified",
		"unstressed",
		"unstriped",
		"unstructured",
		"unstudied",
		"unstumped",
		"unsubdued",
		"unsubmitted",
		"unsubsidised",
		"unsubsidized",
		"unsubstantiated",
		"unsubstituted",
		"unsugared",
		"unsummarized",
		"unsupervised",
		"unsuprised",
		"unsurveyed",
		"unswayed",
		"unsweetened",
		"unsyllabled",
		"unsymmetrized",
		"unsynchronised",
		"unsynchronized",
		"unsyncopated",
		"unsyndicated",
		"unsynthesized",
		"unsystematized",
		"untagged",
		"untainted",
		"untalented",
		"untanned",
		"untaped",
		"untapered",
		"untargeted",
		"untarnished",
		"untattooed",
		"untelevised",
		"untempered",
		"untenanted",
		"unterminated",
		"untextured",
		"unthickened",
		"unthinned",
		"unthrashed",
		"unthreaded",
		"unthrottled",
		"unticketed",
		"untiled",
		"untilled",
		"untilted",
		"untimbered",
		"untinged",
		"untinned",
		"untinted",
		"untitled",
		"untoasted",
		"untoggled",
		"untoothed",
		"untopped",
		"untoughened",
		"untracked",
		"untrammeled",
		"untrammelled",
		"untranscribed",
		"untransduced",
		"untransferred",
		"untranslated",
		"untransmitted",
		"untraumatized",
		"untraversed",
		"untufted",
		"untuned",
		"untutored",
		"unupgraded",
		"unupholstered",
		"unutilised",
		"unutilized",
		"unuttered",
		"unvaccinated",
		"unvacuumed",
		"unvalidated",
		"unvalued",
		"unvandalized",
		"unvaned",
		"unvanquished",
		"unvapourised",
		"unvapourized",
		"unvaried",
		"unvariegated",
		"unvarnished",
		"unvented",
		"unventilated",
		"unverbalised",
		"unverbalized",
		"unverified",
		"unversed",
		"unvetted",
		"unvictimized",
		"unviolated",
		"unvitrified",
		"unvocalized",
		"unvoiced",
		"unwaged",
		"unwarped",
		"unwarranted",
		"unwaxed",
		"unweakened",
		"unweaned",
		"unwearied",
		"unweathered",
		"unwebbed",
		"unwed",
		"unwedded",
		"unweeded",
		"unweighted",
		"unwelded",
		"unwinterized",
		"unwired",
		"unwitnessed",
		"unwonted",
		"unwooded",
		"unworshipped",
		"unwounded",
		"unzoned",
		"uprated",
		"uprighted",
		"upsized",
		"upswelled",
		"vacuolated",
		"valanced",
		"valueoriented",
		"varied",
		"vascularised",
		"vascularized",
		"vasectomised",
		"vaunted",
		"vectorised",
		"vectorized",
		"vegged",
		"verdured",
		"verified",
		"vermiculated",
		"vernacularized",
		"versified",
		"verticillated",
		"vesiculated",
		"vied",
		"vilified",
		"virtualised",
		"vitrified",
		"vivified",
		"volumed",
		"vulcanised",
		"wabbled",
		"wafered",
		"waisted",
		"walleyed",
		"wared",
		"warmblooded",
		"warmhearted",
		"warted",
		"waterbased",
		"waterbed",
		"watercooled",
		"watersaturated",
		"watershed",
		"wavegenerated",
		"waxweed",
		"weakhearted",
		"weakkneed",
		"weakminded",
		"wearied",
		"weatherised",
		"weatherstriped",
		"webfooted",
		"wedgeshaped",
		"weed",
		"weeviled",
		"welladapted",
		"welladjusted",
		"wellbred",
		"wellconducted",
		"welldefined",
		"welldisposed",
		"welldocumented",
		"wellequipped",
		"wellestablished",
		"wellfavored",
		"wellfed",
		"wellgrounded",
		"wellintentioned",
		"wellmannered",
		"wellminded",
		"wellorganised",
		"wellrounded",
		"wellshaped",
		"wellstructured",
		"whinged",
		"whinnied",
		"whiplashed",
		"whiskered",
		"wholehearted",
		"whorled",
		"widebased",
		"wideeyed",
		"widemeshed",
		"widemouthed",
		"widenecked",
		"widespaced",
		"wilded",
		"wildered",
		"wildeyed",
		"willinghearted",
		"windspeed",
		"winterfed",
		"winterfeed",
		"winterised",
		"wirehaired",
		"wised",
		"witchweed",
		"woaded",
		"wombed",
		"wooded",
		"woodshed",
		"wooled",
		"woolled",
		"woollyhaired",
		"woollystemmed",
		"woolyhaired",
		"woolyminded",
		"wormholed",
		"wormshaped",
		"wrappered",
		"wretched",
		"wronghearted",
		"ycleped",
		"yolked",
		"zincified",
		"zinckified",
		"zinkified",
		"zombified"
	];
};

},{}],89:[function(require,module,exports){
module.exports = function() {
	return [
		"to",
		"which",
		"who",
		"whom",
		"that",
		"whose",
		"after",
		"although",
		"as",
		"because",
		"before",
		"even if",
		"even though",
		"how",
		"if",
		"in order that",
		"inasmuch",
		"lest",
		"once",
		"provided",
		"since",
		"so that",
		"than",
		"though",
		"till",
		"unless",
		"until",
		"when",
		"whenever",
		"where",
		"whereas",
		"wherever",
		"whether",
		"while",
		"why",
		"by the time",
		"supposing",
		"no matter",
		"how",
		"what",
		"won't",
		"do",
		"does",
		"'ll",
		":"
	];
};

},{}],90:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint" );
var sum = require( "lodash/sum" );
var reduce = require( "lodash/reduce" );

/**
 * Calculates the standard deviation of a text
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {number} The calculated standard deviation
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var sentences = getSentences( text );
	var sentenceLengthResults = sentencesLength( sentences );
	var totalSentences = sentenceLengthResults.length;

	var totalWords = reduce( sentenceLengthResults, function( result, sentence ) {
		return result + sentence.sentenceLength;
	}, 0 );

	var average = totalWords / totalSentences;

	// Calculate the variations per sentence.
	var variation;
	var variations = [];

	sentenceLengthResults.map( function( sentence ) {
		variation = sentence.sentenceLength - average;
		variations.push( Math.pow( variation, 2 ) );
	} );

	var totalOfSquares = sum( variations );

	if ( totalOfSquares > 0 ) {
		var dividedSquares = totalOfSquares / ( totalSentences - 1 );

		return fixFloatingPoint( Math.sqrt( dividedSquares ) );
	}

	return 0;
};

},{"../helpers/fixFloatingPoint":51,"../stringProcessing/getSentences.js":110,"../stringProcessing/sentencesLength.js":122,"lodash/reduce":327,"lodash/sum":332}],91:[function(require,module,exports){
/** @module researches/stopWordsInKeyword */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getKeyword() );
};

},{"./stopWordsInText.js":92}],92:[function(require,module,exports){
var stopwords = require( "../config/stopwords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {Array} An array with all stopwords found in the text.
 */
module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( toRegex( stopwords[ i ] ) ) !== null ) {
			matches.push( stopwords[ i ] );
		}
	}

	return matches;
};

},{"../config/stopwords.js":43,"../stringProcessing/stringToRegex.js":123}],93:[function(require,module,exports){
/** @module researches/stopWordsInUrl */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 * @param {Paper} paper The Paper object to get the url from.
 * @returns {Array} stopwords found in URL
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getUrl().replace( /[-_]/g, " " ) );
};

},{"./stopWordsInText.js":92}],94:[function(require,module,exports){
/** @module analyses/isUrlTooLong */

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( paper ) {
	var urlLength = paper.getUrl().length;
	var keywordLength = paper.getKeyword().length;
	var maxUrlLength = 40;
	var maxSlugLength = 20;

	if ( urlLength > maxUrlLength	&& urlLength > keywordLength + maxSlugLength ) {
		return true;
	}
	return false;
};

},{}],95:[function(require,module,exports){
var wordCount = require( "../stringProcessing/countWords.js" );

/**
 * Count the words in the text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
module.exports = function( paper ) {
	return wordCount( paper.getText() );
};

},{"../stringProcessing/countWords.js":103}],96:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var introductionKeyword = require( "./assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "./assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "./assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "./assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "./assessments/metaDescriptionLengthAssessment.js" );
var subheadingsKeyword = require( "./assessments/subheadingsKeywordAssessment.js" );
var textCompetingLinks = require( "./assessments/textCompetingLinksAssessment.js" );
var textImages = require( "./assessments/textImagesAssessment.js" );
var textLength = require( "./assessments/textLengthAssessment.js" );
var textLinks = require( "./assessments/textLinksAssessment.js" );
var textSubheadings = require( "./assessments/textSubheadingsAssessment.js" );
var titleKeyword = require( "./assessments/titleKeywordAssessment.js" );
var titleLength = require( "./assessments/titleLengthAssessment.js" );
var urlKeyword = require( "./assessments/urlKeywordAssessment.js" );
var urlLength = require( "./assessments/urlLengthAssessment.js" );
var urlStopWords = require( "./assessments/urlStopWordsAssessment.js" );
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		metaDescriptionLength,
		subheadingsKeyword,
		textCompetingLinks,
		textImages,
		textLength,
		textLinks,
		textSubheadings,
		titleKeyword,
		titleLength,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"./assessments/introductionKeywordAssessment.js":7,"./assessments/keyphraseLengthAssessment.js":8,"./assessments/keywordDensityAssessment.js":9,"./assessments/keywordStopWordsAssessment.js":10,"./assessments/metaDescriptionKeywordAssessment.js":11,"./assessments/metaDescriptionLengthAssessment.js":12,"./assessments/subheadingsKeywordAssessment.js":23,"./assessments/textCompetingLinksAssessment.js":25,"./assessments/textImagesAssessment.js":26,"./assessments/textLengthAssessment.js":27,"./assessments/textLinksAssessment.js":28,"./assessments/textSubheadingsAssessment.js":29,"./assessments/titleKeywordAssessment.js":30,"./assessments/titleLengthAssessment.js":31,"./assessments/urlKeywordAssessment.js":33,"./assessments/urlLengthAssessment.js":34,"./assessments/urlStopWordsAssessment.js":35,"./assessor.js":37,"util":478}],97:[function(require,module,exports){
/* jshint browser: true */

var isEmpty = require( "lodash/isEmpty" );
var isElement = require( "lodash/isElement" );
var isUndefined = require( "lodash/isUndefined" );
var clone = require( "lodash/clone" );
var defaultsDeep = require( "lodash/defaultsDeep" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );

var stringToRegex = require( "../js/stringProcessing/stringToRegex.js" );
var stripHTMLTags = require( "../js/stringProcessing/stripHTMLTags.js" );
var sanitizeString = require( "../js/stringProcessing/sanitizeString.js" );
var stripSpaces = require( "../js/stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../js/stringProcessing/replaceDiacritics.js" );
var analyzerConfig = require( "./config/config.js" );

var domManipulation = require( "./helpers/domManipulation.js" );

var snippetEditorTemplate = require( "./templates.js" ).snippetEditor;

var defaults = {
	data: {
		title: "",
		metaDesc: "",
		urlPath: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	defaultValue: {
		title: "",
		metaDesc: ""
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	},
	addTrailingSlash: true,
	metaDescriptionDate: ""
};

var titleMaxLength = 65;

var inputPreviewBindings = [
	{
		"preview": "title_container",
		"inputField": "title"
	},
	{
		"preview": "url_container",
		"inputField": "urlPath"
	},
	{
		"preview": "meta_container",
		"inputField": "metaDesc"
	}
];

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The key to retrieve.
 * @returns {string} The unformatted text.
 */
function retrieveUnformattedText( key ) {
	return this.data[ key ];
}

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 * @returns {void}
 */
function updateUnformattedText( key, value ) {
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url The url to check for a trailing slash.
 * @returns {boolean} Whether or not the url contains a trailing slash.
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean} Whether or not the browser supports a <progress> element
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return !isUndefined( progressElement.max );
}

/**
 * Returns a rating based on the length of the title
 *
 * @param {number} titleLength the length of the title.
 * @returns {string} The rating given based on the title length.
 */
function rateTitleLength( titleLength ) {
	var rating;

	switch ( true ) {
		case titleLength > 0 && titleLength <= 34:
		case titleLength >= 66:
			rating = "ok";
			break;

		case titleLength >= 35 && titleLength <= 65:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Returns a rating based on the length of the meta description
 *
 * @param {number} metaDescLength the length of the meta description.
 * @returns {string} The rating given based on the description length.
 */
function rateMetaDescLength( metaDescLength ) {
	var rating;

	switch ( true ) {
		case metaDescLength > 0 && metaDescLength <= 120:
		case metaDescLength >= 157:
			rating = "ok";
			break;

		case metaDescLength >= 120 && metaDescLength <= 157:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Updates a progress bar
 *
 * @private
 * @this SnippetPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 * @returns {void}
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good"
		];

	element.value = value;
	domManipulation.removeClasses( element, allClasses );
	domManipulation.addClass( element, "snippet-editor__progress--" + rating );

	if ( !this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - The placeholder title.
 * @param {string}         opts.placeholder.metaDesc      - The placeholder meta description.
 * @param {string}         opts.placeholder.urlPath       - The placeholder url.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - The default title.
 * @param {string}         opts.defaultValue.metaDesc     - The default meta description.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 * @param {string}         opts.metaDescriptionDate       - The date to display before the meta description.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc      - The rendered meta description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {
	defaultsDeep( opts, defaults );

	this.data = opts.data;

	if ( !isUndefined( opts.analyzerApp ) ) {
		this.refObj = opts.analyzerApp;
		this.i18n = this.refObj.i18n;

		this.data = {
			title: this.refObj.rawData.snippetTitle || "",
			urlPath: this.refObj.rawData.snippetCite || "",
			metaDesc: this.refObj.rawData.snippetMeta || ""
		};

		// For backwards compatibility set the metaTitle as placeholder.
		if ( !isEmpty( this.refObj.rawData.metaTitle ) ) {
			opts.placeholder.title = this.refObj.rawData.metaTitle;
		}
	}

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	this.opts = opts;
	this._currentFocus = null;
	this._currentHover = null;

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" )
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 * @returns {void}
 */
SnippetPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			titleLabel: this.i18n.dgettext( "js-text-analysis", "Seo title preview:" ),
			slugLabel: this.i18n.dgettext( "js-text-analysis", "Slug preview:" ),
			metaDescriptionLabel: this.i18n.dgettext( "js-text-analysis", "Meta description preview:" ),
			snippetPreviewDescription: this.i18n.dgettext(
				"js-text-analysis",
				"You can click on each element in the preview to jump to the Snippet Editor."
			)
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[ 0 ]
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[ 0 ]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" )
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		urlPath: this.element.input.urlPath.parentNode,
		metaDesc: this.element.input.metaDesc.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		urlPath: this.element.rendered.urlPath.parentNode,
		metaDesc: this.element.rendered.metaDesc.parentNode
	};

	this.hasProgressSupport = hasProgressSupport();

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.metaDesc.max = analyzerConfig.maxMeta;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			domManipulation.addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.opened = false;
	this.updateProgressBars();
};

/**
 * Refreshes the snippet editor rendered HTML
 * @returns {void}
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The title that is meant for the analyzer.
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	title = this.refObj.pluggable._applyModifications( "data_page_title", title );

	return stripSpaces( title );
}

/**
 * Returns the metaDescription, includes the date if it is set.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The meta data for the analyzer.
 */
var getAnalyzerMetaDesc = function() {
	var metaDesc = this.data.metaDesc;

	if ( isEmpty( metaDesc ) ) {
		metaDesc = this.opts.defaultValue.metaDesc;
	}

	metaDesc = this.refObj.pluggable._applyModifications( "data_meta_desc", metaDesc );

	if ( !isEmpty( this.opts.metaDescriptionDate ) && !isEmpty( metaDesc ) ) {
		metaDesc = this.opts.metaDescriptionDate + " - " + this.data.metaDesc;
	}

	return stripSpaces( metaDesc );
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object} The collected data for the analyzer.
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    getAnalyzerTitle.call( this ),
		url:      this.data.urlPath,
		metaDesc: getAnalyzerMetaDesc.call( this )
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 * @returns {void}
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	this.refObj.callbacks.bindElementEvents( this.refObj );
};

/**
 *  Checks if title and url are set so they can be rendered in the snippetPreview
 *  @returns {void}
 */
SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.metaTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * Creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object} The HTML output of the collected data.
 */
SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * Formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 *
 * @returns {string} The correctly formatted title.
 */
SnippetPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	// Apply modification to the title before showing it.
	if ( this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	title = stripHTMLTags( title );

	// If a keyword is set we want to highlight it in the title.
	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		title = this.formatKeyword( title );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

	return title;
};

/**
 * Formats the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	cite = replaceDiacritics( stripHTMLTags( cite ) );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.urlPath;
	}

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && !hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// Apply modification to the desc before showing it.
	if ( this.refObj.pluggable.loaded ) {
		meta = this.refObj.pluggable._applyModifications( "data_meta_desc", meta );
	}

	meta = stripHTMLTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, analyzerConfig.maxMeta );

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( meta ) ) {
		meta = this.i18n.dgettext( "js-text-analysis", "Please provide a meta description by editing the snippet below." );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt. It uses the keyword to
 * select an appropriate part of the text. If the keyword isn't present it takes the first 156 characters of the text.
 * If both the keyword, text and excerpt are empty this function returns the sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText = this.opts.defaultValue.metaDesc;

	if ( !isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( !isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	metaText = stripHTMLTags( metaText );

	return metaText.substring( 0, analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns {Array} Array with matches
 */
SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	// Starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	// Runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		// Pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns {Array} Array with sentences.
 */
SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.rawData.text.indexOf( ".", i ) ) > -1 ) {
		periodMatches.push( match );
		i = match + 1;
	}
	return periodMatches;
};

/**
 * Formats the keyword for use in the snippetPreview by adding <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results.
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {string} The formatted keyword.
 */
SnippetPreview.prototype.formatKeyword = function( textString ) {

	// Removes characters from the keyword that could break the regex, or give unwanted results.
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\{\}\(\)\*\+\?\.\^\$\|]/g, " " );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( keyword, "", false );
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 * Strips unwanted characters that could break the regex or give unwanted results
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {XML|string|void} The formatted keyword string to be used in the URL.
 */
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = sanitizeString( this.refObj.rawData.keyword );
	keyword = keyword.replace( /'/, "" );

	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 * @returns {void}
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 * @returns {void}
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var metaDescElement = this.element.rendered.metaDesc;
	var metaDesc = getAnalyzerMetaDesc.call( this );

	if ( isEmpty( metaDesc ) ) {
		domManipulation.addClass( metaDescElement, "desc-render" );
		domManipulation.removeClass( metaDescElement, "desc-default" );
	} else {
		domManipulation.addClass( metaDescElement, "desc-default" );
		domManipulation.removeClass( metaDescElement, "desc-render" );
	}
};

/**
 * Function to call init, to rerender the snippetpreview
 * @returns {void}
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * Checks text length of the snippetmeta and snippet title, shortens it if it is too long.
 * @param {Object} event The event to check the text length from.
 * @returns {void}
 */
SnippetPreview.prototype.checkTextLength = function( event ) {
	var text = event.currentTarget.textContent;
	switch ( event.currentTarget.id ) {
		case "snippet_meta":
			event.currentTarget.className = "desc";
			if ( text.length > analyzerConfig.maxMeta ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring(
					0,
					analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			event.currentTarget.className = "title";
			if ( text.length > titleMaxLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring( 0, titleMaxLength );
			}
			break;
		default:
			break;
	}
};

/**
 * When clicked on an element in the snippet, checks fills the textContent with the data from the unformatted text.
 * This removes the keyword highlighting and modified data so the original content can be editted.
 * @param {Object} event The event to get the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.getUnformattedText = function( event ) {
	var currentElement = event.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		event.currentTarget.textContent = this.unformattedText[ currentElement ];
	}
};

/**
 * When text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param {Object} event The event to set the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.setUnformattedText = function( event ) {
	var elem =  event.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Validates all fields and highlights errors.
 * @returns {void}
 */
SnippetPreview.prototype.validateFields = function() {
	var metaDescription = getAnalyzerMetaDesc.call( this );
	var title = getAnalyzerTitle.call( this );

	if ( metaDescription.length > analyzerConfig.maxMeta ) {
		domManipulation.addClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		domManipulation.addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the data
 * @returns {void}
 */
SnippetPreview.prototype.updateProgressBars = function() {
	var metaDescriptionRating, titleRating, metaDescription, title;

	metaDescription = getAnalyzerMetaDesc.call( this );
	title = getAnalyzerTitle.call( this );

	titleRating = rateTitleLength( title.length );
	metaDescriptionRating = rateMetaDescLength( metaDescription.length );

	updateProgressBar(
		this.element.progress.title,
		title.length,
		titleMaxLength,
		titleRating
	);

	updateProgressBar(
		this.element.progress.metaDesc,
		metaDescription.length,
		analyzerConfig.maxMeta,
		metaDescriptionRating
	);
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 * @returns {void}
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ];

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[ 0 ];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( inputPreviewBindings, function( binding ) {
		var previewElement = document.getElementById( binding.preview );
		var inputElement = this.element.input[ binding.inputField ];

		// Make the preview element click open the editor and focus the correct input.
		previewElement.addEventListener( "click", function() {
			this.openEditor();
			inputElement.focus();
		}.bind( this ) );

		// Make focusing an input, update the carets.
		inputElement.addEventListener( "focus", function() {
			this._currentFocus = binding.inputField;

			this._updateFocusCarets();
		}.bind( this ) );

		// Make removing focus from an element, update the carets.
		inputElement.addEventListener( "blur", function() {
			this._currentFocus = null;

			this._updateFocusCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseover", function() {
			this._currentHover = binding.inputField;

			this._updateHoverCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseout", function() {
			this._currentHover = null;

			this._updateHoverCarets();
		}.bind( this ) );

	}.bind( this ) );
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 * @returns {void}
 */
SnippetPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	this.refObj.refresh();
}, 25 );

/**
 * Updates our data object from the DOM
 * @returns {void}
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.openEditor = function() {

	this.element.editToggle.setAttribute( "aria-expanded", "true" );

	// Show these elements.
	domManipulation.removeClass( this.element.formContainer, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.closeEditor = function() {

	// Hide these elements.
	domManipulation.addClass( this.element.formContainer,     "snippet-editor--hidden" );

	this.element.editToggle.setAttribute( "aria-expanded", "false" );
	this.element.editToggle.focus();

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		domManipulation.addClass( focusedLabel, "snippet-editor__label--focus" );
		domManipulation.addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		domManipulation.addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/**
 * Updates the title data and the title input field. This also means the snippet editor view is updated.
 *
 * @param {string} title The title to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setTitle = function( title ) {
	this.element.input.title.value = title;

	this.changedInput();
};

/**
 * Updates the url path data and the url path input field. This also means the snippet editor view is updated.
 *
 * @param {string} urlPath the URL path to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setUrlPath = function( urlPath ) {
	this.element.input.urlPath.value = urlPath;

	this.changedInput();
};

/**
 * Updates the meta description data and the meta description input field. This also means the snippet editor view is updated.
 *
 * @param {string} metaDesc the meta description to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setMetaDescription = function( metaDesc ) {
	this.element.input.metaDesc.value = metaDesc;

	this.changedInput();
};

/* jshint ignore:start */
/* eslint-disable */

/**
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 *
 * @deprecated
 * @param {KeyboardEvent} ev
 */
SnippetPreview.prototype.disableEnter = function( ev ) {};

/**
 * Adds and remove the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {};

/**
 * shows the edit icon corresponding to the hovered element
 *
 * @deprecated
 *
 * @param ev
 */
SnippetPreview.prototype.showEditIcon = function( ev ) {

};

/**
 * removes all editIcon-classes, sets to snippet_container
 *
 * @deprecated
 */
SnippetPreview.prototype.hideEditIcon = function() {};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {};
/* jshint ignore:end */
/* eslint-disable */
module.exports = SnippetPreview;

},{"../js/stringProcessing/replaceDiacritics.js":119,"../js/stringProcessing/sanitizeString.js":121,"../js/stringProcessing/stringToRegex.js":123,"../js/stringProcessing/stripHTMLTags.js":124,"../js/stringProcessing/stripSpaces.js":127,"./config/config.js":39,"./helpers/domManipulation.js":50,"./templates.js":130,"lodash/clone":286,"lodash/debounce":287,"lodash/defaultsDeep":289,"lodash/forEach":295,"lodash/isElement":305,"lodash/isEmpty":306,"lodash/isUndefined":317}],98:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries
 */
module.exports = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
	var _extraWordBoundary = extraWordBoundary || "";

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],99:[function(require,module,exports){
/** @module stringProcessing/checkNofollow */

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	var linkFollow = "Dofollow";

	// Matches all nofollow links, case insensitive and global
	if ( text.match( /rel=([\'\"])nofollow\1/ig ) !== null ) {
		linkFollow = "Nofollow";
	}
	return linkFollow;
};

},{}],100:[function(require,module,exports){
/** @module stringProcessing/cleanText */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );

/**
 * Removes words, duplicate spaces and sentence terminators, and words consisting of only digits
 * from the text. This is used for the flesh reading ease test.
 *
 * @param {String} text The cleaned text
 * @returns {String} The text
 */
module.exports = function( text ) {
	if ( text === "" ) {
		return text;
	}

	text = replaceDiacritics( text );
	text = text.toLocaleLowerCase();

	text = unifyWhitespace( text );

	// replace comma', hyphens etc with spaces
	text = text.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

	// remove apostrophe
	text = text.replace( /[\’]/g, "" );

	// unify all terminators
	text = text.replace( /[.?!]/g, "." );

	// Remove double spaces
	text = stripSpaces( text );

	// add period in case it is missing
	text += ".";

	// replace newlines with spaces
	text = text.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

	// remove duplicate terminators
	text = text.replace( /([\.])[\. ]+/g, "$1" );

	// pad sentence terminators
	text = text.replace( /[ ]*([\.])+/g, "$1 " );

	// Remove double spaces
	text = stripSpaces( text );

	if ( text === "." ) {
		return "";
	}

	return text;
};

},{"../stringProcessing/replaceDiacritics.js":119,"../stringProcessing/stripSpaces.js":127,"../stringProcessing/unifyWhitespace.js":129}],101:[function(require,module,exports){
/** @module stringProcessing/countSentences */

var getSentences = require( "../stringProcessing/getSentences.js" );

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
module.exports = function( text ) {
	var sentences = getSentences( text );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

},{"../stringProcessing/getSentences.js":110}],102:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

var cleanText = require( "../stringProcessing/cleanText.js" );
var syllableArray = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

/**
 * Checks the textstring for exclusion words. If they are found, returns the number of syllables these have, since
 * they are incorrectly detected with the syllablecounters based on regexes.
 *
 * @param {string} text The text to look for exclusionwords
 * @returns {number} The number of syllables found in the exclusionwords
 */
var countExclusionSyllables = function( text ) {
	var count = 0, wordArray, regex, matches;
	wordArray = syllableArray().exclusionWords;
	for ( var i = 0; i < wordArray.length; i++ ) {
		regex = new RegExp( wordArray[ i ].word, "ig" );
		matches = text.match( regex );
		if ( matches !== null ) {
			count += ( matches.length * wordArray[ i ].syllables );
		}
	}
	return count;
};

/**
 * Removes words from the text that are in the exclusion array. These words are counted
 * incorrectly in the syllable counters, so they are removed and checked sperately.
 *
 * @param {string} text The text to remove words from
 * @returns {string} The text with the exclusionwords removed
 */
var removeExclusionWords = function( text ) {
	var exclusionWords = syllableArray().exclusionWords;
	var wordArray = [];
	for ( var i = 0; i < exclusionWords.length; i++ ) {
		wordArray.push( exclusionWords[ i ].word );
	}
	return text.replace( arrayToRegex( wordArray ), "" );
};

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countBasicSyllables = function( text ) {
	var array = text.split( " " );
	var i, j, splitWord, count = 0;

	// split textstring to individual words
	for ( i = 0; i < array.length; i++ ) {

		// split on consonants
		splitWord = array[ i ].split( /[^aeiouy]/g );

		// if the string isn't empty, a consonant was found, up the counter
		for ( j = 0; j < splitWord.length; j++ ) {
			if ( splitWord[ j ] !== "" ) {
				count++;
			}
		}
	}

	return count;
};

/**
 * Advanced syllable counter to match texstring with regexes.
 *
 * @param {String} text The text to count the syllables.
 * @param {String} operator The operator to determine which regex to use.
 * @returns {number} the amount of syllables found in string.
 */
var countAdvancedSyllables = function( text, operator ) {
	var matches, count = 0, words = text.split( " " );
	var regex = "";
	switch ( operator ) {
		case "add":
			regex = arrayToRegex( syllableArray().addSyllables, true );
			break;
		case "subtract":
			regex = arrayToRegex( syllableArray().subtractSyllables, true );
			break;
		default:
			break;
	}
	for ( var i = 0; i < words.length; i++ ) {
		matches = words[ i ].match( regex );
		if ( matches !== null ) {
			count += matches.length;
		}
	}
	return count;
};

/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} text The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ) {
	var count = 0;
	count += countExclusionSyllables( text );

	text = removeExclusionWords( text );
	text = cleanText( text );
	text.replace( /[.]/g, " " );

	count += countBasicSyllables( text );
	count += countAdvancedSyllables( text, "add" );
	count -= countAdvancedSyllables( text, "subtract" );

	return count;
};


},{"../config/syllables.js":44,"../stringProcessing/cleanText.js":100,"../stringProcessing/createRegexFromArray.js":104}],103:[function(require,module,exports){
/** @module stringProcessing/countWords */

var getWords = require( "../stringProcessing/getWords.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
module.exports = function( text ) {
	return getWords( text ).length;
};

},{"../stringProcessing/getWords.js":113}],104:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );
var map = require( "lodash/map" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":98,"lodash/map":320}],105:[function(require,module,exports){
/** @module stringProcessing/createRegexFromDoubleArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex string of combined strings from the input array.
 * @param {array} array The array containing the various parts of a transition word combination.
 * @returns {array} The array with replaced entries.
 */
var wordCombinationToRegexString = function( array ) {
	array = array.map( function( word ) {
		return addWordBoundary( word );
	} );
	return array.join( "(.*?)" );
};

/**
 * Creates a regex of combined strings from the input array, containing arrays with two entries.
 * @param {array} array The array containing arrays.
 * @returns {RegExp} The regex created from the array.
 */
module.exports = function ( array ) {
	array = array.map( function( wordCombination ) {
		return wordCombinationToRegexString( wordCombination );
	} );
	var regexString = "(" + array.join( ")|(" ) + ")";
	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":98}],106:[function(require,module,exports){
/** @module stringProcessing/findKeywordInUrl */

var keywordRegex = require( "../stringProcessing/stringToRegex.js" );
/**
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword ) {
	var keywordFound = false;
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		if ( formatUrl.match( keywordRegex( keyword ) ) !== null ) {
			keywordFound = true;
		}
	}

	return keywordFound;
};

},{"../stringProcessing/stringToRegex.js":123}],107:[function(require,module,exports){
/** @module stringProcessing/getAlttagContent */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var regexAltTag = /alt=(['"])(.*?)\1/i;

/**
 * Checks for an alttag in the image and returns its content
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function( text ) {
	var alt = "";

	var matches = text.match( regexAltTag );

	if ( matches !== null ) {
		alt = stripSpaces( matches[ 2 ] );

		alt = alt.replace( /&quot;/g, "\"" );
		alt = alt.replace( /&#039;/g, "'" );
	}
	return alt;
};

},{"../stringProcessing/stripSpaces.js":127}],108:[function(require,module,exports){
/** @module stringProcessing/getAnchorsFromText */

/**
 * Check for anchors in the textstring and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 * @returns {Array} The matched links in text.
 */
module.exports = function( text ) {
	var matches;

	// regex matches everything between <a> and </a>
	matches = text.match( /<a(?:[^>]+)?>(.*?)<\/a>/ig );
	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],109:[function(require,module,exports){
/** @module stringProcess/getLinkType */

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	var linkType = "other";

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( text.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";
		var urlMatch = text.match( url );
		if ( urlMatch !== null && urlMatch[ 0 ].length !== 0 ) {
			linkType = "internal";
		}
	}
	return linkType;
};

},{}],110:[function(require,module,exports){
var filter = require( "lodash/filter" );
var isEmpty = require( "lodash/isEmpty" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );

/**
 * Checks if the period is followed with a whitespace. If not, it is no ending of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {number} index The current index to look for.
 * @returns {boolean} True if it doesn't match a whitespace.
 */
var invalidateOnWhiteSpace = function( text, index ) {
	return text.substring( index + 1 ).match( /\s/ ) === null;
};

/**
 * Checks if the character in the next sentence is a capital letter or a number. If not, this period is not the end
 * of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @param {number} i The current iterator.
 * @returns {boolean} False if it doesn't match a capital.
 */
var invalidateOnCapital = function( text, positions, i ) {

	// The current index + 2 should be the first character of the new sentence. We use a range of 1, since we only need the first character.
	var firstChar = text.substring( positions[ i ] + 2, positions[ i ] + 3 );

	// If a sentence starts with a number or a whitespace, it shouldn't invalidate
	if ( firstChar === firstChar.toLocaleLowerCase() && isNaN( parseInt( firstChar, 10 ) ) && firstChar.match( /\s/ ) === null ) {
		return true;
	}
};

/**
 * Filters the positions that aren't valid endings to sentences.
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @returns {Array} The filtered positions.
 */
var filterPositions = function( text, positions ) {
	return filter( positions, function( position, index ) {
		if ( !isUndefined( positions[ index + 1 ] ) ) {
			if ( invalidateOnWhiteSpace( text, positions[ index ] ) || invalidateOnCapital( text, positions, index ) ) {
				return false;
			}
		}
		return true;
	} );
};

/**
 * Split sentences based on index.
 *
 * @param {Array} positions The array with positions of periods in the text.
 * @param {string} text The text to split in sentences.
 * @returns {Array} Array with sentences.
 */
var splitOnIndex = function( positions, text ) {
	var curIndex = 0, sentences = [];

	forEach( positions, function( index ) {
		sentences.push( text.substring( curIndex, index ) );

		// Adds 1 to skip the period.
		curIndex = index + 1;
	} );
	return sentences;
};

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {

	// Store the original text before changing terminators, so we can return the unaltered sentences.
	var originalText = text;

	// Unify all terminators.
	text = text.replace( /[.?!]/g, "." );

	// Add period in case it is missing.
	text += ".";

	var positions = [];
	var periodIndex = text.indexOf( "." );
	while ( periodIndex > -1 ) {
		positions.push( periodIndex );
		periodIndex = text.indexOf( ".", periodIndex + 1 );
	}
	positions = filterPositions( originalText, positions );
	var sentences = splitOnIndex( positions, originalText );

	return filter( sentences, function( sentence ) {
		return ( !isEmpty( sentence ) );
	} );
};

},{"lodash/filter":292,"lodash/forEach":295,"lodash/isEmpty":306,"lodash/isNaN":309,"lodash/isUndefined":317}],111:[function(require,module,exports){
/**
 * Returns all texts per subheading.
 * @param {string} text The text to analyze from.
 * @returns {Array} an array with text blocks per subheading.
 */
module.exports = function( text ) {
	/*
	 matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
	 The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
	 since the subheading is already matched.
	 For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
	 then replace all headings with a | and split on a |.
	 */
	text = text.replace( /\|/ig, "" );
	text = text.replace( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|" );
	var subheadings =  text.split( "|" );

	// we never need the first entry, if the text starts with a subheading it will be empty, and if the text doesn't start with a subheading, the
	// text doesnt't belong to a subheading, so it can be removed
	subheadings.shift();
	return subheadings;
};



},{}],112:[function(require,module,exports){
var map = require( "lodash/map" );

/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 * @returns {Array} Matches of subheadings in the text, first key is everything including tags, second is the heading
 *                  level, third is the content of the subheading.
 */
function getSubheadings( text ) {
	var subheadings = [];
	var regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		subheadings.push( match );
	}

	return subheadings;
}

/**
 * Gets the content of subheadings in the text
 *
 * @param {string} text The text to get the subheading contents from.
 * @returns {Array<string>} A list of all the subheadings with their content.
 */
function getSubheadingContents( text ) {
	var subheadings = getSubheadings( text );

	subheadings = map( subheadings, function( subheading ) {
		return subheading[0];
	} );

	return subheadings;
}

module.exports = {
	getSubheadings: getSubheadings,
	getSubheadingContents: getSubheadingContents
};

},{"lodash/map":320}],113:[function(require,module,exports){
/** @module stringProcessing/countWords */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	return text.split( /\s/g );
};


},{"../stringProcessing/stripHTMLTags.js":124,"../stringProcessing/stripSpaces.js":127}],114:[function(require,module,exports){
/** @module stringProcessing/imageInText */

var matchStringWithRegex = require( "./matchStringWithRegex.js" );

/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function( text ) {
	return matchStringWithRegex( text, "<img(?:[^>]+)?>" );
};

},{"./matchStringWithRegex.js":116}],115:[function(require,module,exports){
var map = require( "lodash/map" );

/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 * @param {string} text The text to match paragraph in.
 * @returns {array} An array containing all paragraphs texts.
 */
var getParagraphsInTags = function ( text ) {
	var paragraphs = [];
	// Matches everything between the <p> and </p> tags.
	var regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		paragraphs.push( match );
	}

	// Returns only the text from within the paragraph tags.
	return map( paragraphs, function( paragraph ) {
		return paragraph[ 1 ];
	} );
};

/**
 * Returns an array with all paragraphs from the text.
 * @param {string} text The text to match paragraph in.
 * @returns {array} The array containing all paragraphs from the text.
 */
module.exports = function( text ) {
	var paragraphs = getParagraphsInTags( text );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no <p> tags found, split on double linebreaks.
	paragraphs = text.split( "\n\n" );
	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}
	// If no paragraphs are found, return an array containing the entire text.
	return [ text ];
};

},{"lodash/map":320}],116:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ) {
	var regex = new RegExp( regexString, "ig" );
	var matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],117:[function(require,module,exports){
/** @module stringProcessing/matchTextWithWord */

var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {number} The amount of matches found.
 */
module.exports = function( text, wordToMatch, extraBoundary ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	text = replaceDiacritics( text );

	var matches = text.match( stringToRegex( wordToMatch, extraBoundary ) );

	if ( matches === null ) {
		return 0;
	}

	return matches.length;
};

},{"../stringProcessing/replaceDiacritics.js":119,"../stringProcessing/stringToRegex.js":123,"../stringProcessing/stripNonTextTags.js":125,"../stringProcessing/unifyWhitespace.js":129}],118:[function(require,module,exports){
/** @module stringProcessing/removeNonWordCharacters.js */

/**
 * Removes all spaces and nonwordcharacters from a string.
 *
 * @param {string} string The string to replace spaces from.
 * @returns {string} string The string without spaces.
 */
module.exports = function( string ) {
	return string.replace( /[\s\n\r\t\.,'\(\)\"\+;!?:\/]/g, "" );
};

},{}],119:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var diacritisRemovalMap = require( "../config/diacritics.js" );

/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
module.exports = function( text ) {
	var map = diacritisRemovalMap();

	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
};

},{"../config/diacritics.js":40}],120:[function(require,module,exports){
/** @module stringProcessing/replaceString */

/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */
module.exports = function( text, stringToReplace, replacement ) {
	text = text.replace( stringToReplace, replacement );

	return text;
};

},{}],121:[function(require,module,exports){
/** @module stringProcessing/sanitizeString */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
module.exports = function( text ) {
	text = text.replace( /[\[\]\{\}\(\)\*\+\?\^\$\|]/g, "" );
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
};

},{"../stringProcessing/stripHTMLTags.js":124,"../stringProcessing/stripSpaces.js":127}],122:[function(require,module,exports){
var wordCount = require( "./countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesWordCount = [];
	forEach( sentences, function( sentence ) {
		var length = wordCount( sentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: wordCount( sentence )
		} );
	} );

	return sentencesWordCount;
};

},{"./countWords.js":103,"lodash/forEach":295}],123:[function(require,module,exports){
/** @module stringProcessing/stringToRegex */
var isUndefined = require( "lodash/isUndefined" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 * @returns {RegExp} regex The regex made from the keyword
 */
module.exports = function( string, extraBoundary, doReplaceDiacritics ) {
	if ( isUndefined( extraBoundary ) ) {
		extraBoundary = "";
	}

	if ( isUndefined( doReplaceDiacritics ) || doReplaceDiacritics === true ) {
		string = replaceDiacritics( string );
	}

	string = sanitizeString( string );
	string = addWordBoundary( string, extraBoundary );
	return new RegExp( string, "ig" );
};

},{"../stringProcessing/addWordboundary.js":98,"../stringProcessing/replaceDiacritics.js":119,"../stringProcessing/sanitizeString.js":121,"lodash/isUndefined":317}],124:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":127}],125:[function(require,module,exports){
/** @module stringProcessing/stripNonTextTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strips all tags from the text, except li, p, dd and h1-h6 tags from the text that contain content to check.
 *
 * @param {string} text The text to strip tags from
 * @returns {string} The text stripped of tags, except for li, p, dd and h1-h6 tags.
 */
module.exports = function( text ) {
	text = text.replace( /<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "" );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":127}],126:[function(require,module,exports){
/** @module stringProcessing/stripNumbers */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with numberonly words removed.
 */

module.exports = function( text ) {

	// Remove "words" comprised only of numbers
	text = text.replace( /\b[0-9]+\b/g, "" );

	text = stripSpaces( text );

	if ( text === "." ) {
		text = "";
	}
	return text;
};

},{"../stringProcessing/stripSpaces.js":127}],127:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {

	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}],128:[function(require,module,exports){
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				replaceDiacritics( formattedHeaders ).match( stringToRegex( keyword ) ) ||
				replaceDiacritics( matches[ i ] ).match( stringToRegex( keyword ) )
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};

},{"../config/removalWords.js":42,"../stringProcessing/replaceDiacritics.js":119,"../stringProcessing/replaceString.js":120,"../stringProcessing/stringToRegex.js":123}],129:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */

module.exports = function( text ) {

	// Replace &nbsp with space
	text = text.replace( "&nbsp;", " " );

	// Replace whitespaces with space
	text = text.replace( /\s/g, " " );

	return text;
};


},{}],130:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.6.1';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (value == null) {
      return '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value.
   * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
   * for more details.
   *
   * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
   * to reduce XSS vectors.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  /*--------------------------------------------------------------------------*/

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'assessmentPresenterResult': {},
    'snippetEditor': {}
  };

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<ul class="wpseoanalysis">\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n            ';
     if ( scores[ i ].marker ) {
    __p += '\n            <button type="button" class="assessment-results__mark icon-eye-inactive js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    '"></button>\n            ';
     }
    __p += '\n        </li>\n    ';
     }
    __p += '\n</ul>\n';

    }
    return __p
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview">\n    <section class="snippet-editor__preview">\n		<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n    <p class="screen-reader-text">' +
    __e( i18n.snippetPreviewDescription ) +
    '</p>\n\n        <div class="snippet_container snippet-editor__container" id="title_container">\n            <span class="screen-reader-text">' +
    __e( i18n.titleLabel ) +
    '</span>\n            <span class="title" id="snippet_title">\n                ' +
    __e( rendered.title ) +
    '\n            </span>\n            <span class="title" id="snippet_sitename"></span>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="url_container">\n            <span class="screen-reader-text">' +
    __e( i18n.slugLabel ) +
    '</span>\n            <cite class="url urlBase" id="snippet_citeBase">\n                ' +
    __e( rendered.baseUrl ) +
    '\n            </cite>\n            <cite class="url" id="snippet_cite">\n                ' +
    __e( rendered.snippetCite ) +
    '\n            </cite>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="meta_container">\n            <span class="screen-reader-text">' +
    __e( i18n.metaDescriptionLabel ) +
    '</span>\n            ';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n                <span class="snippet-editor__date">\n                    ' +
    __e( metaDescriptionDate ) +
    ' -\n                </span>\n            ';
     }
    __p += '\n            <span class="desc" id="snippet_meta">\n                ' +
    __e( rendered.meta ) +
    '\n            </span>\n        </div>\n\n        <button class="snippet-editor__button snippet-editor__edit-button" type="button" aria-expanded="false">\n            ' +
    __e( i18n.edit ) +
    '\n        </button>\n    </section>\n\n    <div class="snippet-editor__form snippet-editor--hidden">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n\n        <button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n    </div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = templates).templates = templates;
    }
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],131:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );

/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
var emptyMarker = function() {
	return [];
};

/**
 * Construct the AssessmentResult value object.
 * @constructor
 */
var AssessmentResult = function() {
	this._hasScore = false;
	this._identifier = "";
	this._marker = emptyMarker;
	this.score = 0;
	this.text = "";
};

/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function() {
	return this._hasScore;
};

/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function() {
	return this.score;
};

/**
 * Set the score for the assessment.
 * @param {number} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function( score ) {
	if ( isNumber( score ) ) {
		this.score = score;
		this._hasScore = true;
	}
};

/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function() {
	return this.text !== "";
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function() {
	return this.text;
};

/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function( text ) {
	if ( isUndefined( text ) ) {
		text = "";
	}

	this.text = text;
};

/**
 * Sets the identifier
 *
 * @param {string} identifier An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.setIdentifier = function( identifier ) {
	this._identifier = identifier;
};

/**
 * Gets the identifier
 *
 * @returns {string} An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.getIdentifier = function() {
	return this._identifier;
};

/**
 * Sets the marker, a pure function that can return the marks for a given Paper
 *
 * @param {Function} marker The marker to set.
 */
AssessmentResult.prototype.setMarker = function( marker ) {
	this._marker = marker;
};

/**
 * Returns whether or not this result has a marker that can be used to mark for a given Paper
 *
 * @returns {boolean} Whether or this result has a marker.
 */
AssessmentResult.prototype.hasMarker = function() {
	return this._marker !== emptyMarker;
};

/**
 * Gets the marker, a pure function that an return the marks for a given Paper
 *
 * @returns {Function} The marker.
 */
AssessmentResult.prototype.getMarker = function() {
	return this._marker;
};

module.exports = AssessmentResult;

},{"lodash/isNumber":310,"lodash/isUndefined":317}],132:[function(require,module,exports){
var defaults = require( "lodash/defaults" );

/**
 * Represents a marked piece of text
 *
 * @param {Object} properties The properties of this Mark.
 * @param {string} properties.original The original text that should be marked.
 * @param {string} properties.marked The new text including marks.
 * @constructor
 */
function Mark( properties ) {
	defaults( properties, { original: "", marked: "" } );

	this._properties = properties;
}


/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._properties.original;
};

/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._properties.marked;
};

/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	return text.replace( this._properties.original, this._properties.marked );
};

module.exports = Mark;

},{"lodash/defaults":288}],133:[function(require,module,exports){
var defaults = require( "lodash/defaults" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
	keyword: "",
	description: "",
	title: "",
	url: "",
	locale: "en_US"
};

/**
 * Sanitize attributes before they are assigned to the Paper.
 * @param {object} attributes The attributes that need sanitizing.
 * @returns {object} The attributes passed to the Paper.
 */
var sanitizeAttributes = function( attributes ) {
	attributes.keyword = sanitizeString( attributes.keyword );

	return attributes;
};

/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function( text, attributes ) {
	this._text = text || "";

	attributes = attributes || {};
	defaults( attributes, defaultAttributes );
	this._attributes = sanitizeAttributes( attributes );
};

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function() {
	return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._attributes.keyword;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function() {
	return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function() {
	return this._text;
};

/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function() {
	return this._attributes.description !== "";
};

/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function() {
	return this._attributes.description;
};

/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function() {
	return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function() {
	return this._attributes.title;
};

/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function() {
	return this._attributes.url !== "";
};

/**
 * Return the url, or an empty string of no url is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function() {
	return this._attributes.url;
};

/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function() {
	return this._attributes.locale !== "";
};

/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function() {
	return this._attributes.locale;
};

module.exports = Paper;

},{"../stringProcessing/sanitizeString.js":121,"lodash/defaults":288}],134:[function(require,module,exports){
arguments[4][133][0].apply(exports,arguments)
},{"../stringProcessing/sanitizeString.js":121,"dup":133,"lodash/defaults":288}],135:[function(require,module,exports){
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton
WTFPL license for use
Dojo CLA for contributions

Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define('jed', function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);

},{}],136:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":232,"./_root":273}],137:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":238,"./_hashDelete":239,"./_hashGet":240,"./_hashHas":241,"./_hashSet":242}],138:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":259,"./_listCacheDelete":260,"./_listCacheGet":261,"./_listCacheHas":262,"./_listCacheSet":263}],139:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":232,"./_root":273}],140:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":264,"./_mapCacheDelete":265,"./_mapCacheGet":266,"./_mapCacheHas":267,"./_mapCacheSet":268}],141:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":232,"./_root":273}],142:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":273}],143:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":232,"./_root":273}],144:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":140,"./_setCacheAdd":274,"./_setCacheHas":275}],145:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":138,"./_stackClear":277,"./_stackDelete":278,"./_stackGet":279,"./_stackHas":280,"./_stackSet":281}],146:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":273}],147:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":273}],148:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":232,"./_root":273}],149:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `Map#set` because it doesn't return the map instance in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],150:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],151:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],152:[function(require,module,exports){
/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

module.exports = arrayAggregator;

},{}],153:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],154:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],155:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":181}],156:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],157:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],158:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],159:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],160:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],161:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":291}],162:[function(require,module,exports){
var eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;

},{"./eq":291}],163:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":291}],164:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":291}],165:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

module.exports = baseAggregator;

},{"./_baseEach":170}],166:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":218,"./keys":318}],167:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  // Recursively populate clone (susceptible to call stack limits).
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":145,"./_arrayEach":153,"./_assignValue":163,"./_baseAssign":166,"./_cloneBuffer":208,"./_copyArray":217,"./_copySymbols":219,"./_getAllKeys":228,"./_getTag":235,"./_initCloneArray":245,"./_initCloneByTag":246,"./_initCloneObject":247,"./_isHostObject":250,"./isArray":301,"./isBuffer":304,"./isObject":311,"./keys":318}],168:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":311}],169:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./_SetCache":144,"./_arrayIncludes":155,"./_arrayIncludesWith":156,"./_arrayMap":157,"./_baseUnary":202,"./_cacheHas":204}],170:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":175,"./_createBaseEach":223}],171:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./_baseEach":170}],172:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],173:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":158,"./_isFlattenable":248}],174:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":224}],175:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":174,"./keys":318}],176:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":205,"./_isKey":253,"./_toKey":283}],177:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":158,"./isArray":301}],178:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return object != null &&
    (hasOwnProperty.call(object, key) ||
      (typeof object == 'object' && key in object && getPrototype(object) === null));
}

module.exports = baseHas;

},{"./_getPrototype":233}],179:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],180:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

module.exports = baseInRange;

},{}],181:[function(require,module,exports){
var indexOfNaN = require('./_indexOfNaN');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./_indexOfNaN":244}],182:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":183,"./isObject":311,"./isObjectLike":312}],183:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":145,"./_equalArrays":225,"./_equalByTag":226,"./_equalObjects":227,"./_getTag":235,"./_isHostObject":250,"./isArray":301,"./isTypedArray":316}],184:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":145,"./_baseIsEqual":182}],185:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isHostObject":250,"./_isMasked":255,"./_toSource":284,"./isFunction":307,"./isObject":311}],186:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":190,"./_baseMatchesProperty":191,"./identity":298,"./isArray":301,"./property":326}],187:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

module.exports = baseKeys;

},{}],188:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

},{"./_Reflect":142,"./_iteratorToArray":258}],189:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":170,"./isArrayLike":302}],190:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":184,"./_getMatchData":231,"./_matchesStrictComparable":270}],191:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":182,"./_isKey":253,"./_isStrictComparable":257,"./_matchesStrictComparable":270,"./_toKey":283,"./get":296,"./hasIn":297}],192:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  if (!(isArray(source) || isTypedArray(source))) {
    var props = keysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

module.exports = baseMerge;

},{"./_Stack":145,"./_arrayEach":153,"./_assignMergeValue":162,"./_baseMergeDeep":193,"./isArray":301,"./isObject":311,"./isTypedArray":316,"./keysIn":319}],193:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
      else {
        newValue = objValue;
      }
    }
    else {
      isCommon = false;
    }
  }
  stack.set(srcValue, newValue);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
  }
  stack['delete'](srcValue);
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;

},{"./_assignMergeValue":162,"./_baseClone":167,"./_copyArray":217,"./isArguments":300,"./isArray":301,"./isArrayLikeObject":303,"./isFunction":307,"./isObject":311,"./isPlainObject":313,"./isTypedArray":316,"./toPlainObject":336}],194:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;

},{"./_arrayMap":157,"./_baseIteratee":186,"./_baseMap":189,"./_baseSortBy":198,"./_baseUnary":202,"./_compareMultiple":216,"./identity":298}],195:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],196:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":176}],197:[function(require,module,exports){
/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;

},{}],198:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],199:[function(require,module,exports){
/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

module.exports = baseSum;

},{}],200:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],201:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":146,"./isSymbol":315}],202:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing wrapper metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],203:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":157}],204:[function(require,module,exports){
/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],205:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":282,"./isArray":301}],206:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = checkGlobal;

},{}],207:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":147}],208:[function(require,module,exports){
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],209:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":207}],210:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":149,"./_arrayReduce":159,"./_mapToArray":269}],211:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],212:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":150,"./_arrayReduce":159,"./_setToArray":276}],213:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":146}],214:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":207}],215:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":315}],216:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":215}],217:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],218:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":163}],219:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":218,"./_getSymbols":234}],220:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":273}],221:[function(require,module,exports){
var arrayAggregator = require('./_arrayAggregator'),
    baseAggregator = require('./_baseAggregator'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee), accumulator);
  };
}

module.exports = createAggregator;

},{"./_arrayAggregator":152,"./_baseAggregator":165,"./_baseIteratee":186,"./isArray":301}],222:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_isIterateeCall":252,"./rest":328}],223:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":302}],224:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],225:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":144,"./_arraySome":160}],226:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and
      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
      // not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object) ? other != +other : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;
      stack.set(object, other);

      // Recursively compare objects (susceptible to call stack limits).
      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":146,"./_Uint8Array":147,"./_equalArrays":225,"./_mapToArray":269,"./_setToArray":276}],227:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  return result;
}

module.exports = equalObjects;

},{"./_baseHas":178,"./keys":318}],228:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":177,"./_getSymbols":234,"./keys":318}],229:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":195}],230:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":254}],231:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":257,"./keys":318}],232:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":185,"./_getValue":236}],233:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],234:[function(require,module,exports){
var stubArray = require('./stubArray');

/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  // Coerce `object` to an object to avoid non-object errors in V8.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
  return getOwnPropertySymbols(Object(object));
}

// Fallback for IE < 11.
if (!getOwnPropertySymbols) {
  getSymbols = stubArray;
}

module.exports = getSymbols;

},{"./stubArray":330}],235:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":136,"./_Map":139,"./_Promise":141,"./_Set":143,"./_WeakMap":148,"./_toSource":284}],236:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],237:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":205,"./_isIndex":251,"./_isKey":253,"./_toKey":283,"./isArguments":300,"./isArray":301,"./isLength":308,"./isString":314}],238:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

module.exports = hashClear;

},{"./_nativeCreate":272}],239:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],240:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":272}],241:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":272}],242:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":272}],243:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":200,"./isArguments":300,"./isArray":301,"./isLength":308,"./isString":314}],244:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],245:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],246:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":207,"./_cloneDataView":209,"./_cloneMap":210,"./_cloneRegExp":211,"./_cloneSet":212,"./_cloneSymbol":213,"./_cloneTypedArray":214}],247:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":168,"./_getPrototype":233,"./_isPrototype":256}],248:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray');

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value);
}

module.exports = isFlattenable;

},{"./isArguments":300,"./isArray":301}],249:[function(require,module,exports){
var isArray = require('./isArray'),
    isFunction = require('./isFunction');

/**
 * Checks if `value` is a flattenable array and not a `_.matchesProperty`
 * iteratee shorthand.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenableIteratee(value) {
  return isArray(value) && !(value.length == 2 && !isFunction(value[0]));
}

module.exports = isFlattenableIteratee;

},{"./isArray":301,"./isFunction":307}],250:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],251:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],252:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":251,"./eq":291,"./isArrayLike":302,"./isObject":311}],253:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":301,"./isSymbol":315}],254:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],255:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":220}],256:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],257:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":311}],258:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],259:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],260:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":164}],261:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":164}],262:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":164}],263:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":164}],264:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":137,"./_ListCache":138,"./_Map":139}],265:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":230}],266:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":230}],267:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":230}],268:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":230}],269:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],270:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],271:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    isObject = require('./isObject');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
  }
  return objValue;
}

module.exports = mergeDefaults;

},{"./_baseMerge":192,"./isObject":311}],272:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":232}],273:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(typeof self == 'object' && self);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(typeof this == 'object' && this);

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":206}],274:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],275:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],276:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],277:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = stackClear;

},{"./_ListCache":138}],278:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],279:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],280:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],281:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
    cache = this.__data__ = new MapCache(cache.__data__);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":138,"./_MapCache":140}],282:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":321,"./toString":337}],283:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":315}],284:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],285:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./_copyObject":218,"./_createAssigner":222,"./keysIn":319}],286:[function(require,module,exports){
var baseClone = require('./_baseClone');

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, false, true);
}

module.exports = clone;

},{"./_baseClone":167}],287:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide an options object to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":311,"./now":324,"./toNumber":335}],288:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    rest = require('./rest');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = rest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":151,"./_assignInDefaults":161,"./assignInWith":285,"./rest":328}],289:[function(require,module,exports){
var apply = require('./_apply'),
    mergeDefaults = require('./_mergeDefaults'),
    mergeWith = require('./mergeWith'),
    rest = require('./rest');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = rest(function(args) {
  args.push(undefined, mergeDefaults);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;

},{"./_apply":151,"./_mergeDefaults":271,"./mergeWith":323,"./rest":328}],290:[function(require,module,exports){
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    rest = require('./rest');

/**
 * Creates an array of unique `array` values not included in the other given
 * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = rest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;

},{"./_baseDifference":169,"./_baseFlatten":173,"./isArrayLikeObject":303,"./rest":328}],291:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],292:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

},{"./_arrayFilter":154,"./_baseFilter":171,"./_baseIteratee":186,"./isArray":301}],293:[function(require,module,exports){
var findIndex = require('./findIndex'),
    isArrayLike = require('./isArrayLike'),
    values = require('./values');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
function find(collection, predicate, fromIndex) {
  collection = isArrayLike(collection) ? collection : values(collection);
  var index = findIndex(collection, predicate, fromIndex);
  return index > -1 ? collection[index] : undefined;
}

module.exports = find;

},{"./findIndex":294,"./isArrayLike":302,"./values":338}],294:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":172,"./_baseIteratee":186,"./toInteger":334}],295:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":153,"./_baseEach":170,"./_baseIteratee":186,"./isArray":301}],296:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":176}],297:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":179,"./_hasPath":237}],298:[function(require,module,exports){
/**
 * This method returns the first argument given to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],299:[function(require,module,exports){
var baseInRange = require('./_baseInRange'),
    toNumber = require('./toNumber');

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toNumber(start) || 0;
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toNumber(end) || 0;
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;

},{"./_baseInRange":180,"./toNumber":335}],300:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":303}],301:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],302:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":229,"./isFunction":307,"./isLength":308}],303:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":302,"./isObjectLike":312}],304:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? stubFalse : function(value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;

},{"./_root":273,"./stubFalse":331}],305:[function(require,module,exports){
var isObjectLike = require('./isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element,
 *  else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"./isObjectLike":312,"./isPlainObject":313}],306:[function(require,module,exports){
var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || isString(value) || isFunction(value.splice) ||
        isArguments(value) || isBuffer(value))) {
    return !value.length;
  }
  if (isObjectLike(value)) {
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return !(nonEnumShadows && keys(value).length);
}

module.exports = isEmpty;

},{"./_getTag":235,"./isArguments":300,"./isArray":301,"./isArrayLike":302,"./isBuffer":304,"./isFunction":307,"./isObjectLike":312,"./isString":314,"./keys":318}],307:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":311}],308:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],309:[function(require,module,exports){
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":310}],310:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNumber;

},{"./isObjectLike":312}],311:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],312:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],313:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":233,"./_isHostObject":250,"./isObjectLike":312}],314:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":301,"./isObjectLike":312}],315:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":312}],316:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

},{"./isLength":308,"./isObjectLike":312}],317:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],318:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":178,"./_baseKeys":187,"./_indexKeys":243,"./_isIndex":251,"./_isPrototype":256,"./isArrayLike":302}],319:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"./_baseKeysIn":188,"./_indexKeys":243,"./_isIndex":251,"./_isPrototype":256}],320:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":157,"./_baseIteratee":186,"./_baseMap":189,"./isArray":301}],321:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":140}],322:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;

},{"./_baseMerge":192,"./_createAssigner":222}],323:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with seven arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;

},{"./_baseMerge":192,"./_createAssigner":222}],324:[function(require,module,exports){
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
function now() {
  return Date.now();
}

module.exports = now;

},{}],325:[function(require,module,exports){
var createAggregator = require('./_createAggregator');

/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the array of grouped elements.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ];
 *
 * _.partition(users, function(o) { return o.active; });
 * // => objects for [['fred'], ['barney', 'pebbles']]
 *
 * // The `_.matches` iteratee shorthand.
 * _.partition(users, { 'age': 1, 'active': false });
 * // => objects for [['pebbles'], ['barney', 'fred']]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.partition(users, ['active', false]);
 * // => objects for [['barney', 'pebbles'], ['fred']]
 *
 * // The `_.property` iteratee shorthand.
 * _.partition(users, 'active');
 * // => objects for [['fred'], ['barney', 'pebbles']]
 */
var partition = createAggregator(function(result, value, key) {
  result[key ? 0 : 1].push(value);
}, function() { return [[], []]; });

module.exports = partition;

},{"./_createAggregator":221}],326:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":195,"./_basePropertyDeep":196,"./_isKey":253,"./_toKey":283}],327:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;

},{"./_arrayReduce":159,"./_baseEach":170,"./_baseIteratee":186,"./_baseReduce":197,"./isArray":301}],328:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./_apply":151,"./toInteger":334}],329:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    isArray = require('./isArray'),
    isFlattenableIteratee = require('./_isFlattenableIteratee'),
    isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = rest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
    ? iteratees[0]
    : baseFlatten(iteratees, 1, isFlattenableIteratee);

  return baseOrderBy(collection, iteratees, []);
});

module.exports = sortBy;

},{"./_baseFlatten":173,"./_baseOrderBy":194,"./_isFlattenableIteratee":249,"./_isIterateeCall":252,"./isArray":301,"./rest":328}],330:[function(require,module,exports){
/**
 * A method that returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],331:[function(require,module,exports){
/**
 * A method that returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],332:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

module.exports = sum;

},{"./_baseSum":199,"./identity":298}],333:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":335}],334:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":333}],335:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":307,"./isObject":311,"./isSymbol":315}],336:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;

},{"./_copyObject":218,"./keysIn":319}],337:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":201}],338:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = values;

},{"./_baseValues":203,"./keys":318}],339:[function(require,module,exports){
/* global wpseoPostScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string}
 */
function getDescriptionPlaceholder( l10n ) {
	var descriptionPlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoPostScraperL10n.metadesc_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoTermScraperL10n.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;

},{"lodash/isUndefined":464}],340:[function(require,module,exports){
var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore( score ) {
	// Scale because scoreToRating works from 0 to 10.
	score /= 10;

	var app = YoastSEO.app;
	var indicator = {
		className: '',
		screenReaderText: '',
		fullText: ''
	};

	if ( ! isUndefined( app.contentAssessorPresenter ) ) {
		indicator = app.contentAssessorPresenter.getIndicator( scoreToRating( score ) );
	}

	return indicator;
}

module.exports = getIndicatorForScore;

},{"lodash/isUndefined":464,"yoastseo":1}],341:[function(require,module,exports){
/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string}
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		titlePlaceholder = window.wpseoPostScraperL10n.title_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		titlePlaceholder = window.wpseoTermScraperL10n.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"lodash/isUndefined":464}],342:[function(require,module,exports){
/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaults = require( 'lodash/defaults' );

var $ = jQuery;

var defaultArguments = {
	keyword: '',
	prefix: '',
	basedOn: '',
	onActivate: function ( ) { },
	afterActivate: function ( ) { },
	active: false,

	scoreClass: 'na',
	scoreText: '',

	showKeyword: true,
	isKeywordTab: true
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaults( args, defaultArguments );

		this.keyword = args.keyword;
		this.prefix  = args.prefix;
		this.basedOn = args.basedOn;
		this.onActivate = args.onActivate;
		this.afterActivate = args.afterActivate;
		this.active = args.active;
		this.scoreClass = args.scoreClass;
		this.scoreText = args.scoreText;

		this.showKeyword = args.showKeyword;
		this.isKeywordTab = args.isKeywordTab;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 * @param {string} position Either prepend or append for the position in the parent.
	 */
	KeywordTab.prototype.init = function( parent, position ) {
		this.setElement( this.render() );
		var $parent = $( parent );

		if ( 'prepend' === position ) {
			$parent.prepend( this.element );
		} else {
			$parent.append( this.element );
		}
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 * @param {string=""} keyword
	 */
	KeywordTab.prototype.update = function( scoreClass, scoreText, keyword ) {
		if ( ! isUndefined( keyword ) ) {
			this.keyword = keyword;
		}
		this.setScoreClass( scoreClass );
		this.setScoreText( scoreText );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = this.render();

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {Object} jQuery HTML object.
	 */
	KeywordTab.prototype.render = function() {
		var placeholder = this.keyword.length > 0 ? this.keyword : '...';

		if ( ! this.showKeyword ) {
			placeholder = '';
		}

		var html = wp.template( 'keyword_tab' )({
			keyword: this.keyword,
			placeholder: placeholder,
			score: this.scoreClass,
			hideRemove: true,
			prefix: this.prefix + ' ',
			active: this.active,
			basedOn: this.basedOn,
			scoreText: this.scoreText,
			isKeywordTab: this.isKeywordTab
		});

		return jQuery( html );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	KeywordTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );

		this.addEventHandler();
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {string} scoreClass
	 */
	KeywordTab.prototype.setScoreClass = function( scoreClass ) {
		this.scoreClass = scoreClass;
	};

	/**
	 * Formats the given score text and store it in the attribute.
	 *
	 * @param {string} scoreText
	 */
	KeywordTab.prototype.setScoreText = function( scoreText ) {
		this.scoreText = scoreText;
	};

	/**
	 * Adds event handler to tab
	 */
	KeywordTab.prototype.addEventHandler = function() {
		$( this.element ).on( 'click', this.onClick.bind( this ) );
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	KeywordTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.onActivate();

		$( '.wpseo_keyword_tab' ).removeClass( 'active' );
		this.active = true;
		this.refresh();

		this.afterActivate();
	};

	/**
	 * Returns the keyword for this keyword tab
	 */
	KeywordTab.prototype.getKeyword = function() {
		return this.element.find( '.wpseo_tablink' ).data( 'keyword' );
	};

	return KeywordTab;
})();

},{"lodash/defaults":446,"lodash/isUndefined":464}],343:[function(require,module,exports){
var defaultsDeep = require( 'lodash/defaultsDeep' );

var getIndicatorForScore = require( './getIndicatorForScore' );
var KeywordTab = require( './keywordTab' );

var $ = jQuery;

var defaultArguments = {
	strings: {
		keywordTab: '',
		contentTab: '',
		basedOn: ''
	},
	focusKeywordField: "#yoast_wpseo_focuskw"
};

/**
 * The tab manager is responsible for managing the analysis tabs in the metabox
 *
 * @constructor
 */
function TabManager( arguments ) {
	arguments = arguments || {};

	defaultsDeep( arguments, defaultArguments );

	this.arguments = arguments;
	this.strings = arguments.strings;
}

/**
 * Initializes the two tabs and
 */
TabManager.prototype.init = function() {
	var metaboxTabs = $( '#wpseo-metabox-tabs' );

	this.focusKeywordInput = $( '#yoast_wpseo_focuskw_text_input,#wpseo_focuskw' );
	this.focusKeywordRow = this.focusKeywordInput.closest( 'tr' );
	this.contentAnalysis = $( '#yoast-seo-content-analysis' );
	this.keywordAnalysis = $( '#wpseo-pageanalysis,#wpseo_analysis' );

	var initialKeyword   = $( this.arguments.focusKeywordField ).val();

	// We start on the content analysis 'tab'.
	this.contentAnalysis.show();
	this.keywordAnalysis.hide();
	this.focusKeywordRow.hide();
	this.focusKeywordInput.val( '' );

	// Initialize an instance of the keyword tab.
	this.mainKeywordTab = new KeywordTab(
		{
			keyword: initialKeyword,
			prefix: this.strings.keywordTab,
			basedOn: this.strings.basedOn,
			onActivate: function() {
				this.showKeywordAnalysis();
				this.deactivateContentTab();

				this.focusKeywordInput.val( this.mainKeywordTab.getKeyword() );

			}.bind( this ),
			afterActivate: function() {
				YoastSEO.app.refresh();
			}
		}
	);

	this.mainKeywordTab.init( metaboxTabs, 'prepend' );

	this.contentTab = new KeywordTab( {
		active: true,
		prefix: this.strings.contentTab,
		basedOn: '',
		showKeyword: false,
		isKeywordTab: false,
		onActivate: function() {
			this.showContentAnalysis();

			this.focusKeywordInput.val( '' );

			this.mainKeywordTab.active = false;
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		}
	} );

	this.contentTab.init( metaboxTabs, 'prepend' );

	$( '.yoast-seo__remove-tab' ).remove();

	this.focusKeywordInput.val( '' );

	// Prevent us from saving an empty focus keyword when we are on the content tab.
	$( '#edittag' ).on( 'submit', function() {
		this.focusKeywordInput.val( this.mainKeywordTab.getKeyword() );
	}.bind( this ) );
};

/**
 * Shows the keyword analysis elements.
 */
TabManager.prototype.showKeywordAnalysis = function() {
	this.focusKeywordRow.show();
	this.keywordAnalysis.show();
	this.contentAnalysis.hide();
};

/**
 * Shows the content analysis elements.
 */
TabManager.prototype.showContentAnalysis = function() {
	this.focusKeywordRow.hide();
	this.keywordAnalysis.hide();
	this.contentAnalysis.show();
};

/**
 * Deactivates the content tab (this will not re-render the tab.)
 */
TabManager.prototype.deactivateContentTab = function() {
	this.contentTab.active = false;
};

/**
 * Updates the content tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 */
TabManager.prototype.updateContentTab = function( score ) {
	var indicator = getIndicatorForScore( score );

	if ( this.contentTab.active ) {
		this.contentTab.update( indicator.className, indicator.screenReaderText );
	}
};

/**
 * Updates the keyword tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 * @param {string} keyword The keyword that has been used to calculate the score.
 */
TabManager.prototype.updateKeywordTab = function( score, keyword ) {
	var indicator = getIndicatorForScore( score );

	if ( this.mainKeywordTab.active ) {
		this.mainKeywordTab.update( indicator.className, indicator.screenReaderText, keyword );

	} else {
		// This branch makes sure that we see a color when loading the page.
		indicator = getIndicatorForScore( $( '#yoast_wpseo_linkdex,#hidden_wpseo_linkdex' ).val() );

		this.mainKeywordTab.update( indicator.className, indicator.screenReaderText );
	}
};

/**
 * Returns whether or not the keyword is the main keyword
 *
 * @param {string} keyword The keyword to check
 *
 * @returns {boolean}
 */
TabManager.prototype.isMainKeyword = function( keyword ) {
	return this.mainKeywordTab.getKeyword() === keyword;
};

/**
 * Returns the keyword tab object
 *
 * @returns {KeywordTab} The keyword tab object.
 */
TabManager.prototype.getKeywordTab = function() {
	return this.mainKeywordTab;
};

/**
 * Returns the content tab object
 *
 * @returns {KeywordTab} The content tab object.
 */
TabManager.prototype.getContentTab = function() {
	return this.contentTab;
};

module.exports = TabManager;

},{"./getIndicatorForScore":340,"./keywordTab":342,"lodash/defaultsDeep":447}],344:[function(require,module,exports){
/* global jQuery, ajaxurl */

var UsedKeywordsPlugin = require( 'yoastseo' ).bundledPlugins.usedKeywords;
var _has = require( 'lodash/has' );
var _debounce = require( 'lodash/debounce' );
var $ = jQuery;

/**
 * Object that handles keeping track if the current keyword has been used before and retrieves this usage from the
 * server.
 *
 * @param {string} focusKeywordElement A jQuery selector for the focus keyword input element.
 * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
 * @param {Object} options The options for the used keywords assessment plugin.
 * @param {Object} options.keyword_usage An object that contains the keyword usage when instantiating.
 * @param {Object} options.search_url The URL to link the user to if the keyword has been used multiple times.
 * @param {Object} options.post_edit_url The URL to link the user to if the keyword has been used a single time.
 * @param {App} app The app for which to keep track of the used keywords.
 */
function UsedKeywords( focusKeywordElement, ajaxAction, options, app ) {
	this._keywordUsage = options.keyword_usage;
	this._focusKeywordElement = $( focusKeywordElement );

	this._plugin = new UsedKeywordsPlugin( app, {
		usedKeywords: options.keyword_usage,
		searchUrl: options.search_url,
		postUrl: options.post_edit_url
	}, app.i18n );

	this._postID = $( '#post_ID' ).val();
	this._ajaxAction = ajaxAction;
	this._app = app;
}

/**
 * Initializes everything necessary for used keywords
 */
UsedKeywords.prototype.init = function() {
	var eventHandler = _debounce( this.keywordChangeHandler.bind( this ), 500 );

	this._plugin.registerPlugin();
	this._focusKeywordElement.on( 'keyup', eventHandler );
};

/**
 * Handles an event of the keyword input field
 */
UsedKeywords.prototype.keywordChangeHandler = function() {
	var keyword = this._focusKeywordElement.val();

	if ( ! _has( this._keywordUsage, keyword ) ) {
		this.requestKeywordUsage( keyword );
	}
};

/**
 * Request keyword usage from the server
 *
 * @param {string} keyword The keyword to request the usage for.
 */
UsedKeywords.prototype.requestKeywordUsage = function( keyword ) {
	$.post( ajaxurl, {
		action: this._ajaxAction,
		post_id: this._postID,
		keyword: keyword
	}, this.updateKeywordUsage.bind( this, keyword ), 'json' );
};

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	if ( response ) {
		this._keywordUsage[ keyword ] = response;

		this._plugin.updateKeywordUsage( this._keywordUsage );
		this._app.analyzeTimer();
	}
};

module.exports = UsedKeywords;

},{"lodash/debounce":445,"lodash/has":449,"yoastseo":1}],345:[function(require,module,exports){
var Assessor = require( "yoastseo/js/assessor.js" );

var fleschReadingEase = require( "yoastseo/js/assessments/fleschReadingEaseAssessment.js" );
var introductionKeyword = require( "yoastseo/js/assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "yoastseo/js/assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "yoastseo/js/assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "yoastseo/js/assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "yoastseo/js/assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "yoastseo/js/assessments/metaDescriptionLengthAssessment.js" );
var titleKeyword = require( "yoastseo/js/assessments/titleKeywordAssessment.js" );
var titleLength = require( "yoastseo/js/assessments/titleLengthAssessment.js" );
var urlKeyword = require( "yoastseo/js/assessments/urlKeywordAssessment.js" );
var urlLength = require( "yoastseo/js/assessments/urlLengthAssessment.js" );
var urlStopWords = require( "yoastseo/js/assessments/urlStopWordsAssessment.js" );
var taxonomyTextLength = require( 'yoastseo/js/assessments/taxonomyTextLengthAssessment' );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = {
		fleschReadingEase:      fleschReadingEase,
		introductionKeyword:    introductionKeyword,
		keyphraseLength:        keyphraseLength,
		keywordDensity:         keywordDensity,
		keywordStopWords:       keywordStopWords,
		metaDescriptionKeyword: metaDescriptionKeyword,
		metaDescriptionLength:  metaDescriptionLength,
		taxonomyTextLength:     taxonomyTextLength,
		titleKeyword:           titleKeyword,
		titleLength:            titleLength,
		urlKeyword:             urlKeyword,
		urlLength:              urlLength,
		urlStopWords:           urlStopWords
	};
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"util":478,"yoastseo/js/assessments/fleschReadingEaseAssessment.js":5,"yoastseo/js/assessments/introductionKeywordAssessment.js":7,"yoastseo/js/assessments/keyphraseLengthAssessment.js":8,"yoastseo/js/assessments/keywordDensityAssessment.js":9,"yoastseo/js/assessments/keywordStopWordsAssessment.js":10,"yoastseo/js/assessments/metaDescriptionKeywordAssessment.js":11,"yoastseo/js/assessments/metaDescriptionLengthAssessment.js":12,"yoastseo/js/assessments/taxonomyTextLengthAssessment":24,"yoastseo/js/assessments/titleKeywordAssessment.js":30,"yoastseo/js/assessments/titleLengthAssessment.js":31,"yoastseo/js/assessments/urlKeywordAssessment.js":33,"yoastseo/js/assessments/urlLengthAssessment.js":34,"yoastseo/js/assessments/urlStopWordsAssessment.js":35,"yoastseo/js/assessor.js":37}],346:[function(require,module,exports){
/* global YoastSEO: true, wpseoTermScraperL10n, tinyMCE, YoastReplaceVarPlugin, console, require */

var getTitlePlaceholder = require( './analysis/getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './analysis/getDescriptionPlaceholder' );
var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );

(function( $ ) {
	'use strict';

	var App = require( 'yoastseo' ).App;
	var SnippetPreview = require( 'yoastseo' ).SnippetPreview;

	var TaxonomyAssessor = require( './assessors/taxonomyAssessor' );
	var UsedKeywords = require( './analysis/usedKeywords' );

	var app, snippetPreview;

	var termSlugInput;

	var tabManager;

	var TermScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * returns data fetched from inputfields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		return {
			name: this.getDataFromInput( 'name' ),
			title: this.getDataFromInput( 'title' ),
			keyword: this.getDataFromInput( 'keyword' ),
			text: this.getDataFromInput( 'text' ),
			pageTitle: this.getDataFromInput( 'pageTitle' ),
			url: this.getDataFromInput( 'url' ),
			baseUrl: this.getDataFromInput( 'baseUrl' ),
			snippetTitle: this.getDataFromInput( 'title' ),
			meta: this.getDataFromInput( 'meta' ),
			snippetMeta: this.getDataFromInput( 'snippetMeta' ),
			snippetCite: this.getDataFromInput( 'cite' )
		};
	};

	/**
	 *
	 * @param {string} inputType
	 */
	TermScraper.prototype.getDataFromInput = function( inputType ) {
		var val = '';
		var elem;
		switch( inputType ){
			case 'keyword':
				elem = document.getElementById( 'wpseo_focuskw' );
				val = elem.value;
				if ( val === '' ) {
					val = document.getElementById( 'name' ).value;
					elem.placeholder = val;
				}
				break;
			case 'name':
				val = document.getElementById( 'name' ).value;
				break;
			case 'meta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'snippetMeta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'text':
				val = this.getContentTinyMCE();
				break;
			case 'pageTitle':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'title':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'url':
			case 'cite':
				val = document.getElementById( 'slug' ).value;
				break;
			case 'baseUrl':
				val = wpseoTermScraperL10n.base_url;
				break;
		}
		return val;
	};

	/**
	 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
	 * If tiny is hidden, take the value from the descriptionfield, since tinyMCE isn't updated when it isn't visible.
	 * @returns {String}
	 */
	TermScraper.prototype.getContentTinyMCE = function() {
		var val = document.getElementById( 'description' ).value;
		if ( typeof tinyMCE !== 'undefined' && typeof tinyMCE.editors !== 'undefined' && tinyMCE.editors.length !== 0 && tinyMCE.get( 'description' ).hidden === false ) {
			val = tinyMCE.get( 'description' ).getContent();
		}
		return val;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page
	 * @param {Object} value
	 * @param {String} type
	 */
	TermScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'hidden_wpseo_desc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'slug' ).value = value;
				break;
			case 'snippet_title':
				document.getElementById( 'hidden_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * The data passed from the snippet editor.
	 *
	 * @param {Object} data
	 * @param {string} data.title
	 * @param {string} data.urlPath
	 * @param {string} data.metaDesc
	 */
	TermScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	TermScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'name', 'description', 'slug', 'wpseo_focuskw' ];
		for (var i = 0; i < elems.length; i++) {
			var elem = document.getElementById(elems[i]);
			if (elem !== null) {
				document.getElementById(elems[i]).addEventListener('input', app.analyzeTimer.bind(app));
			}
		}
		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			//binds the input, change, cut and paste event to tinyMCE. All events are needed, because sometimes tinyMCE doesn'
			//trigger them, or takes up to ten seconds to fire an event.
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( e ) {
				for (var i = 0; i < events.length; i++ ) {
					e.editor.on( events[i], app.analyzeTimer.bind( app ) );
				}
			});
		}
	};

	/**
	 * creates SVG for the overall score.
	 *
	 * @param {number} score
	 */
	TermScraper.prototype.saveScores = function( score ) {
		var indicator = getIndicatorForScore( score );
		var keyword = this.getDataFromInput( 'keyword' );

		document.getElementById( 'hidden_wpseo_linkdex' ).value = score;
		jQuery( window ).trigger( 'YoastSEO:numericScore', score );

		tabManager.updateKeywordTab( score, keyword );

		$( '.yst-traffic-light' )
			.attr( 'class', 'yst-traffic-light ' + indicator.className )
			.attr( 'alt', indicator.screenReaderText );

		$( '.adminbar-seo-score' )
			.attr( 'class', 'wpseo-score-icon adminbar-seo-score ' + indicator.className )
			.attr( 'alt', indicator.screenReaderText );
	};

	/**
	 * Saves the content score to a hidden field
	 *
	 * @param {number} score The score calculated by the content assessor.
	 */
	TermScraper.prototype.saveContentScore = function( score ) {
		tabManager.updateContentTab( score );

		$( '#hidden_wpseo_content_score' ).val( score );
	};

	/**
	 * Initializes keyword tab with the correct template
	 */
	TermScraper.prototype.initKeywordTabTemplate = function() {
		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});
	};

	/**
	 * add new descriptionfield to content, creates new element via wp_editor and appends this to the term-description-wrap
	 * this way we can use the wp tinyMCE editor on the descriptionfield.
	 */
	var insertTinyMCE = function() {
		//gets the textNode from the original textField.
		var textNode = jQuery( '.term-description-wrap' ).find( 'td' ).find( 'textarea' ).val();

		var newEditor = document.getElementById( 'wp-description-wrap' );
		newEditor.style.display = 'none';
		var text = jQuery( '.term-description-wrap' ).find( 'td' ).find( 'p' );
		//empty the TD with the old description textarea
		jQuery( '.term-description-wrap' ).find( 'td' ).html( '' );
		//append the editor and the helptext
		jQuery( '.term-description-wrap' ).find( 'td' ).append( newEditor ).append( text );
		newEditor.style.display = 'block';
		document.getElementById('description').value = textNode;
	};

	/**
	 * Initializes the snippet preview
	 *
	 * @param {TermScraper} termScraper
	 * @returns {YoastSEO.SnippetPreview}
	 */
	function initSnippetPreview( termScraper ) {
		var data = termScraper.getData();

		var titlePlaceholder = getTitlePlaceholder();
		var descriptionPlaceholder = getDescriptionPlaceholder();

		var snippetPreviewArgs = {
			targetElement: document.getElementById( 'wpseo_snippet' ),
			placeholder: {
				title: titlePlaceholder,
				urlPath: ''
			},
			defaultValue: {
				title: titlePlaceholder
			},
			baseURL: wpseoTermScraperL10n.base_url,
			callbacks: {
				saveSnippetData: termScraper.saveSnippetData.bind( termScraper )
			},
			metaDescriptionDate: wpseoTermScraperL10n.metaDescriptionDate,
			data: {
				title: data.snippetTitle,
				urlPath: data.snippetCite,
				metaDesc: data.snippetMeta
			}
		};

		var metaPlaceholder = descriptionPlaceholder;
		if ( metaPlaceholder !== '' ) {
			snippetPreviewArgs.placeholder.metaDesc = metaPlaceholder;
			snippetPreviewArgs.defaultValue.metaDesc = metaPlaceholder;
		}

		return new SnippetPreview( snippetPreviewArgs );
	}

	/**
	 * Adds a watcher on the term slug input field
	 */
	function initTermSlugWatcher() {
		termSlugInput = $( '#slug' );
		termSlugInput.on( 'change', updatedTermSlug );
	}

	/**
	 * Function to handle when the user updates the term slug
	 */
	function updatedTermSlug() {
		snippetPreview.setUrlPath( termSlugInput.val() );
	}

	jQuery( document ).ready(function() {
		var args, termScraper, translations;

		insertTinyMCE();

		$( '#wpseo_analysis' ).after( '<div id="yoast-seo-content-analysis"></div>' );

		tabManager = new TabManager({
			strings: wpseoTermScraperL10n,
			focusKeywordField: '#wpseo_focuskw'
		});
		tabManager.init();

		termScraper = new TermScraper();

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ 'content', 'yoast_wpseo_focuskw', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full' ],
			targets: {
				output: 'wpseo_analysis',
				contentOutput: 'yoast-seo-content-analysis',
				snippet: 'wpseo_snippet'
			},
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
				bindElementEvents: termScraper.bindElementEvents.bind( termScraper ),
				saveScores: termScraper.saveScores.bind( termScraper ),
				saveContentScore: termScraper.saveContentScore.bind( termScraper ),
				saveSnippetData: termScraper.saveSnippetData.bind( termScraper )
			},
			locale: wpseoTermScraperL10n.locale
		};

		translations = wpseoTermScraperL10n.translations;

		if ( translations.length > 0 ) {
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
			delete( translations.locale_data['wordpress-seo'] );

			args.translations = translations;
		}

		snippetPreview = initSnippetPreview( termScraper );
		args.snippetPreview = snippetPreview;

		app = new App( args );

		app.assessor = new TaxonomyAssessor( app.i18n );

		window.YoastSEO = {};
		window.YoastSEO.app = app;

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );

		var usedKeywords = new UsedKeywords( '#wpseo_focuskw', 'get_term_keyword_usage', wpseoTermScraperL10n, app );
		usedKeywords.init();

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();

		jQuery( window ).trigger( 'YoastSEO:ready' );
	} );
}( jQuery ));

},{"./analysis/getDescriptionPlaceholder":339,"./analysis/getIndicatorForScore":340,"./analysis/getTitlePlaceholder":341,"./analysis/tabManager":343,"./analysis/usedKeywords":344,"./assessors/taxonomyAssessor":345,"yoastseo":1}],347:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],348:[function(require,module,exports){
arguments[4][136][0].apply(exports,arguments)
},{"./_getNative":399,"./_root":433,"dup":136}],349:[function(require,module,exports){
arguments[4][137][0].apply(exports,arguments)
},{"./_hashClear":404,"./_hashDelete":405,"./_hashGet":406,"./_hashHas":407,"./_hashSet":408,"dup":137}],350:[function(require,module,exports){
arguments[4][138][0].apply(exports,arguments)
},{"./_listCacheClear":420,"./_listCacheDelete":421,"./_listCacheGet":422,"./_listCacheHas":423,"./_listCacheSet":424,"dup":138}],351:[function(require,module,exports){
arguments[4][139][0].apply(exports,arguments)
},{"./_getNative":399,"./_root":433,"dup":139}],352:[function(require,module,exports){
arguments[4][140][0].apply(exports,arguments)
},{"./_mapCacheClear":425,"./_mapCacheDelete":426,"./_mapCacheGet":427,"./_mapCacheHas":428,"./_mapCacheSet":429,"dup":140}],353:[function(require,module,exports){
arguments[4][141][0].apply(exports,arguments)
},{"./_getNative":399,"./_root":433,"dup":141}],354:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"./_root":433,"dup":142}],355:[function(require,module,exports){
arguments[4][143][0].apply(exports,arguments)
},{"./_getNative":399,"./_root":433,"dup":143}],356:[function(require,module,exports){
arguments[4][145][0].apply(exports,arguments)
},{"./_ListCache":350,"./_stackClear":435,"./_stackDelete":436,"./_stackGet":437,"./_stackHas":438,"./_stackSet":439,"dup":145}],357:[function(require,module,exports){
arguments[4][146][0].apply(exports,arguments)
},{"./_root":433,"dup":146}],358:[function(require,module,exports){
arguments[4][147][0].apply(exports,arguments)
},{"./_root":433,"dup":147}],359:[function(require,module,exports){
arguments[4][148][0].apply(exports,arguments)
},{"./_getNative":399,"./_root":433,"dup":148}],360:[function(require,module,exports){
arguments[4][149][0].apply(exports,arguments)
},{"dup":149}],361:[function(require,module,exports){
arguments[4][150][0].apply(exports,arguments)
},{"dup":150}],362:[function(require,module,exports){
arguments[4][151][0].apply(exports,arguments)
},{"dup":151}],363:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],364:[function(require,module,exports){
arguments[4][158][0].apply(exports,arguments)
},{"dup":158}],365:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],366:[function(require,module,exports){
arguments[4][161][0].apply(exports,arguments)
},{"./eq":448,"dup":161}],367:[function(require,module,exports){
arguments[4][162][0].apply(exports,arguments)
},{"./eq":448,"dup":162}],368:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"./eq":448,"dup":163}],369:[function(require,module,exports){
arguments[4][164][0].apply(exports,arguments)
},{"./eq":448,"dup":164}],370:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"./_copyObject":393,"./keys":465,"dup":166}],371:[function(require,module,exports){
arguments[4][167][0].apply(exports,arguments)
},{"./_Stack":356,"./_arrayEach":363,"./_assignValue":368,"./_baseAssign":370,"./_cloneBuffer":385,"./_copyArray":392,"./_copySymbols":394,"./_getAllKeys":396,"./_getTag":402,"./_initCloneArray":410,"./_initCloneByTag":411,"./_initCloneObject":412,"./_isHostObject":413,"./isArray":451,"./isBuffer":454,"./isObject":458,"./keys":465,"dup":167}],372:[function(require,module,exports){
arguments[4][168][0].apply(exports,arguments)
},{"./isObject":458,"dup":168}],373:[function(require,module,exports){
arguments[4][177][0].apply(exports,arguments)
},{"./_arrayPush":364,"./isArray":451,"dup":177}],374:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return hasOwnProperty.call(object, key) ||
    (typeof object == 'object' && key in object && getPrototype(object) === null);
}

module.exports = baseHas;

},{"./_getPrototype":400}],375:[function(require,module,exports){
arguments[4][187][0].apply(exports,arguments)
},{"dup":187}],376:[function(require,module,exports){
arguments[4][188][0].apply(exports,arguments)
},{"./_Reflect":354,"./_iteratorToArray":419,"dup":188}],377:[function(require,module,exports){
arguments[4][192][0].apply(exports,arguments)
},{"./_Stack":356,"./_arrayEach":363,"./_assignMergeValue":367,"./_baseMergeDeep":378,"./isArray":451,"./isObject":458,"./isTypedArray":463,"./keysIn":466,"dup":192}],378:[function(require,module,exports){
arguments[4][193][0].apply(exports,arguments)
},{"./_assignMergeValue":367,"./_baseClone":371,"./_copyArray":392,"./isArguments":450,"./isArray":451,"./isArrayLikeObject":453,"./isFunction":455,"./isObject":458,"./isPlainObject":460,"./isTypedArray":463,"./toPlainObject":474,"dup":193}],379:[function(require,module,exports){
arguments[4][195][0].apply(exports,arguments)
},{"dup":195}],380:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"dup":200}],381:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"./_Symbol":357,"./isSymbol":462,"dup":201}],382:[function(require,module,exports){
arguments[4][205][0].apply(exports,arguments)
},{"./_stringToPath":440,"./isArray":451,"dup":205}],383:[function(require,module,exports){
arguments[4][206][0].apply(exports,arguments)
},{"dup":206}],384:[function(require,module,exports){
arguments[4][207][0].apply(exports,arguments)
},{"./_Uint8Array":358,"dup":207}],385:[function(require,module,exports){
arguments[4][208][0].apply(exports,arguments)
},{"dup":208}],386:[function(require,module,exports){
arguments[4][209][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":384,"dup":209}],387:[function(require,module,exports){
arguments[4][210][0].apply(exports,arguments)
},{"./_addMapEntry":360,"./_arrayReduce":365,"./_mapToArray":430,"dup":210}],388:[function(require,module,exports){
arguments[4][211][0].apply(exports,arguments)
},{"dup":211}],389:[function(require,module,exports){
arguments[4][212][0].apply(exports,arguments)
},{"./_addSetEntry":361,"./_arrayReduce":365,"./_setToArray":434,"dup":212}],390:[function(require,module,exports){
arguments[4][213][0].apply(exports,arguments)
},{"./_Symbol":357,"dup":213}],391:[function(require,module,exports){
arguments[4][214][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":384,"dup":214}],392:[function(require,module,exports){
arguments[4][217][0].apply(exports,arguments)
},{"dup":217}],393:[function(require,module,exports){
arguments[4][218][0].apply(exports,arguments)
},{"./_assignValue":368,"dup":218}],394:[function(require,module,exports){
arguments[4][219][0].apply(exports,arguments)
},{"./_copyObject":393,"./_getSymbols":401,"dup":219}],395:[function(require,module,exports){
arguments[4][222][0].apply(exports,arguments)
},{"./_isIterateeCall":415,"./rest":470,"dup":222}],396:[function(require,module,exports){
arguments[4][228][0].apply(exports,arguments)
},{"./_baseGetAllKeys":373,"./_getSymbols":401,"./keys":465,"dup":228}],397:[function(require,module,exports){
arguments[4][229][0].apply(exports,arguments)
},{"./_baseProperty":379,"dup":229}],398:[function(require,module,exports){
arguments[4][230][0].apply(exports,arguments)
},{"./_isKeyable":417,"dup":230}],399:[function(require,module,exports){
var isNative = require('./isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./isNative":457}],400:[function(require,module,exports){
arguments[4][233][0].apply(exports,arguments)
},{"dup":233}],401:[function(require,module,exports){
/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  // Coerce `object` to an object to avoid non-object errors in V8.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
  return getOwnPropertySymbols(Object(object));
}

// Fallback for IE < 11.
if (!getOwnPropertySymbols) {
  getSymbols = function() {
    return [];
  };
}

module.exports = getSymbols;

},{}],402:[function(require,module,exports){
arguments[4][235][0].apply(exports,arguments)
},{"./_DataView":348,"./_Map":351,"./_Promise":353,"./_Set":355,"./_WeakMap":359,"./_toSource":442,"dup":235}],403:[function(require,module,exports){
arguments[4][237][0].apply(exports,arguments)
},{"./_castPath":382,"./_isIndex":414,"./_isKey":416,"./_toKey":441,"./isArguments":450,"./isArray":451,"./isLength":456,"./isString":461,"dup":237}],404:[function(require,module,exports){
arguments[4][238][0].apply(exports,arguments)
},{"./_nativeCreate":432,"dup":238}],405:[function(require,module,exports){
arguments[4][239][0].apply(exports,arguments)
},{"dup":239}],406:[function(require,module,exports){
arguments[4][240][0].apply(exports,arguments)
},{"./_nativeCreate":432,"dup":240}],407:[function(require,module,exports){
arguments[4][241][0].apply(exports,arguments)
},{"./_nativeCreate":432,"dup":241}],408:[function(require,module,exports){
arguments[4][242][0].apply(exports,arguments)
},{"./_nativeCreate":432,"dup":242}],409:[function(require,module,exports){
arguments[4][243][0].apply(exports,arguments)
},{"./_baseTimes":380,"./isArguments":450,"./isArray":451,"./isLength":456,"./isString":461,"dup":243}],410:[function(require,module,exports){
arguments[4][245][0].apply(exports,arguments)
},{"dup":245}],411:[function(require,module,exports){
arguments[4][246][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":384,"./_cloneDataView":386,"./_cloneMap":387,"./_cloneRegExp":388,"./_cloneSet":389,"./_cloneSymbol":390,"./_cloneTypedArray":391,"dup":246}],412:[function(require,module,exports){
arguments[4][247][0].apply(exports,arguments)
},{"./_baseCreate":372,"./_getPrototype":400,"./_isPrototype":418,"dup":247}],413:[function(require,module,exports){
arguments[4][250][0].apply(exports,arguments)
},{"dup":250}],414:[function(require,module,exports){
arguments[4][251][0].apply(exports,arguments)
},{"dup":251}],415:[function(require,module,exports){
arguments[4][252][0].apply(exports,arguments)
},{"./_isIndex":414,"./eq":448,"./isArrayLike":452,"./isObject":458,"dup":252}],416:[function(require,module,exports){
arguments[4][253][0].apply(exports,arguments)
},{"./isArray":451,"./isSymbol":462,"dup":253}],417:[function(require,module,exports){
arguments[4][254][0].apply(exports,arguments)
},{"dup":254}],418:[function(require,module,exports){
arguments[4][256][0].apply(exports,arguments)
},{"dup":256}],419:[function(require,module,exports){
arguments[4][258][0].apply(exports,arguments)
},{"dup":258}],420:[function(require,module,exports){
arguments[4][259][0].apply(exports,arguments)
},{"dup":259}],421:[function(require,module,exports){
arguments[4][260][0].apply(exports,arguments)
},{"./_assocIndexOf":369,"dup":260}],422:[function(require,module,exports){
arguments[4][261][0].apply(exports,arguments)
},{"./_assocIndexOf":369,"dup":261}],423:[function(require,module,exports){
arguments[4][262][0].apply(exports,arguments)
},{"./_assocIndexOf":369,"dup":262}],424:[function(require,module,exports){
arguments[4][263][0].apply(exports,arguments)
},{"./_assocIndexOf":369,"dup":263}],425:[function(require,module,exports){
arguments[4][264][0].apply(exports,arguments)
},{"./_Hash":349,"./_ListCache":350,"./_Map":351,"dup":264}],426:[function(require,module,exports){
arguments[4][265][0].apply(exports,arguments)
},{"./_getMapData":398,"dup":265}],427:[function(require,module,exports){
arguments[4][266][0].apply(exports,arguments)
},{"./_getMapData":398,"dup":266}],428:[function(require,module,exports){
arguments[4][267][0].apply(exports,arguments)
},{"./_getMapData":398,"dup":267}],429:[function(require,module,exports){
arguments[4][268][0].apply(exports,arguments)
},{"./_getMapData":398,"dup":268}],430:[function(require,module,exports){
arguments[4][269][0].apply(exports,arguments)
},{"dup":269}],431:[function(require,module,exports){
arguments[4][271][0].apply(exports,arguments)
},{"./_baseMerge":377,"./isObject":458,"dup":271}],432:[function(require,module,exports){
arguments[4][272][0].apply(exports,arguments)
},{"./_getNative":399,"dup":272}],433:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":383}],434:[function(require,module,exports){
arguments[4][276][0].apply(exports,arguments)
},{"dup":276}],435:[function(require,module,exports){
arguments[4][277][0].apply(exports,arguments)
},{"./_ListCache":350,"dup":277}],436:[function(require,module,exports){
arguments[4][278][0].apply(exports,arguments)
},{"dup":278}],437:[function(require,module,exports){
arguments[4][279][0].apply(exports,arguments)
},{"dup":279}],438:[function(require,module,exports){
arguments[4][280][0].apply(exports,arguments)
},{"dup":280}],439:[function(require,module,exports){
arguments[4][281][0].apply(exports,arguments)
},{"./_ListCache":350,"./_MapCache":352,"dup":281}],440:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":467,"./toString":475}],441:[function(require,module,exports){
arguments[4][283][0].apply(exports,arguments)
},{"./isSymbol":462,"dup":283}],442:[function(require,module,exports){
arguments[4][284][0].apply(exports,arguments)
},{"dup":284}],443:[function(require,module,exports){
arguments[4][285][0].apply(exports,arguments)
},{"./_copyObject":393,"./_createAssigner":395,"./keysIn":466,"dup":285}],444:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],445:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide an options object to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime = 0,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (!lastCallTime || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    clearTimeout(timerId);
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastCallTime = lastInvokeTime = 0;
    lastArgs = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":458,"./now":469,"./toNumber":473}],446:[function(require,module,exports){
arguments[4][288][0].apply(exports,arguments)
},{"./_apply":362,"./_assignInDefaults":366,"./assignInWith":443,"./rest":470,"dup":288}],447:[function(require,module,exports){
arguments[4][289][0].apply(exports,arguments)
},{"./_apply":362,"./_mergeDefaults":431,"./mergeWith":468,"./rest":470,"dup":289}],448:[function(require,module,exports){
arguments[4][291][0].apply(exports,arguments)
},{"dup":291}],449:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":374,"./_hasPath":403}],450:[function(require,module,exports){
arguments[4][300][0].apply(exports,arguments)
},{"./isArrayLikeObject":453,"dup":300}],451:[function(require,module,exports){
arguments[4][301][0].apply(exports,arguments)
},{"dup":301}],452:[function(require,module,exports){
arguments[4][302][0].apply(exports,arguments)
},{"./_getLength":397,"./isFunction":455,"./isLength":456,"dup":302}],453:[function(require,module,exports){
arguments[4][303][0].apply(exports,arguments)
},{"./isArrayLike":452,"./isObjectLike":459,"dup":303}],454:[function(require,module,exports){
var constant = require('./constant'),
    root = require('./_root');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
  ? freeExports
  : undefined;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? constant(false) : function(value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;

},{"./_root":433,"./constant":444}],455:[function(require,module,exports){
arguments[4][307][0].apply(exports,arguments)
},{"./isObject":458,"dup":307}],456:[function(require,module,exports){
arguments[4][308][0].apply(exports,arguments)
},{"dup":308}],457:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (!isObject(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = isNative;

},{"./_isHostObject":413,"./_toSource":442,"./isFunction":455,"./isObject":458}],458:[function(require,module,exports){
arguments[4][311][0].apply(exports,arguments)
},{"dup":311}],459:[function(require,module,exports){
arguments[4][312][0].apply(exports,arguments)
},{"dup":312}],460:[function(require,module,exports){
arguments[4][313][0].apply(exports,arguments)
},{"./_getPrototype":400,"./_isHostObject":413,"./isObjectLike":459,"dup":313}],461:[function(require,module,exports){
arguments[4][314][0].apply(exports,arguments)
},{"./isArray":451,"./isObjectLike":459,"dup":314}],462:[function(require,module,exports){
arguments[4][315][0].apply(exports,arguments)
},{"./isObjectLike":459,"dup":315}],463:[function(require,module,exports){
arguments[4][316][0].apply(exports,arguments)
},{"./isLength":456,"./isObjectLike":459,"dup":316}],464:[function(require,module,exports){
arguments[4][317][0].apply(exports,arguments)
},{"dup":317}],465:[function(require,module,exports){
arguments[4][318][0].apply(exports,arguments)
},{"./_baseHas":374,"./_baseKeys":375,"./_indexKeys":409,"./_isIndex":414,"./_isPrototype":418,"./isArrayLike":452,"dup":318}],466:[function(require,module,exports){
arguments[4][319][0].apply(exports,arguments)
},{"./_baseKeysIn":376,"./_indexKeys":409,"./_isIndex":414,"./_isPrototype":418,"dup":319}],467:[function(require,module,exports){
arguments[4][321][0].apply(exports,arguments)
},{"./_MapCache":352,"dup":321}],468:[function(require,module,exports){
arguments[4][323][0].apply(exports,arguments)
},{"./_baseMerge":377,"./_createAssigner":395,"dup":323}],469:[function(require,module,exports){
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @type {Function}
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred function to be invoked.
 */
var now = Date.now;

module.exports = now;

},{}],470:[function(require,module,exports){
arguments[4][328][0].apply(exports,arguments)
},{"./_apply":362,"./toInteger":472,"dup":328}],471:[function(require,module,exports){
arguments[4][333][0].apply(exports,arguments)
},{"./toNumber":473,"dup":333}],472:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":471}],473:[function(require,module,exports){
arguments[4][335][0].apply(exports,arguments)
},{"./isFunction":455,"./isObject":458,"./isSymbol":462,"dup":335}],474:[function(require,module,exports){
arguments[4][336][0].apply(exports,arguments)
},{"./_copyObject":393,"./keysIn":466,"dup":336}],475:[function(require,module,exports){
arguments[4][337][0].apply(exports,arguments)
},{"./_baseToString":381,"dup":337}],476:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],477:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],478:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":477,"_process":476,"inherits":347}]},{},[346]);
