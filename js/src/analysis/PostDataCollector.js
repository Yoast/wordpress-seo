/* global jQuery, wpseoPostScraperL10n */

/* External dependencies */
import get from "lodash/get";
import analysis from "yoastseo";
const { measureTextWidth } = analysis.helpers;
const { removeMarks } = analysis.markers;

/* Internal dependencies */
import isKeywordAnalysisActive from "./isKeywordAnalysisActive";
import tmceHelper from "../wp-seo-tinymce";
import { tmceId } from "../wp-seo-tinymce";
import getIndicatorForScore from "./getIndicatorForScore";
import { update as updateTrafficLight } from "../ui/trafficLight";
import { update as updateAdminBar } from "../ui/adminBar";
import publishBox from "../ui/publishBox";

const $ = jQuery;

/**
 * Show warning in console when the unsupported CkEditor is used
 *
 * @param {Object} args The arguments for the post scraper.
 * @param {Object} args.data The data.
 *
 * @constructor
 */
const PostDataCollector = function( args ) {
	if ( typeof CKEDITOR === "object" ) {
		console.warn( "YoastSEO currently doesn't support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE." );
	}

	this._data = args.data;
	this._store = args.store;
};

/**
 * Get data from input fields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippet preview. If Gutenberg data is available, use it.
 *
 * @returns {Object} The data.
 */
PostDataCollector.prototype.getData = function() {
	const data = this._data.getData();
	const state = this._store.getState();

	const otherData = {
		keyword: isKeywordAnalysisActive() ? this.getKeyword() : "",
		meta: this.getMeta(),
		text: data.content,
		title: data.title,
		url: data.slug,
		excerpt: data.excerpt,
		snippetTitle: this.getSnippetTitle(),
		snippetMeta: this.getSnippetMeta(),
		snippetCite: this.getSnippetCite(),
		primaryCategory: this.getPrimaryCategory(),
		searchUrl: this.getSearchUrl(),
		postUrl: this.getPostUrl(),
		permalink: this.getPermalink(),
		titleWidth: measureTextWidth( this.getSnippetTitle() ),
	};

	const snippetData = {
		metaTitle: get( state, [ "analysisData", "snippet", "title" ], this.getSnippetTitle() ),
		url: get( state, [ "snippetEditor", "data", "slug" ], data.slug ),
		meta: this.getMetaDescForAnalysis( state ),
	};

	return {
		...otherData,
		...snippetData,
	};
};

/**
 * Returns the keyword from the DOM.
 *
 * @returns {string} The keyword.
 */
PostDataCollector.prototype.getKeyword = function() {
	var val = document.getElementById( "yoast_wpseo_focuskw" ) && document.getElementById( "yoast_wpseo_focuskw" ).value || "";

	return val;
};

/**
 * Returns the full meta description including any prefixed date.
 *
 * @param {Object} state The state containing the meta description.
 *
 * @returns {string} The full meta description.
 */
PostDataCollector.prototype.getMetaDescForAnalysis = function( state ) {
	let metaDesc = get( state, [ "analysisData", "snippet", "description" ], this.getSnippetMeta() );
	if ( wpseoPostScraperL10n.metaDescriptionDate !== "" ) {
		metaDesc = wpseoPostScraperL10n.metaDescriptionDate + " - " + metaDesc;
	}
	return metaDesc;
};

/**
 * Returns the Meta from the DOM.
 *
 * @returns {string} The meta description.
 */
PostDataCollector.prototype.getMeta = function() {
	return document.getElementById( "yoast_wpseo_metadesc" ) && document.getElementById( "yoast_wpseo_metadesc" ).value || "";
};

/**
 * Returns the Text from the DOM.
 *
 * @returns {string} The text.
 */
PostDataCollector.prototype.getText = function() {
	return removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
};

/**
 * Returns the Title from the DOM.
 *
 * @returns {string} The title.
 */
PostDataCollector.prototype.getTitle = function() {
	return document.getElementById( "title" ) && document.getElementById( "title" ).value || "";
};

/**
 * Returns the Url from the DOM.
 *
 * @returns {string} The url.
 */
PostDataCollector.prototype.getUrl = function() {
	var url = "";

	var newPostSlug = $( "#new-post-slug" );
	if ( 0 < newPostSlug.length ) {
		url = newPostSlug.val();
	} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
		url = document.getElementById( "editable-post-name-full" ).textContent;
	}

	return url;
};

/**
 * Returns the Excerpt from the DOM.
 *
 * @returns {string} The excerpt.
 */
PostDataCollector.prototype.getExcerpt = function() {
	var val = "";

	if ( document.getElementById( "excerpt" ) !== null ) {
		val = document.getElementById( "excerpt" ) && document.getElementById( "excerpt" ).value || "";
	}

	return val;
};

/**
 * Returns the SnippetTitle from the DOM.
 *
 * @returns {string} The snippet title.
 */
PostDataCollector.prototype.getSnippetTitle = function() {
	return document.getElementById( "yoast_wpseo_title" ) && document.getElementById( "yoast_wpseo_title" ).value || "";
};

/**
 * Returns the SnippetMeta from the DOM.
 *
 * @returns {string} The snippet meta.
 */
PostDataCollector.prototype.getSnippetMeta = function() {
	return document.getElementById( "yoast_wpseo_metadesc" ) && document.getElementById( "yoast_wpseo_metadesc" ).value || "";
};

/**
 * Returns the SnippetCite from the DOM.
 *
 * @returns {string} The snippet cite.
 */
PostDataCollector.prototype.getSnippetCite = function() {
	return this.getUrl();
};

/**
 * Returns the PrimaryCategory from the DOM.
 *
 * @returns {string} The primary category.
 */
