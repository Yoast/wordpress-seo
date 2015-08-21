/* jshint browser: true */
/* global YoastSEO: true */
/* global Jed */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

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
 *
 *
 * @constructor
 */
YoastSEO.App = function( args ) {
	window.YoastSEO.app = this;
	this.config = args;
	this.inputs = {};
	this.analyzerData = args.callbacks.getData();
	this.constructI18n( args.translations );
	this.loadQueue();
	this.stringHelper = new YoastSEO.StringHelper();
	this.plugins = new YoastSEO.Plugins();
	this.checkInputs();
	this.callbacks = this.config.callbacks;

	if ( !this.config.ajax ) {
		this.defineElements();
	}
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations
 */
YoastSEO.App.prototype.constructI18n = function( translations ) {

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

	this.i18n = new Jed( translations );
};

/**
 * inits YoastSEO, calls element definer and snippet preview creater
 */
YoastSEO.App.prototype.init = function() {
	this.defineElements();
	this.createSnippetPreview();
};

/**
 * Refreshes the analyzer and output of the analyzer
 */
YoastSEO.App.prototype.refresh = function() {
	this.analyzerData = this.callbacks.getData();
	this.inputs = this.callbacks.getAnalyzerInput();
};

/**
 * loads the queue from the analyzer if no queue is defined.
 */
YoastSEO.App.prototype.loadQueue = function() {
	if ( typeof this.queue === "undefined" ) {
		this.queue = YoastSEO.analyzerConfig.queue;
	}
};

/**
 * Adds function to the analyzer queue. Function must be in the Analyzer prototype to be added.
 *
 * @param {String} func Name of the function to add to the queue.
 */
YoastSEO.App.prototype.addToQueue = function( func ) {
	if ( typeof YoastSEO.Analyzer.prototype[ func ] === "function" ) {
		this.queue.push( func );
	}
};

/**
 * Removes function from queue if it is currently in the queue.
 *
 * @param {String} func Name of the function to remove from the queue.
 */
YoastSEO.App.prototype.removeFromQueue = function( func ) {
	var funcIndex = this.queue.indexOf( func );
	if ( funcIndex > -1 ) {
		this.queue.splice( funcIndex, 1 );
	}
};

/**
 * creates the elements for the snippetPreview
 */
YoastSEO.App.prototype.createSnippetPreview = function() {
	var targetElement = document.getElementById( this.config.targets.snippet );
	var div = document.createElement( "div" );
	div.id = "snippet_preview";
	targetElement.appendChild( div );
	this.createSnippetPreviewTitle( div );
	this.createSnippetPreviewUrl( div );
	this.createSnippetPreviewMeta( div );
	this.snippetPreview = new YoastSEO.SnippetPreview( this );
	this.bindEvent();
	this.bindSnippetEvents();
};

/**
 * creates the title elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewTitle = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "title_container";
	elem.__refObj = this;
	target.appendChild( elem );
	var title;
	title = document.createElement( "span" );
	title.contentEditable = true;
	title.textContent = this.config.sampleText.title;
	title.className = "title";
	title.id = "snippet_title";
	elem.appendChild( title );
};

/**
 * creates the URL elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewUrl = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "url_container";
	elem.__refObj = this;
	target.appendChild( elem );
	var baseUrl = document.createElement( "cite" );
	baseUrl.className = "url urlBase";
	baseUrl.id = "snippet_citeBase";
	elem.appendChild( baseUrl );
	var cite = document.createElement( "cite" );
	cite.className = "url";
	cite.id = "snippet_cite";
	cite.textContent = this.config.sampleText.url;
	cite.contentEditable = true;
	elem.appendChild( cite );
};

/**
 * creates the meta description elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewMeta = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "meta_container";
	elem.__refObj = this;
	target.appendChild( elem );
	var meta = document.createElement( "span" );
	meta.className = "desc";
	meta.id = "snippet_meta";
	meta.contentEditable = true;
	meta.textContent = this.config.sampleText.meta;
	elem.appendChild( meta );
};

/**
 * defines the target element to be used for the output on the page
 */
YoastSEO.App.prototype.defineElements = function() {
	this.target = document.getElementById( this.config.targets.output );
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		if ( elem !== null ) {
			elem.__refObj = this;
		}

	}
};

/**
 * Creates an edit icon in a element with a certain ID
 *
 * @param {HTMLElement} elem The element to append the edit icon to.
 * @param {String} id The ID to give this edit icon.
 */
YoastSEO.App.prototype.createEditIcon = function( elem, id ) {
	var div = document.createElement( "div" );
	div.className = "editIcon";
	div.id = "editIcon_" + id;
	elem.appendChild( div );

};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the
 * analyzer.
 */
YoastSEO.App.prototype.getAnalyzerInput = function() {
	this.inputs = this.callbacks.getAnalyzerInput();
};

/**
 * binds the events to the generated inputs. Binds events on the snippetinputs if editable
 */
YoastSEO.App.prototype.bindEvent = function() {
	this.callbacks.bindElementEvents();
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO.App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.analyzeTimer );
	}
};

/**
 * binds the reloadSnippetText function to the blur of the snippet inputs.
 */
YoastSEO.App.prototype.bindSnippetEvents = function() {
	var snippetElem = document.getElementById( this.config.targets.snippet );
	snippetElem.refObj = this;
	var elems = [ "meta", "cite", "title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		var targetElement = document.getElementById( "snippet_" + elems[ i ] );
		targetElement.refObj = this;
		targetElement.addEventListener( "blur", this.callbacks.updateSnippetValues );

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
	var refObj = this.__refObj;

	//if __refObj is not found (used on elements), use refObj
	if ( typeof refObj === "undefined" ) {
		refObj = this.refObj;
	}

	//if refObj is not found (used on objects), use this
	if ( typeof refObj === "undefined" ) {
		refObj = this;
	}
	clearTimeout( window.timer );
	window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retrieve values from inputs. If the keyword is empty calls
 * message, if keyword is filled, runs the analyzer
 */
YoastSEO.App.prototype.checkInputs = function() {
	var refObj = window.YoastSEO.app;
	refObj.getAnalyzerInput();
};

YoastSEO.App.prototype.runAnalyzerCallback = function() {
	var refObj = window.YoastSEO.app;
	if ( refObj.formattedData.keyword === "" ) {
		refObj.showMessage();
	} else {
		refObj.runAnalyzer();
	}
};

/**
 * used when no keyword is filled in, it will display a message in the target element
 */
YoastSEO.App.prototype.showMessage = function() {
	this.target.innerHTML = "";
	var messageDiv = document.createElement( "div" );
	messageDiv.className = "wpseo_msg";
	messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set" +
		" a focus keyword, no score can be calculated.</strong></p>";
	this.target.appendChild( messageDiv );
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
	if ( this.config.dynamicDelay ) {
		this.startTime();
	}
	if ( typeof this.pageAnalyzer === "undefined" ) {
		var args = this.formattedData;
		args.queue = this.queue;
		args.i18n = this.i18n;
		this.pageAnalyzer = new YoastSEO.Analyzer( args );
	} else {
		this.pageAnalyzer.init();
	}
	this.pageAnalyzer.runQueue();
	this.scoreFormatter = new YoastSEO.ScoreFormatter( this );
	if ( this.config.dynamicDelay ) {
		this.endTime();
	}
};

/**
 * run at pageload to init the App for pageAnalysis.
 */
YoastSEO.initialize = function() {
	if ( document.readyState === "complete" ) {
		YoastSEO.app = new YoastSEO.App( YoastSEO.analyzerArgs );
	} else {
		setTimeout( YoastSEO.initialize, 50 );
	}
};
