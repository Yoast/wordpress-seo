/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * ExampleScraper generates a form for use as input.
 * @param args
 * @constructor
 */
YoastSEO.ExampleScraper = function( args ) {
	this.config = args;
	this.analyzerData = {};
	this.formattedData = {};
};

YoastSEO.ExampleScraper.prototype.getData = function() {
	return {
		keyword: this.getDataFromInput("keyword"),
		meta: this.getDataFromInput("meta"),
		text: this.getDataFromInput("text"),
		title: this.getDataFromInput("title"),
		url: this.getDataFromInput("url"),
		pageTitle: this.getDataFromInput("title"),
		snippetTitle: this.getDataFromInput("title"),
		snippetMeta: this.getDataFromInput("meta"),
		snippetCite: this.getDataFromInput("url")
	};
};

/**
 * initializes the snippetPreview if it isn't there.
 * If it is already initialized, it get's new values from the inputs and rerenders snippet.
 */
YoastSEO.ExampleScraper.prototype.getAnalyzerInput = function() {
	if ( typeof this.refObj.snippetPreview === "undefined" ) {
		this.refObj.init();
	} else {
		this.rawData.text = this.getDataFromInput( "text" );
		this.rawData.keyword = this.getDataFromInput( "keyword" );
		this.rawData.pageTitle = this.getDataFromInput( "title" );
		this.rawData.snippetMeta = this.getDataFromInput( "meta" );
		this.rawData.snippetCite = this.getDataFromInput( "url" );
		this.refObj.rawData = this.formattedData;
		this.refObj.reloadSnippetText();
	}
	this.refObj.runAnalyzerCallback();
};

/**
 * get values from generated inputfields.
 * @param inputType
 * @returns {*}
 */
YoastSEO.ExampleScraper.prototype.getDataFromInput = function( inputType ) {
	var val = '';
	var elem;
	switch ( inputType ) {
		case "text":
			val = document.getElementById( "content" ).value;
			break;
		case "url":
			elem = document.getElementById( "snippet_cite" );
			if (elem !== null) {
				val = elem.textContent;
			}
			break;
		case "meta":
			elem = document.getElementById( "snippet_meta" );
			if (elem !== null) {
				val = elem.textContent;
			}
			break;
		case "keyword":
			val = document.getElementById( "focusKeyword" ).value;
			break;
		case "title":
			elem = document.getElementById( "snippet_title" );
			if (elem !== null) {
				val = elem.textContent;
			}
			break;
		default:
			break;
	}
	return val;
};

/**
 * calls the eventbinders.
 */
YoastSEO.ExampleScraper.prototype.bindElementEvents = function() {
	this.inputElementEventBinder();
	this.snippetPreviewEventBinder();
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 */
YoastSEO.ExampleScraper.prototype.snippetPreviewEventBinder = function() {
	var elems = [ "cite", "meta", "title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( "snippet_" + elems[ i ] ).addEventListener(
			"blur",
			this.snippetCallback
		);
	}
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO.ExampleScraper.prototype.inputElementEventBinder = function() {
	var elems = [ "textInput", "keywordInput", "snippet_cite", "snippet_meta", "snippet_title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).__refObj = this;
		document.getElementById( elems[ i ] ).addEventListener( "change", this.renewData );
	}
};

/**
 * calls getAnalyzerinput function on change event from element
 * @param event
 */
YoastSEO.ExampleScraper.prototype.renewData = function( ev ) {
	ev.currentTarget.__refObj.getAnalyzerInput();
};

/**
 * calls getAnalyzerinput function on focus of the snippet elements;
 * @param event
 */
YoastSEO.ExampleScraper.prototype.snippetCallback = function( ev ) {
	ev.currentTarget.__refObj.getAnalyzerInput();
};

/**
 * Called by the app to save scores. Currently only returns score since
 * there is no further score implementation
 * @param score
 */
YoastSEO.ExampleScraper.prototype.saveScores = function( score ) {
	return score;
};


YoastSEO.ExampleScraper.prototype.updateSnippetValues = function () {

};