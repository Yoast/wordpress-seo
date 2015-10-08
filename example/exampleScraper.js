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
};

YoastSEO.ExampleScraper.prototype.getData = function() {
	return {
		keyword: this.getDataFromInput("keyword"),
		meta: this.getDataFromInput("meta"),
		text: this.getDataFromInput("text"),
		title: this.getDataFromInput("title"),
		baseUrl: this.getDataFromInput("baseUrl"),
		url: this.getDataFromInput("url"),
		pageTitle: this.getDataFromInput("title"),
		snippetTitle: this.getDataFromInput("title"),
		snippetMeta: this.getDataFromInput("meta"),
		snippetCite: this.getDataFromInput("url")
	};
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
		case "baseUrl":
			val = "";
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
YoastSEO.ExampleScraper.prototype.bindElementEvents = function( app ) {
	this.inputElementEventBinder( app );
	this.snippetPreviewEventBinder( app );
	document.getElementById( "focusKeyword").addEventListener( 'keydown', app.snippetPreview.disableEnter );
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 */
YoastSEO.ExampleScraper.prototype.snippetPreviewEventBinder = function( app ) {
	var elems = [ "cite", "meta", "title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( "snippet_" + elems[ i ] ).addEventListener(
			"blur",
			app.refresh.bind( app )
		);
	}
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO.ExampleScraper.prototype.inputElementEventBinder = function( app ) {
	var elems = [ "content", "focusKeyword", "snippet_cite", "snippet_meta", "snippet_title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( "change", app.refresh.bind( app ) );
	}
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