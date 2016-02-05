/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

var defaultsDeep = require( "lodash/object/defaultsDeep" );
var isObject = require( "lodash/lang/isObject" );
var isString = require( "lodash/lang/isString" );
var MissingArgument = require( "./errors/missingArgument" );

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

var isUndefined = require( "lodash/lang/isUndefined" );

var SnippetPreview = require( "./snippetPreview.js" );

/**
 * Creates a default snippet preview, this can be used if no snippet preview has been passed.
 *
 * @private
 * @this App
 *
 * @returns {SnippetPreview}
 */
function createDefaultSnippetPreview() {
	var targetElement = document.getElementById( this.config.targets.snippet ),
		SnippetPreview = require( "../js/snippetPreview.js" );

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
 * @param {*} snippetPreview
 * @returns {boolean}
 */
function isValidSnippetPreview( snippetPreview ) {
	return !isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object} args The arguments object passed to the App.
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
 * @param {Object} args
 * @param {Object} args.translations Jed compatible translations.
 * @param {Object} args.targets Targets to retrieve or set on.
 * @param {String} args.targets.snippet ID for the snippet preview element.
 * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
 * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the
 *        analyzer output.
 * @param {boolean} args.dynamicDelay Whether to enable dynamic delay, will ignore type delay if the
 *        analyzer takes a long time. Applicable on slow devices.
 * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
 * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when
 *        dynamic delay is enabled.
 * @param {Object} args.callbacks The callbacks that the app requires.
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input
 *        for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to
 *        the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the
 *        snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been
 *        determined by the analyzer.
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 *
 * @param {SnippetPreview} args.snippetPreview
 *
 * @constructor
 */
YoastSEO.App = function( args ) {
	if ( !isObject( args ) ) {
		args = {};
	}
	defaultsDeep( args, defaults );

	verifyArguments( args );

	this.config = args;

	this.callbacks = this.config.callbacks;

	this.i18n = this.constructI18n( this.config.translations );
	this.stringHelper = new YoastSEO.StringHelper();
	this.pluggable = new YoastSEO.Pluggable( this );

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
 * @param {Object} args
 * @returns {Object} args
 */
YoastSEO.App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.queue = args.queue || YoastSEO.analyzerConfig.queue;
	args.locale = args.locale || "en_US";

	return args;
};

/**
 * Extend sample text config with defaults.
 *
 * @param {Object} sampleText
 * @returns {Object} sampleText
 */
YoastSEO.App.prototype.extendSampleText = function( sampleText ) {
	var defaultSampleText = YoastSEO.App.defaultConfig.sampleText;

	if ( sampleText === undefined ) {
		sampleText = defaultSampleText;
	} else {
		for ( var key in sampleText ) {
			if ( sampleText[ key ] === undefined ) {
				sampleText[ key ] = defaultSampleText[ key ];
			}
		}
	}

	return sampleText;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations
 */
YoastSEO.App.prototype.constructI18n = function( translations ) {
	var Jed = require( "jed" );

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
 */
YoastSEO.App.prototype.getData = function() {
	var isUndefined = require( "lodash/lang/isUndefined" );

	this.rawData = this.callbacks.getData();

	if ( !isUndefined( this.snippetPreview ) ) {
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
 */
YoastSEO.App.prototype.refresh = function() {
	this.getData();
	this.runAnalyzer();
};

/**
 * creates the elements for the snippetPreview
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 */
YoastSEO.App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Initializes the snippet preview for this App.
 */
YoastSEO.App.prototype.initSnippetPreview = function() {
	this.snippetPreview.renderTemplate();
	this.snippetPreview.callRegisteredEventBinder();
	this.snippetPreview.bindEvents();
	this.snippetPreview.init();
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO.App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.analyzeTimer.bind( this ) );
	}
};

/**
 * runs the rerender function of the snippetPreview if that object is defined.
 */
YoastSEO.App.prototype.reloadSnippetText = function() {
	if ( typeof this.snippetPreview !== "undefined" ) {
		this.snippetPreview.reRender();
	}
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 */
YoastSEO.App.prototype.analyzeTimer = function() {
	clearTimeout( window.timer );
	window.timer = setTimeout( this.refresh.bind( this ), this.config.typeDelay );
};

/**
 * sets the startTime timestamp
 */
YoastSEO.App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
YoastSEO.App.prototype.endTime = function() {
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
 */
YoastSEO.App.prototype.runAnalyzer = function() {

	if ( this.pluggable.loaded === false ) {
		return;
	}

	if ( this.config.dynamicDelay ) {
		this.startTime();
	}

	this.analyzerData = this.modifyData( this.rawData );
	this.analyzerData.i18n = this.i18n;

	var keyword = this.stringHelper.sanitizeKeyword( this.rawData.keyword );
	if ( keyword === "" ) {
		this.analyzerData.queue = [ "keyphraseSizeCheck", "wordCount", "fleschReading", "pageTitleLength", "urlStopwords", "metaDescriptionLength" ];
	}

	this.analyzerData.keyword = keyword;

	if ( typeof this.pageAnalyzer === "undefined" ) {
		this.pageAnalyzer = new YoastSEO.Analyzer( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	} else {
		this.pageAnalyzer.init( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	}

	this.pageAnalyzer.runQueue();
	this.scoreFormatter = new YoastSEO.ScoreFormatter( {
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
 * @param data
 * @returns {*}
 */
YoastSEO.App.prototype.modifyData = function( data ) {

	// Copy rawdata to lose object reference.
	data = JSON.parse( JSON.stringify( data ) );

	data.text = this.pluggable._applyModifications( "content", data.text );
	data.title = this.pluggable._applyModifications( "title", data.title );

	return data;
};

/**
 * Function to fire the analyzer when all plugins are loaded, removes the loading dialog.
 */
YoastSEO.App.prototype.pluginsLoaded = function() {
	this.getData();
	this.removeLoadingDialog();
	this.runAnalyzer();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 */
YoastSEO.App.prototype.showLoadingDialog = function() {
	var dialogDiv = document.createElement( "div" );
	dialogDiv.className = "YoastSEO_msg";
	dialogDiv.id = "YoastSEO-plugin-loading";
	document.getElementById( this.config.targets.output ).appendChild( dialogDiv );
};

/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading
 * @param plugins
 */
YoastSEO.App.prototype.updateLoadingDialog = function( plugins ) {
	var dialog = document.getElementById( "YoastSEO-plugin-loading" );
	dialog.textContent = "";
	for ( var plugin in this.pluggable.plugins ) {
		dialog.innerHTML += "<span class=left>" + plugin + "</span><span class=right " +
							plugins[ plugin ].status + ">" + plugins[ plugin ].status + "</span><br />";
	}
	dialog.innerHTML += "<span class=bufferbar></span>";
};

/**
 * removes the pluging load dialog.
 */
YoastSEO.App.prototype.removeLoadingDialog = function() {
	document.getElementById( this.config.targets.output ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
};
