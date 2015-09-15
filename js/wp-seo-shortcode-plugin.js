/* global console */
/* global tinyMCE */
/* global wpseoShortcodePluginL10n */
/* global ajaxurl */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
'use strict';

/**
 * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for shortcodes which it will preload using AJAX.
 *
 * @constructor
 * @property {RegExp} keywordRegex Used to match a given string for valid shortcode keywords.
 * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.
 * @property {RegExp} nonCaptureRegex Used to match a given string for non capturing shortcodes.
 * @property {Array} parsedShortcodes Used to store parsed shortcodes.
 */
var YoastShortcodePlugin = function() {
	this.register( 0, this.bindElementEvents.bind( this ) );

	var keywordRegexString = '(' + wpseoShortcodePluginL10n.wpseo_shortcode_tags.join('|') + ')';

	// The regex for matching shortcodes based on the available shortcode keywords.
	this.keywordRegex = new RegExp( keywordRegexString, 'g');
	this.closingTagRegex = new RegExp( '\\[\\/' + keywordRegexString + '\\]', 'g' );
	this.nonCaptureRegex = new RegExp('\\[' + keywordRegexString + '[^\\]]*?\\]', 'g');

	this.unparsedShortcodes = [];
	this.parsedShortcodes = [];

	this.loadShortcodes();
};

/* YOAST SEO CLIENT */

/**
 * Register the plugin with YoastSEO, retry for one second.
 *
 * @param {function} callback (optional) function to call when the plugin has been registered. This is useful for event bindings which rely on YoastSEO to be there.
 */
YoastShortcodePlugin.prototype.register = function( callback ) {
	if ( typeof YoastSEO !== 'undefined' && typeof YoastSEO.app !== 'undefined' && typeof YoastSEO.app.plugins !== 'undefined' ) {
		YoastSEO.app.plugins.register( 'YoastShortcodePlugin', { status: 'loading' } );
		if ( typeof callback === 'function' ) {
			callback();
		}
	}
	else if ( this.registerTime < 1001 ) {
		this.registerTime += 100;
		setTimeout( this.register.bind( this, callback ), 100 );
	}
	else {
		console.error('Failed to register shortcode plugin with YoastSEO. YoastSEO is not available.');
	}
};

/**
 * Declares ready with YoastSEO.
 */
YoastShortcodePlugin.prototype.declareReady = function() {
	YoastSEO.app.plugins.ready( 'YoastShortcodePlugin' );
	this.registerModifications();
};

/**
 * Declares reloaded with YoastSEO.
 */
YoastShortcodePlugin.prototype.declareReloaded = function() {
	YoastSEO.app.plugins.reloaded( 'YoastShortcodePlugin' );
};

/**
 * Registers the modifications for the content in which we want to replace shortcodes.
 */
YoastShortcodePlugin.prototype.registerModifications = function() {
	YoastSEO.app.plugins.registerModification( 'content', this.replaceShortcodes.bind( this ), 'YoastShortcodePlugin' );
};

/**
 * The callback used to replace the shortcodes.
 *
 * @param {string} data
 * @returns {string}
 */
YoastShortcodePlugin.prototype.replaceShortcodes = function( data ) {
	var parsedShortcodes = this.parsedShortcodes;

	if ( typeof data === 'string' && parsedShortcodes.length > 0 ) {
		for ( var i in parsedShortcodes ) {
			data = data.replace( parsedShortcodes[ i ].shortcode, parsedShortcodes[ i ].output );
		}
	}
	return data;
};

/* DATA SOURCING */

/**
 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippetpreview
 */
YoastShortcodePlugin.prototype.loadShortcodes = function() {
	this.checkShortcodes( this.getContentTinyMCE() );
	this.parseShortcodes( this.declareReady );
};

/**
 * Bind elements to be able to reload the dataset if shortcodes get added.
 */
YoastShortcodePlugin.prototype.bindElementEvents = function() {
	document.getElementById( 'content' ).addEventListener( 'keydown', this.inputEventCallback.bind( this ) );
	document.getElementById( 'content' ).addEventListener( 'input', this.inputEventCallback.bind( this ) );
};

/**
 * Callback function for events on input elements. Beware! This function is always called within the scope of the element!
 *
 * @param {object} ev The event object
 */
