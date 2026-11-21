/* global wpseoScriptData */

/* External dependencies */
import { get } from "lodash";

/* Internal dependencies */
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "../analysis/isContentAnalysisActive";
import * as tmceHelper from "../lib/tinymce";
import { termsTmceId as tmceId } from "../lib/tinymce";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import { update as updateTrafficLight } from "../ui/trafficLight";
import { update as updateAdminBar } from "../ui/adminBar";
import measureTextWidth from "../helpers/measureTextWidth";

const $ = jQuery;

/**
 * Shows warning in console when the unsupported CkEditor is used.
 *
 * @param {Object} args The arguments for the Term Data Collector.
 *
 * @constructor
 */
const TermDataCollector = function( args ) {
	if ( typeof CKEDITOR === "object" ) {
		console.warn( "YoastSEO currently doesn't support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE." );
	}

	this._store = args.store;
};

/**
 * Returns data fetched from input fields.
 *
 * @returns {Object} The object with data.
 */
TermDataCollector.prototype.getData = function() {
	const otherData = {
		title: this.getSnippetTitle(),
		keyword: isKeywordAnalysisActive() ? this.getKeyword() : "",
		text: this.getText(),
		permalink: this.getPermalink(),
		snippetCite: this.getSnippetCite(),
		snippetTitle: this.getSnippetTitle(),
		snippetMeta: this.getSnippetMeta(),
		name: this.getName(),
		baseUrl: this.getBaseUrl(),
		pageTitle: this.getSnippetTitle(),
		titleWidth: measureTextWidth( this.getSnippetTitle() ),
	};

	const state = this._store.getState();
	const snippetData = {
		metaTitle: get( state, [ "analysisData", "snippet", "title" ], this.getSnippetTitle() ),
		url: get( state, [ "snippetEditor", "data", "slug" ], this.getSlug() ),
		meta: get( state, [ "analysisData", "snippet", "description" ], this.getSnippetMeta() ),
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
TermDataCollector.prototype.getKeyword = function() {
	const elem = document.getElementById( "hidden_wpseo_focuskw" );

	return elem.value;
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
 * Returns the slug from the DOM.
 *
 * @returns {string} The slug.
 */
TermDataCollector.prototype.getSlug = function() {
	return document.getElementById( "slug" ).value;
};

/**
 * Returns the permalink from the DOM.
 * The permalink is the base URL plus the slug.
 *
 * @returns {string} The permalink.
 */
TermDataCollector.prototype.getPermalink = function() {
	const slug = this.getSlug();

	return this.getBaseUrl() + slug + "/";
};

/**
 * Returns the snippet cite from the DOM.
 * The snippet cite is the slug retrieved from the DOM to be used in the snippet editor.
 *
 * @returns {string} The snippet cite.
 */
TermDataCollector.prototype.getSnippetCite = function() {
	return this.getSlug();
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
 * Returns the snippet meta description from the DOM.
 *
 * @returns {string} The snippet meta description.
 */
TermDataCollector.prototype.getSnippetMeta = function() {
	const element = document.getElementById( "hidden_wpseo_desc" );
	return element ? element.value : "";
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
	return wpseoScriptData.metabox.base_url;
};

/**
 * Updates the (hidden) fields on the page when the snippet is updated.
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
 * Saves the data passed from the snippet editor.
 *
 * @param {Object} data          Object with data value.
 * @param {string} data.title    The title.
 * @param {string} data.urlPath  The url.
 * @param {string} data.metaDesc The meta description.
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
 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
 *
 * @returns {void}
 */
TermDataCollector.prototype.bindElementEvents = function( refreshAnalysis ) {
	this.inputElementEventBinder( refreshAnalysis );
};

/**
 * Binds the renewData function on the change of input elements.
 *
 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
 *
 * @returns {void}
 */
TermDataCollector.prototype.inputElementEventBinder = function( refreshAnalysis ) {
	const elements = [ "name", tmceId, "slug", "wpseo_focuskw" ];
	for ( let i = 0; i < elements.length; i++ ) {
		const element = document.getElementById( elements[ i ] );
		if ( element !== null ) {
			document.getElementById( elements[ i ] ).addEventListener( "input", refreshAnalysis );
		}
	}
	tmceHelper.tinyMceEventBinder( refreshAnalysis, tmceId );
};

/**
 * Creates SVG for the overall score.
 *
 * @param {number} score Score to save.
 *
 * @returns {void}
 */
TermDataCollector.prototype.saveScores = function( score ) {
	const indicator = getIndicatorForScore( score );

	document.getElementById( "hidden_wpseo_linkdex" ).value = score;
	jQuery( window ).trigger( "YoastSEO:numericScore", score );

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
	const indicator = getIndicatorForScore( score );

	if ( ! isKeywordAnalysisActive() ) {
		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	$( "#hidden_wpseo_content_score" ).val( score );
};

/**
 * Saves the inclusive language score to a hidden field.
 *
 * @param {number} score The score calculated by the inclusive language assessor.
 *
 * @returns {void}
 */
TermDataCollector.prototype.saveInclusiveLanguageScore = function( score ) {
	const indicator = getIndicatorForScore( score );

	if ( ! isKeywordAnalysisActive() && ! isContentAnalysisActive() ) {
		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	$( "#hidden_wpseo_inclusive_language_score" ).val( score );
};

export default TermDataCollector;
