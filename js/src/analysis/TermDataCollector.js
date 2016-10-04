/* global jQuery, wpseoTermScraperL10n */

import getIndicatorForScore from "../analysis/getIndicatorForScore";
import tmceHelper from "../wp-seo-tinymce";
import { update as updateTrafficLight } from "../ui/trafficLight";
import { update as updateAdminBar } from "../ui/adminBar";
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import { termsTmceId as tmceId } from "../wp-seo-tinymce";

let $ = jQuery;

/**
 * Show warning in console when the unsupported CkEditor is used.
 *
 * @param {Object} args The arguments for the post scraper.
 * @param {TabManager} args.tabManager The tab manager for this post.
 *
 * @constructor
 */
var TermDataCollector = function( args ) {
	if ( typeof CKEDITOR === "object" ) {
		console.warn( "YoastSEO currently doesn't support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE." );
	}

	this._tabManager = args.tabManager;
};

/**
 * Returns data fetched from input fields.
 *
 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
 */
TermDataCollector.prototype.getData = function() {
	return {
		title: this.getTitle(),
		keyword: isKeywordAnalysisActive() ? this.getKeyword() : "",
		text: this.getText(),
		meta: this.getMeta(),
		url: this.getUrl(),
		permalink: this.getPermalink(),
		snippetCite: this.getSnippetCite(),
		snippetTitle: this.getSnippetTitle(),
		snippetMeta: this.getSnippetMeta(),
		name: this.getName(),
		baseUrl: this.getBaseUrl(),
		pageTitle: this.getPageTitle(),
	};
};

/**
 * Returns the title from the DOM.
 *
 * @returns {string} The title.
 */
TermDataCollector.prototype.getTitle = function() {
	return document.getElementById( "hidden_wpseo_title" ).value;
};

/**
 * Returns the keyword from the DOM.
 *
 * @returns {string} The keyword.
 */
TermDataCollector.prototype.getKeyword = function() {
	var elem, val;

	elem = document.getElementById( "wpseo_focuskw" );
	val = elem.value;
	if ( val === "" ) {
		val = document.getElementById( "name" ).value;
		elem.placeholder = val;
	}

	return val;
};

/**
 * Returns the text from the DOM.
 *
 * @returns {string} The text.
 */
TermDataCollector.prototype.getText = function() {
	return tmceHelper.getContentTinyMce( tmceId );
};

/**
 * Returns the meta description from the DOM.
 *
 * @returns {string} The meta.
 */
TermDataCollector.prototype.getMeta = function() {
	var  val = "";

	var elem = document.getElementById( "hidden_wpseo_desc" );
	if ( elem !== null ) {
		val = elem.value;
	}

	return val;
};

/**
 * Returns the url from the DOM.
 *
 * @returns {string} The url.
 */
TermDataCollector.prototype.getUrl = function() {
	return document.getElementById( "slug" ).value;
};

/**
 * Returns the permalink from the DOM.
 *
 * @returns {string} The permalink.
 */
TermDataCollector.prototype.getPermalink = function() {
	var url = this.getUrl();

	return this.getBaseUrl() + url + "/";
};

/**
 * Returns the snippet cite from the DOM.
 *
 * @returns {string} The snippet cite.
 */
TermDataCollector.prototype.getSnippetCite = function() {
	return this.getUrl();
};

/**
 * Returns the snippet title from the DOM.
 *
 * @returns {string} The snippet title.
 */
TermDataCollector.prototype.getSnippetTitle = function() {
	return document.getElementById( "hidden_wpseo_title" ).value;
};

/**
 * Returns the snippet meta from the DOM.
 *
 * @returns {string} The snippet meta.
 */
TermDataCollector.prototype.getSnippetMeta = function() {
	var val = "";

	var elem = document.getElementById( "hidden_wpseo_desc" );
	if ( elem !== null ) {
		val = elem.value;
	}

	return val;
};

/**
 * Returns the name from the DOM.
 *
 * @returns {string} The name.
 */
TermDataCollector.prototype.getName = function() {
	return document.getElementById( "name" ).value;
};

/**
 * Returns the base url from the DOM.
 *
 * @returns {string} The base url.
 */
TermDataCollector.prototype.getBaseUrl = function() {
	return wpseoTermScraperL10n.base_url;
};

/**
 * Returns the page title from the DOM.
 *
 * @returns {string} The page title.
 */
TermDataCollector.prototype.getPageTitle = function() {
	return document.getElementById( "hidden_wpseo_title" ).value;
};

/**
 * When the snippet is updated, update the (hidden) fields on the page.
 *
 * @param {Object} value Value for the data to set.
 * @param {String} type The field(type) that the data is set for.
 *
 * @returns {void}
 */
TermDataCollector.prototype.setDataFromSnippet = function( value, type ) {
	switch ( type ) {
		case "snippet_meta":
			document.getElementById( "hidden_wpseo_desc" ).value = value;
			break;
		case "snippet_cite":
			document.getElementById( "slug" ).value = value;
			break;
		case "snippet_title":
			document.getElementById( "hidden_wpseo_title" ).value = value;
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
 *
 * @returns {void}
 */
TermDataCollector.prototype.saveSnippetData = function( data ) {
	this.setDataFromSnippet( data.title, "snippet_title" );
	this.setDataFromSnippet( data.urlPath, "snippet_cite" );
	this.setDataFromSnippet( data.metaDesc, "snippet_meta" );
};

/**
 * Binds TermDataCollector events to elements.
 *
 * @returns {void}
 */
TermDataCollector.prototype.bindElementEvents = function( app ) {
	this.inputElementEventBinder( app );
};

/**
 * Binds the renewData function on the change of inputelements.
 *
 * @returns {void}
 */
TermDataCollector.prototype.inputElementEventBinder = function( app ) {
	var elems = [ "name", tmceId, "slug", "wpseo_focuskw" ];
	for ( var i = 0; i < elems.length; i++ ) {
		var elem = document.getElementById( elems[ i ] );
		if ( elem !== null ) {
			document.getElementById( elems[ i ] ).addEventListener( "input", app.refresh.bind( app ) );
		}
	}
	tmceHelper.tinyMceEventBinder( app, tmceId );
};

/**
 * Creates SVG for the overall score.
 *
 * @param {number} score Score to save.
 *
 * @returns {void}
 */
TermDataCollector.prototype.saveScores = function( score ) {
	var indicator = getIndicatorForScore( score );
	var keyword = this.getKeyword();

	document.getElementById( "hidden_wpseo_linkdex" ).value = score;
	jQuery( window ).trigger( "YoastSEO:numericScore", score );

	this._tabManager.updateKeywordTab( score, keyword );

	updateTrafficLight( indicator );
	updateAdminBar( indicator );
};

/**
 * Saves the content score to a hidden field.
 *
 * @param {number} score The score calculated by the content assessor.
 *
 * @returns {void}
 */
TermDataCollector.prototype.saveContentScore = function( score ) {
	var indicator = getIndicatorForScore( score );

	this._tabManager.updateContentTab( score );

	if ( ! isKeywordAnalysisActive() ) {
		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	$( "#hidden_wpseo_content_score" ).val( score );
};

/**
 * Initializes keyword tab with the correct template.
 *
 * @returns {void}
 */
TermDataCollector.prototype.initKeywordTabTemplate = function() {
	// Remove default functionality to prevent scrolling to top.
	$( ".wpseo-metabox-tabs" ).on( "click", ".wpseo_tablink", function( ev ) {
		ev.preventDefault();
	} );
};

export default TermDataCollector;
