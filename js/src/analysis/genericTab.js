/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaultsDeep = require( 'lodash/defaultsDeep' );

var $ = jQuery;

var defaultArguments = {
	label: '',
	placeholder: '...',

	active: false,
	hideable: false,

	classes: [ 'wpseo_tab', 'wpseo_generic_tab' ],

	// Possibly remove this and use an indicator instead
	scoreClass: 'na',
	scoreText: '',

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

		console.log( args );

		this.label = args.label;
		this.placeholder = args.placeholder;
		this.active = args.active;

		this.onActivate = args.onActivate;
		this.afterActivate = args.afterActivate;

//		this.scoreClass = args.scoreClass;
//		this.scoreText = args.scoreText;
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
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 */
	GenericTab.prototype.update = function( scoreClass, scoreText ) {
		// TODO: Get an indicator here, you fool.
//		this.setScoreClass( scoreClass );
//		this.setScoreText( scoreText );
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
		var html = wp.template( 'generic_tab' )( {
			label: this.label,
			placeholder: this.placeholder,

			active: this.active,
			hideRemove: true,

			score: this.scoreClass,
			scoreText: this.scoreText,
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
})();
