/* global wp, jQuery */

var defaultsDeep = require( "lodash/defaultsDeep" );
var getIndicatorForScore = require( "./getIndicatorForScore" );

var $ = jQuery;

var defaultArguments = {
	label: "",
	active: false,
	hideable: false,

	classes: [ "wpseo_tab", "wpseo_generic_tab" ],

	onActivate: function() { },
	afterActivate: function() { },
};

module.exports = ( function() {
	/**
	 * Constructor for a generic tab object
	 * @param {Object} args The arguments for the tab.
	 * @constructor
	 */
	function GenericTab( args ) {
		defaultsDeep( args, defaultArguments );

		this.label          = args.label;
		this.active         = args.active;
		this.hideable       = args.hideable;
		this.classes        = args.classes;

		this.onActivate     = args.onActivate;
		this.afterActivate  = args.afterActivate;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {string|Object} container The container element to add the tab to. jQuery object or selector.
	 * @param {string}        position  Either prepend or append for the position in the container.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.init = function( container, position ) {
		position = position || "prepend";

		this.setElement( this.render() );
		this.addToContainer( container, position );
	};

	/**
	 * Adds the current tab to the container element.
	 *
	 * @param {string|Object} container The container element to add the tab to. jQuery object or selector.
	 * @param {string}        position  Either prepend or append for the position in the container.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.addToContainer = function( container, position ) {
		var $container = $( container );

		if ( "prepend" === position ) {
			$container.prepend( this.element );
			return;
		}

		$container.append( this.element );
	};

	/**
	 * Gets the indicator object based on the passed score.
	 *
	 * @param {int} score The score to be used to determine the indicator.
	 * @returns {Object} The indicator.
	 */
	GenericTab.prototype.getIndicator = function( score ) {
		return getIndicatorForScore( score );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {int} score The score for the indicator.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.updateScore = function( score ) {
		var indicator = this.getIndicator( score );

		this.score = indicator.className;
		this.scoreText = indicator.screenReaderReadabilityText;

		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.refresh = function() {
		var replacement = this.render();

		this.element.replaceWith( replacement );
		this.setElement( replacement );
	};

	/**
	 * Adds additional CSS classes based on the classes field.
	 *
	 * @returns {string} The classes to add.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.addAdditionalClasses = function() {
		return this.classes.join( " " );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {HTMLElement} jQuery HTML object.
	 */
	GenericTab.prototype.render = function() {
		var html = wp.template( "generic_tab" )( {
			label: this.label,

			active: this.active,
			hideable: this.hideable,

			score: this.score,
			scoreText: this.scoreText,

			classes: this.addAdditionalClasses(),
		} );

		return jQuery( html );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element The element to set.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );

		this.addEventHandler();
	};

	/**
	 * Adds event handler to tab
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.addEventHandler = function() {
		$( this.element ).on( "click", this.onClick.bind( this ) );
	};

	/**
	 * Activates the tab
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.activate = function() {
		this.onActivate();

		this.deactivate();

		this.active = true;

		this.refresh();

		this.afterActivate();
	};

	/**
	 * Removes active state class from all tabs.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.deactivate = function() {
		this.active = false;
		$( ".wpseo_tab" ).removeClass( "active" );
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 *
	 * @returns {void}
	 */
	GenericTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.activate();
	};

	return GenericTab;
}() );
