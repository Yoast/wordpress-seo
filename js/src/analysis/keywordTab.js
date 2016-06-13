/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaults = require( 'lodash/defaults' );

var $ = jQuery;

var defaultArguments = {
	keyword: '',
	prefix: '',
	onActivate: function ( ) { },
	afterActivate: function ( ) { },
	active: false,

	scoreClass: 'na',
	scoreText: '',
	fallback: '',

	showKeyword: true,
	isKeywordTab: true
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaults( args, defaultArguments );

		this.keyword = args.keyword;
		this.prefix  = args.prefix;
		this.onActivate = args.onActivate;
		this.afterActivate = args.afterActivate;
		this.active = args.active;
		this.scoreClass = args.scoreClass;
		this.scoreText = args.scoreText;

		this.showKeyword = args.showKeyword;
		this.isKeywordTab = args.isKeywordTab;
		this.fallback = args.fallback;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 * @param {string} position Either prepend or append for the position in the parent.
	 */
	KeywordTab.prototype.init = function( parent, position ) {
		this.setElement( this.render() );
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
		var newElem = this.render();

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {Object} jQuery HTML object.
	 */
	KeywordTab.prototype.render = function() {
		var placeholder = this.keyword.length > 0 ? this.keyword : '...';
		var prefix = this.prefix;

		if ( ! this.showKeyword ) {
			placeholder = '';
		}

		if ( '' === this.keyword && '' !== this.fallback ) {
			placeholder = this.fallback;
			prefix = '';
		} else {
			prefix += ' ';
		}

		var html = wp.template( 'keyword_tab' )({
			keyword: this.keyword,
			placeholder: placeholder,
			score: this.scoreClass,
			hideRemove: true,
			prefix: prefix,
			active: this.active,
			scoreText: this.scoreText,
			isKeywordTab: this.isKeywordTab
		});

		return jQuery( html );
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
	 * Activates the tab
	 */
	KeywordTab.prototype.activate = function() {
		this.onActivate();

		$( '.wpseo_keyword_tab, .wpseo_content_tab' ).removeClass( 'active' );
		this.active = true;
		this.refresh();

		this.afterActivate();
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	KeywordTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.activate();
	};

	/**
	 * Returns the keyword for this keyword tab
	 */
	KeywordTab.prototype.getKeyword = function() {
		return this.element.find( '.wpseo_tablink' ).data( 'keyword' );
	};

	return KeywordTab;
})();
