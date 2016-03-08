/* global wp, jQuery, YoastSEO */
module.exports = (function() {
	'use strict';

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

		return jQuery( html );
	}

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		this.keyword = '';
		this.prefix  = args.prefix || '';

		this.setScore( 0 );
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 */
	KeywordTab.prototype.init = function( parent ) {
		this.setElement( renderKeywordTab( this.score, this.keyword, this.prefix ) );

		jQuery( parent ).append( this.element );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {integer} score
	 * @param {string}  keyword
	 */
	KeywordTab.prototype.update = function( score, keyword ) {
		this.keyword = keyword;
		this.setScore( score );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = renderKeywordTab( this.score, this.keyword, this.prefix );

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	KeywordTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {number} score
	 */
	KeywordTab.prototype.setScore = function( score ) {
		score = parseInt( score, 10 );

		if ( this.keyword === '' ) {
			score = 'na';
		}

		score = YoastSEO.ScoreFormatter.prototype.overallScoreRating( score );

		this.score = score;
	};

	return KeywordTab;
})();
