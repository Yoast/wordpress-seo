/* global wp, jQuery */
var isUndefined = require( "lodash/isUndefined" );
var defaultsDeep = require( "lodash/defaultsDeep" );

var GenericTab = require( "./genericTab" );

var defaultArguments = {
	keyword: "",
	placeholder: "",

	active: false,
	hideable: false,
	prefix: "",

	classes: [ "wpseo_tab", "wpseo_keyword_tab" ],

	onActivate: function() { },
	afterActivate: function() { },
};

module.exports = ( function() {
	/* eslint-disable no-use-before-define */
	// Extending all the things.
	KeywordTab.prototype = Object.create( GenericTab.prototype );
	/* eslint-enable no-use-before-define */

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args The arguments.
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaultsDeep( args, defaultArguments );
		this.fallback       = args.fallback;
		this.keyword        = args.keyword;
		this.placeholder    = args.placeholder;
		this.prefix         = args.prefix;

		this.classes        = args.classes;

		this.onActivate     = args.onActivate;
		this.afterActivate  = args.afterActivate;
	}

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} score   The score to set.
	 * @param {string} keyword The keyword to set the score for.
	 *
	 * @returns {void}
	 */
	KeywordTab.prototype.updateScore = function( score, keyword ) {
		if ( ! isUndefined( keyword ) ) {
			this.keyword = keyword;
		}

		if ( keyword === "" ) {
			this.score = "na";
			this.scoreText = "";
			this.refresh();

			return;
		}

		var indicator   = this.getIndicator( score );

		this.score      = indicator.className;
		this.scoreText  = indicator.screenReaderText;

		this.refresh();
	};

	KeywordTab.prototype.hasKeyword = function() {
		return this.keyword !== "";
	};

	KeywordTab.prototype.getKeyWord = function() {
		return this.keyword;
	};

	KeywordTab.prototype.hasFallback = function() {
		return this.fallback !== "";
	};

	KeywordTab.prototype.determinePrefix = function() {
		if ( ! this.hasKeyword() && this.hasFallback() ) {
			return "";
		}

		return this.prefix;
	};

	KeywordTab.prototype.determineLabel = function() {
		if ( ! this.hasKeyword() && this.hasFallback() ) {
			return this.fallback;
		}

		return this.hasKeyword() ? this.getKeyWord() : "...";
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object
	 *
	 * @returns {HTMLElement} jQuery HTML object.
	 */
	KeywordTab.prototype.render = function() {
		var html = wp.template( "keyword_tab" )( {
			label: this.determineLabel(),
			keyword: this.getKeyWord(),

			hideable: this.hideable,
			active: this.active,

			prefix: this.determinePrefix(),

			score: this.score,
			scoreText: this.scoreText,

			classes: this.addAdditionalClasses(),
		} );

		return jQuery( html );
	};

	/**
	 * Returns the keyword for this keyword tab
	 *
	 * @returns {string} The keyword
	 */
	KeywordTab.prototype.getKeywordFromElement = function() {
		return String( this.element.find( ".wpseo_tablink" ).data( "keyword" ) );
	};

	return KeywordTab;
}() );
