/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaultsDeep = require( 'lodash/defaultsDeep' );
var getIndicatorForScore = require( './getIndicatorForScore' );

var $ = jQuery;

var defaultArguments = {
	label: '',
	active: false,
	hideable: true,

	classes: [ 'wpseo_tab', 'wpseo_generic_tab' ],

	onActivate: function ( ) { },
	afterActivate: function ( ) { },
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a generic tab object
	 * @param {Object} args
	 * @constructor
	 */
	function GenericTab( args ) {
		defaultsDeep( args, defaultArguments );

		this.label          = args.label;
		this.active         = args.active;
		this.hideable       = args.hideable;

		this.onActivate     = args.onActivate;
		this.afterActivate  = args.afterActivate;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} container The container element to add the tab to.
	 * @param {string} [position] Either prepend or append for the position in the container.
	 */
	GenericTab.prototype.init = function( container, position ) {
		position = position || 'prepend';

		this.setElement( this.render() );
		this.addToContainer( container, position );
	};

	/**
	 * Adds the current tab to the container element.
	 *
	 * @param {HTMLElement} container The container element to add the tab to.
	 * @param {string} [position] Either prepend or append for the position in the container.
	 */
	GenericTab.prototype.addToContainer = function ( container, position ) {
		var $container = $( container );

		if ( 'prepend' === position ) {
			$container.prepend( this.element );
			return;
		}

		$container.append( this.element );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {int} indicator
	 */
	GenericTab.prototype.updateScore = function( score ) {
		var indicator = getIndicatorForScore( score );

		this.score = indicator.className;
		this.scoreText = indicator.screenReaderText;

		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	GenericTab.prototype.refresh = function() {
		var replacement = this.render();

		this.element.replaceWith( replacement );
		this.setElement( replacement );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {Object} jQuery HTML object.
	 */
	GenericTab.prototype.render = function() {
		console.log( this.hideable );

		var html = wp.template( 'generic_tab' )( {
			label: this.label,

			active: this.active,
			hideable: this.hideable,

			score: this.score,
			scoreText: this.scoreText
		} );

		return jQuery( html );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	GenericTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );

		this.addEventHandler();
	};

	/**
	 * Adds event handler to tab
	 */
	GenericTab.prototype.addEventHandler = function() {
		$( this.element ).on( 'click', this.onClick.bind( this ) );
	};

	/**
	 * Activates the tab
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
	 */
	GenericTab.prototype.deactivate = function() {
		$( '.wpseo_tab' ).removeClass( 'active' );
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	GenericTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.activate();
	};

	return GenericTab;
} )();