PostDataCollector.prototype.getPrimaryCategory = function() {
	var val = "";
	var categoryBase = $( "#category-all" ).find( "ul.categorychecklist" );

	// If only one is visible than that item is the primary category.
	var checked = categoryBase.find( "li input:checked" );

	if ( checked.length === 1 ) {
		val = this.getCategoryName( checked.parent() );

		return val;
	}

	var primaryTerm = categoryBase.find( ".wpseo-primary-term > label" );

	if ( primaryTerm.length ) {
		val = this.getCategoryName( primaryTerm );

		return val;
	}

	return val;
};

/**
 * Returns the SearchUrl from the DOM.
 *
 * @returns {string} The search url.
 */
PostDataCollector.prototype.getSearchUrl = function() {
	return wpseoPostScraperL10n.search_url;
};

/**
 * Returns the PostUrl from the DOM.
 *
 * @returns {string} The post url.
 */
PostDataCollector.prototype.getPostUrl = function() {
	return wpseoPostScraperL10n.post_edit_url;
};

/**
 * Returns the Permalink from the DOM.
 *
 * @returns {string} The permalink.
 */
PostDataCollector.prototype.getPermalink = function() {
	var url = this.getUrl();

	return wpseoPostScraperL10n.base_url + url;
};

/**
 * Get the category name from the list item.
 *
 * @param {Object} li Item which contains the category.
 *
 * @returns {String}  Name of the category.
 */
PostDataCollector.prototype.getCategoryName = function( li ) {
	var clone = li.clone();
	clone.children().remove();
	return $.trim( clone.text() );
};

/**
 * When the snippet is updated, update the (hidden) fields on the page.
 *
 * @param {Object} value The value to set.
 * @param {String} type  The type to set the value for.
 *
 * @returns {void}
 */
PostDataCollector.prototype.setDataFromSnippet = function( value, type ) {
	switch ( type ) {
		case "snippet_meta":
			document.getElementById( "yoast_wpseo_metadesc" ).value = value;
			break;
		case "snippet_cite":

			/*
			 * WordPress leaves the post name empty to signify that it should be generated from the title once the
			 * post is saved. So when we receive an auto generated slug from WordPress we should be
			 * able to not save this to the UI. This conditional makes that possible.
			 */
			if ( this.leavePostNameUntouched ) {
				this.leavePostNameUntouched = false;
				return;
			}
			if ( document.getElementById( "post_name" ) !== null ) {
				document.getElementById( "post_name" ).value = value;
			}
			if (
				document.getElementById( "editable-post-name" ) !== null &&
				document.getElementById( "editable-post-name-full" ) !== null ) {
				document.getElementById( "editable-post-name" ).textContent = value;
				document.getElementById( "editable-post-name-full" ).textContent = value;
			}
			break;
		case "snippet_title":
			document.getElementById( "yoast_wpseo_title" ).value = value;
			break;
		default:
			break;
	}
};

/**
 * The data passed from the snippet editor.
 *
 * @param {Object} data          Object with data value.
 * @param {string} data.title    The title.
 * @param {string} data.urlPath  The url.
 * @param {string} data.metaDesc The meta description.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveSnippetData = function( data ) {
	this.setDataFromSnippet( data.title, "snippet_title" );
	this.setDataFromSnippet( data.urlPath, "snippet_cite" );
	this.setDataFromSnippet( data.metaDesc, "snippet_meta" );
};

/**
 * Calls the event binders.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.bindElementEvents = function( app ) {
	this.inputElementEventBinder( app );
	this.changeElementEventBinder( app );
};

/**
 * Binds the reanalyze timer on change of dom element.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.changeElementEventBinder = function( app ) {
	var elems = [ "#yoast-wpseo-primary-category", '.categorychecklist input[name="post_category[]"]' ];
	for ( var i = 0; i < elems.length; i++ ) {
		$( elems[ i ] ).on( "change", app.refresh.bind( app ) );
	}
};

/**
 * Binds the renewData function on the change of input elements.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.inputElementEventBinder = function( app ) {
	var elems = [ "excerpt", "content", "title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		var elem = document.getElementById( elems[ i ] );
		if ( elem !== null ) {
			document.getElementById( elems[ i ] ).addEventListener( "input", app.refresh.bind( app ) );
		}
	}

	tmceHelper.tinyMceEventBinder( app, tmceId );
};

/**
 * Saves the score to the linkdex.
 * Outputs the score in the overall target.
 *
 * @param {string} score The score to save.
 * @param {string} keyword The keyword for the score.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveScores = function( score, keyword ) {
	var indicator = getIndicatorForScore( score );

	publishBox.updateScore( "content", indicator.className );

	document.getElementById( "yoast_wpseo_linkdex" ).value = score;

	if ( "" === keyword ) {
		indicator.className = "na";
		indicator.screenReaderText = this.app.i18n.dgettext(
			"js-text-analysis",
			"Enter a focus keyphrase to calculate the SEO score"
		);
		indicator.fullText = this.app.i18n.dgettext(
			"js-text-analysis",
			"Content optimization: Enter a focus keyphrase to calculate the SEO score"
		);
	}

	updateTrafficLight( indicator );
	updateAdminBar( indicator );

	publishBox.updateScore( "keyword", indicator.className );

	jQuery( window ).trigger( "YoastSEO:numericScore", score );
};

/**
 * Saves the content score to a hidden field.
 *
 * @param {number} score The score to save.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveContentScore = function( score ) {
	var indicator = getIndicatorForScore( score );
	publishBox.updateScore( "content", indicator.className );

	if ( ! isKeywordAnalysisActive() ) {
		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	$( "#yoast_wpseo_content_score" ).val( score );
};

export default PostDataCollector;
