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
};

/**
 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippetpreview
 * @returns {{keyword: *, meta: *, text: *, title: *, baseUrl: *, url: *, pageTitle: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
 */
YoastSEO.ExampleScraper.prototype.getData = function() {
	return {
		keyword: this.getDataFromInput("keyword"),
		meta: this.getDataFromInput("meta"),
		text: this.getDataFromInput("text"),
		title: this.getDataFromInput("title"),
		baseUrl: this.getDataFromInput("baseUrl"),
		url: this.getDataFromInput("url"),
		pageTitle: this.getDataFromInput("title"),
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
				if (val === YoastSEO.app.config.sampleText.snippetCite){
					val = "";
				}
			}
			break;
		case "baseUrl":
			break;
		case "meta":
			elem = document.getElementById( "snippet_meta" );
			if (elem !== null) {
				val = elem.textContent;
				if (val === YoastSEO.app.config.sampleText.meta){
					val = "";
				}
			}
			break;
		case "keyword":
			val = document.getElementById( "focusKeyword" ).value;
			break;
		case "title":
			elem = document.getElementById( "snippet_title" );
			if (elem !== null) {
				val = elem.textContent;
				if (val === YoastSEO.app.config.sampleText.title){
					val = "";
				}
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
	var elems = [ "snippet_cite", "snippet_meta", "snippet_title" ];

	for ( var i = 0; i < elems.length; i++ ) {
		this.bindSnippetEvents( document.getElementById( elems [ i ] ), app.snippetPreview );
		document.getElementById( elems[ i ] ).addEventListener(
			"blur",
			app.refresh.bind( app )
		);
	}
};

/**
 * binds the snippetEvents to a snippet element.
 * @param { HTMLElement } elem snippet_meta, snippet_title, snippet_cite
 * @param { YoastSEO.SnippetPreview } snippetPreview
 */
YoastSEO.ExampleScraper.prototype.bindSnippetEvents = function( elem, snippetPreview ) {
	elem.addEventListener( 'keydown', snippetPreview.disableEnter.bind( snippetPreview ) );
	elem.addEventListener( 'blur', snippetPreview.checkTextLength.bind( snippetPreview ) );
	//textFeedback is given on input (when user types or pastests), but also on focus. If a string that is too long is being recalled
	//from the saved values, it gets the correct classname right away.
	elem.addEventListener( 'input', snippetPreview.textFeedback.bind( snippetPreview ) );
	elem.addEventListener( 'focus', snippetPreview.textFeedback.bind( snippetPreview ) );
	//shows edit icon by hovering over element
	elem.addEventListener( 'mouseover', snippetPreview.showEditIcon.bind( snippetPreview ) );
	//hides the edit icon onmouseout, on focus and on keyup. If user clicks or types AND moves his mouse, the edit icon could return while editting
	//by binding to these 3 events
	elem.addEventListener( 'mouseout', snippetPreview.hideEditIcon.bind( snippetPreview ) );
	elem.addEventListener( 'focus', snippetPreview.hideEditIcon.bind( snippetPreview ) );
	elem.addEventListener( 'keyup', snippetPreview.hideEditIcon.bind( snippetPreview ) );

	elem.addEventListener( 'focus', snippetPreview.getUnformattedText.bind( snippetPreview ) );
	elem.addEventListener( 'keyup', snippetPreview.setUnformattedText.bind( snippetPreview ) );
	elem.addEventListener( 'click', snippetPreview.setFocus.bind( snippetPreview ) );

	//adds the showIcon class to show the editIcon;
	elem.className = elem.className + ' showIcon' ;
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO.ExampleScraper.prototype.inputElementEventBinder = function( app ) {
	var elems = [ "content", "focusKeyword", "snippet_cite", "snippet_meta", "snippet_title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( "input", app.analyzeTimer.bind( app ) );
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

/**
 * refreshes the app when snippet is updated.
 */
YoastSEO.ExampleScraper.prototype.updateSnippetValues = function () {
	YoastSEO.app.refresh();
};