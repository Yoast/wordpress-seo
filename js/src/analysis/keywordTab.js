'use strict';

var $ = jQuery;

/**
 * Renders a keyword tab as a jQuery HTML object.
 *
 * @param {int}    score
 * @param {string} keyword
 * @param {string} prefix
 *
 * @returns {HTMLElement}
 */
function renderKeywordTab( score, keyword, prefix ) {
	var placeholder = keyword.length > 0 ? keyword : '...';
	var html = wp.template( 'keyword_tab' )({
		keyword: keyword,
		placeholder: placeholder,
		score: score,
		hideRemove: true,
		prefix: prefix + ' ',
		active: true
	});

	return $( html );
}

/**
 * Constructor for a keyword tab object
 * @param {Object} args
 * @constructor
 */
function KeywordTab( args ) {
	this.setScore(0);
	this.keyword = "";
	this.prefix = args.prefix || '';
}

/**
 * Initialize a keyword tab.
 *
 * @param {HTMLElement} parent
 */
KeywordTab.prototype.init = function( parent ) {
	this.setElem( renderKeywordTab( this.score, this.keyword, this.prefix ) );

	$( parent ).append( elem );
};

/**
 * Updates the keyword tabs with new values.
 *
 * @param {integer} score
 * @param {string}  keyword
 */
KeywordTab.prototype.update = function( score, keyword ) {
	this.setScore( score );
	this.keyword = keyword;

	this.refresh();
};

/**
 * Renders a new keyword tab with the current values and replaces the old tab with this one.
 */
KeywordTab.prototype.refresh = function() {
	var newElem = renderKeywordTab( this.score, this.keyword, this.prefix );

	this.elem.replaceWith( newElem );
	this.setElem( newElem );
};

/**
 * Sets the current element
 *
 * @param {HTMLElement} elem
 */
KeywordTab.prototype.setElem = function( elem ) {
	this.elem = $( elem );
};

/**
 * Formats the given score and store it in the attribute.
 *
 * @param {integer} score
 */
KeywordTab.prototype.setScore = function( score ) {
	score = parseInt( score, 10 );

	if ( this.keyword === '' ) {
		score = 'na';
	}

	score = YoastSEO.ScoreFormatter.prototype.overallScoreRating( score );

	this.score = score;
};

module.exports = KeywordTab;