YoastShortcodePlugin.prototype.inputEventCallback = function() {
	this.checkShortcodes( this.getContentTinyMCE() );
	this.parseShortcodes( this.declareReloaded.bind( this ) );
};

/**
 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
 * @returns {String}
 */
YoastShortcodePlugin.prototype.getContentTinyMCE = function() {
	var val = document.getElementById( 'content' ).value;
	if ( tinyMCE.editors.length !== 0 ) {
		val = tinyMCE.get( 'content' ).getContent();
	}

	return val;
};

/* SHORTCODE PARSING */

/**
 * Add a shortcode to the unparsed shortcodes unless was already parsed.
 *
 * @param {string} shortcode
 */
YoastShortcodePlugin.prototype.checkShortcode = function( shortcode ) {
	var already_exists = false;

	for ( var i in this.parsedShortcodes ) {
		if (this.parsedShortcodes[ i ].shortcode === shortcode) {
			already_exists = true;
		}
	}

	if ( already_exists === false ) {
		this.unparsedShortcodes.push( shortcode );
	}
};

/**
 * Checks a piece of text for shortcodes and adds them to the unparsed shortcodes if they haven't been parsed yet.
 *
 * @param {string} text
 * @returns {boolean}
 */
YoastShortcodePlugin.prototype.checkShortcodes = function( text ) {
	if ( typeof text !== 'string') {
		console.error( 'Failed to get unparsed shortcodes. Expected parameter to be a string, instead received' + typeof text );
		return false;
	}

	var shortcodes = this.matchShortcodes( text );

	for ( var i in shortcodes ) {
		var shortcode = shortcodes[ i ];
		if ( this.unparsedShortcodes.indexOf( shortcode ) === -1 ) {
			this.checkShortcode( shortcode );
		}
	}

	return true;
};

/**
 * Matches a text for shortcodes.
 *
 * @param {string} text
 * @returns {array} The matched shortcodes
 */
YoastShortcodePlugin.prototype.matchShortcodes = function( text ) {
	var captures = this.getCapturesFromText( text );
	for ( var i in captures ) {
		text = text.replace(captures[ i ], '');
	}
	// Fetch the non capturing shortcodes from the text.
	var nonCaptures = text.match( this.nonCaptureRegex ) || [];

	return captures.concat( nonCaptures );
};

/**
 * Matches the capturing shortcodes from a given piece of text, based on valid shortcode tags.
 *
 * @param {string} text
 * @returns {Array}
 */
YoastShortcodePlugin.prototype.getCapturesFromText = function( text ) {
	var captures = [];

	// First identify which tags are being used in a capturing shortcode by looking for closing tags.
	var captureKeywords = ( text.match( this.closingTagRegex ) || [] ).join(' ').match( this.keywordRegex ) || [];

	// Fetch the capturing shortcodes and strip them from the text so we can easily match the non capturing shortcodes.
	for ( var i in captureKeywords ) {
		var captureKeyword = captureKeywords[i];
		var captureRegex = '\\[' + captureKeyword + '[^\\]]*?\\].*?\\[\\/' + captureKeyword + '\\]';
		var matches = text.match( new RegExp(captureRegex, 'g') ) || [];

		captures = captures.concat( matches );
	}
	return captures;
};

/**
 * Parses the unparsed shortcodes through AJAX and clears them.
 *
 * @param {function} callback function to be called in the context of the AJAX callback.
 */
YoastShortcodePlugin.prototype.parseShortcodes = function( callback ) {
	if ( typeof callback !== 'function' ) {
		console.error( 'Failed to parse shortcodes. Expected parameter to be a function, instead received ' + typeof callback );
		return false;
	}

	if ( typeof this.unparsedShortcodes === 'object' && this.unparsedShortcodes.length > 0 ) {
		var shortcodes = this.unparsedShortcodes;
		this.unparsedShortcodes = [];
		var that = this;
		jQuery.get( ajaxurl, {
				action: 'wpseo_filter_shortcodes',
				_wpnonce: wpseoShortcodePluginL10n.wpseo_filter_shortcodes_nonce,
				data: shortcodes
			},
			function( shortcodeResults ) {
				shortcodeResults = JSON.parse( shortcodeResults);
				for ( var i in shortcodeResults ) {
					that.parsedShortcodes.push( shortcodeResults[ i ] );
				}

				callback();
			}
		);
	}
	else {
		callback();
	}
};
