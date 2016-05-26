/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaults = require( 'lodash/defaults' );

var $ = jQuery;

var defaultArguments = {
	keyword: '',
	prefix: '',
	basedOn: '',
	onActivate: function ( ) { },
	afterActivate: function ( ) { },
	active: false,

	scoreClass: 'na',
	scoreText: '',

	showKeyword: true
};

module.exports = (function() {
	'use strict';

	/**
	 * Renders a keyword tab as a jQuery HTML object.
	 *
	 * @param {string} scoreClass
	 * @param {string} keyword
	 * @param {string} prefix
	 *
	 * @returns {HTMLElement}
	 */
	function renderKeywordTab( scoreClass, scoreText, keyword, prefix, basedOn, active, showKeyword ) {
		var placeholder = keyword.length > 0 ? keyword : '...';

		if ( ! showKeyword ) {
			placeholder = '';
		}

		var html = wp.template( 'keyword_tab' )({
			keyword: keyword,
			placeholder: placeholder,
			score: scoreClass,
			hideRemove: true,
			prefix: prefix + ' ',
			active: active,
			basedOn: basedOn,
			scoreText: scoreText
		});

		return jQuery( html );
	}

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaults( args, defaultArguments );

		this.keyword = args.keyword;
		this.prefix  = args.prefix;
		this.basedOn = args.basedOn;
		this.onActivate = args.onActivate;
		this.afterActivate = args.afterActivate;
		this.active = args.active;
		this.scoreClass = args.scoreClass;
		this.scoreText = args.scoreText;

		this.showKeyword = args.showKeyword;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 * @param {string} position Either prepend or append for the position in the parent.
	 */
	KeywordTab.prototype.init = function( parent, position ) {
		this.setElement( renderKeywordTab( this.scoreClass, this.scoreText, this.keyword, this.prefix, this.basedOn, this.active, this.showKeyword ) );
		var $parent = $( parent );

		if ( 'prepend' === position ) {
			$parent.prepend( this.element );
		} else {
			$parent.append( this.element );
		}
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 * @param {string=""} keyword
	 */
	KeywordTab.prototype.update = function( scoreClass, scoreText, keyword ) {
		if ( ! isUndefined( keyword ) ) {
			this.keyword = keyword;
		}
		this.setScoreClass( scoreClass );
		this.setScoreText( scoreText );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = renderKeywordTab( this.scoreClass, this.scoreText, this.keyword, this.prefix, this.basedOn, this.active, this.showKeyword );

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

		this.addEventHandler();
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {string} scoreClass
	 */
	KeywordTab.prototype.setScoreClass = function( scoreClass ) {
		this.scoreClass = scoreClass;
	};

	/**
	 * Formats the given score text and store it in the attribute.
	 *
	 * @param {string} scoreText
	 */
	KeywordTab.prototype.setScoreText = function( scoreText ) {
		this.scoreText = scoreText;
	};

	/**
	 * Adds event handler to tab
	 */
	KeywordTab.prototype.addEventHandler = function() {
		$( this.element ).on( 'click', this.onClick.bind( this ) );
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	KeywordTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.onActivate();

		$( '.wpseo_keyword_tab' ).removeClass( 'active' );
		this.active = true;
		this.refresh();

		this.afterActivate();
	};

	/**
	 * Returns the keyword for this keyword tab
	 */
	KeywordTab.prototype.getKeyword = function() {
		return this.element.find( '.wpseo_tablink' ).data( 'keyword' );
	};

	return KeywordTab;
})();
