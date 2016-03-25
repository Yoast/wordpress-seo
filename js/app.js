/* jshint browser: true */

require( "./config/config.js" );
var sanitizeString = require( "../js/stringProcessing/sanitizeString.js" );
var SnippetPreview = require( "./snippetPreview.js" );

var defaultsDeep = require( "lodash/defaultsDeep" );
var isObject = require( "lodash/isObject" );
var isString = require( "lodash/isString" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

var Jed = require( "jed" );

var Analyzer = require( "./analyzer.js" );
var Researcher = require( "./researcher.js" );
var ScoreFormatter = require( "./scoreFormatter.js" );
var Pluggable = require( "./pluggable.js" );
var analyzerConfig = require( "./config/config.js" );
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
		saveScores: function( ) { }
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
	elementTarget: []
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
 * @returns {String} data.pageTitle The text in the HTML title tag
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
 * @param {int} overalScore The overal score as determined by the analyzer.
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
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been determined by the analyzer.
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
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
	this.pluggable = new Pluggable( this );

	this.getData();
	this.showLoadingDialog();

	if ( isValidSnippetPreview( args.snippetPreview ) ) {
		this.snippetPreview = args.snippetPreview;

		// Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		// dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		// app.
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
			this.snippetPreview.i18n = this.i18n;
		}
	} else {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}
	this.initSnippetPreview();

	this.runAnalyzer();
};

/**
 * Extend the config with defaults.
 *
 * @param   {Object}    args    The arguments to be extended.
 * @returns {Object}    args    The extended arguments.
 */
App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.queue = args.queue || analyzerConfig.queue;
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

		this.rawData.pageTitle = data.title;
		this.rawData.url = data.url;
		this.rawData.meta = data.metaDesc;
	}

	if ( this.pluggable.loaded ) {
		this.rawData.pageTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.pageTitle );
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
 * binds the analyzeTimer function to the input of the targetElement on the page.
 * @returns {void}
 */
App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.analyzeTimer.bind( this ) );
	}
};

/**
 * runs the rerender function of the snippetPreview if that object is defined.
 * @returns {void}
 */
App.prototype.reloadSnippetText = function() {
	if ( isUndefined( this.snippetPreview ) ) {
		this.snippetPreview.reRender();
	}
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 * @returns {void}
 */
App.prototype.analyzeTimer = function() {
	clearTimeout( window.timer );
	window.timer = setTimeout( this.refresh.bind( this ), this.config.typeDelay );
};

/**
 * sets the startTime timestamp
 * @returns {void}
 */
App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
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
 * inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter
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
	this.analyzerData.i18n = this.i18n;

	// Create a paper object for the Researcher
	this.paper = new Paper( this.analyzerData.text, {
		keyword:  this.analyzerData.keyword,
		description: this.analyzerData.meta,
		url: this.analyzerData.url,
		title: this.analyzerData.pageTitle
	} );

	var keyword = sanitizeString( this.rawData.keyword );

	if ( keyword === "" ) {
		this.analyzerData.queue = [ "keyphraseSizeCheck", "wordCount", "fleschReading", "pageTitleLength", "urlStopwords", "metaDescriptionLength" ];
	}

	this.analyzerData.keyword = keyword;

	// The new researcher
	if ( isUndefined( this.researcher ) ) {
		this.researcher = new Researcher( this.paper );
	} else {
		this.researcher.setPaper( this.paper );
	}

	if ( isUndefined( this.pageAnalyzer ) ) {
		this.pageAnalyzer = new Analyzer( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	} else {
		this.pageAnalyzer.init( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	}

	this.pageAnalyzer.runQueue();
	this.scoreFormatter = new ScoreFormatter( {
		scores: this.pageAnalyzer.analyzeScorer.__score,
		overallScore: this.pageAnalyzer.analyzeScorer.__totalScore,
		outputTarget: this.config.targets.output,
		overallTarget: this.config.targets.overall,
		keyword: this.rawData.keyword,
		saveScores: this.callbacks.saveScores,
		i18n: this.i18n
	} );
	this.scoreFormatter.renderScore();

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

	data.text = this.pluggable._applyModifications( "content", data.text );
	data.title = this.pluggable._applyModifications( "title", data.title );

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
	forEach ( plugins, function( plugin, pluginName ) {
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
 * @param {string}   name       Name of the test.
 * @param {function} analysis   A function that analyzes the content and determines a score for a certain trait.
 * @param {Object}   scoring    A scoring object that defines how the analysis translates to a certain SEO score.
 * @param {string}   pluginName The plugin that is registering the test.
 * @param {number}   priority   (optional) Determines when this test is run in the analyzer queue. Is currently ignored,
 *                              tests are added to the end of the queue.
 * @returns {boolean}           Whether or not the test was successfully registered.
 */
App.prototype.registerTest = function( name, analysis, scoring, pluginName, priority ) {
	return this.pluggable._registerTest( name, analysis, scoring, pluginName, priority );
};

module.exports = App;
