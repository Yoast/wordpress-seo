(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global tinyMCE */
/* global wpseoShortcodePluginL10n */
/* global ajaxurl */
/* global _ */
/* global console */
(function() {
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
	var YoastShortcodePlugin = function( app ) {
		this._app = app;

		this._app.registerPlugin( 'YoastShortcodePlugin', { status: 'loading' } );
		this.bindElementEvents();

		var keywordRegexString = '(' + wpseoShortcodePluginL10n.wpseo_shortcode_tags.join('|') + ')';

		// The regex for matching shortcodes based on the available shortcode keywords.
		this.keywordRegex = new RegExp( keywordRegexString, 'g');
		this.closingTagRegex = new RegExp( '\\[\\/' + keywordRegexString + '\\]', 'g' );
		this.nonCaptureRegex = new RegExp('\\[' + keywordRegexString + '[^\\]]*?\\]', 'g');

		this.parsedShortcodes = [];

		this.loadShortcodes( this.declareReady.bind( this ) );
	};

	/* YOAST SEO CLIENT */

	/**
	 * Declares ready with YoastSEO.
	 */
	YoastShortcodePlugin.prototype.declareReady = function() {
		this._app.pluginReady( 'YoastShortcodePlugin' );
		this.registerModifications();
	};

	/**
	 * Declares reloaded with YoastSEO.
	 */
	YoastShortcodePlugin.prototype.declareReloaded = function() {
		this._app.pluginReloaded( 'YoastShortcodePlugin' );
	};

	/**
	 * Registers the modifications for the content in which we want to replace shortcodes.
	 */
	YoastShortcodePlugin.prototype.registerModifications = function() {
		this._app.registerModification( 'content', this.replaceShortcodes.bind( this ), 'YoastShortcodePlugin' );
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
			for ( var i = 0; i < parsedShortcodes.length; i++ ) {
				data = data.replace( parsedShortcodes[ i ].shortcode, parsedShortcodes[ i ].output );
			}
		}

		return data;
	};

	/* DATA SOURCING */

	/**
	 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippetpreview
	 *
	 * @param {function} callback To declare either ready or reloaded after parsing.
	 */
	YoastShortcodePlugin.prototype.loadShortcodes = function( callback ) {
		var unparsedShortcodes = this.getUnparsedShortcodes( this.getShortcodes( this.getContentTinyMCE() ) );
		if ( unparsedShortcodes.length > 0 ) {
			this.parseShortcodes( unparsedShortcodes, callback );
		} else {
			callback();
		}
	};

	/**
	 * Bind elements to be able to reload the dataset if shortcodes get added.
	 */
	YoastShortcodePlugin.prototype.bindElementEvents = function() {
		var contentElement = document.getElementById( 'content' ) || false;
		var callback =  _.debounce(	this.loadShortcodes.bind( this, this.declareReloaded.bind( this ) ), 500 );

		if (contentElement) {
			contentElement.addEventListener( 'keyup', callback );
			contentElement.addEventListener( 'change', callback );
		}

		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			tinyMCE.on( 'addEditor', function( e ) {
				e.editor.on( 'change', callback );
				e.editor.on( 'keyup', callback );
			});
		}
	};

	/**
	 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
	 * @returns {String}
	 */
	YoastShortcodePlugin.prototype.getContentTinyMCE = function() {
		var val = document.getElementById( 'content' ) && document.getElementById( 'content' ).value || '';
		if ( typeof tinyMCE !== 'undefined' && typeof tinyMCE.editors !== 'undefined' && tinyMCE.editors.length !== 0 ) {
			val = tinyMCE.get( 'content' ) && tinyMCE.get( 'content' ).getContent() || '';
		}

		return val;
	};

	/* SHORTCODE PARSING */

	/**
	 * Returns the unparsed shortcodes out of a collection of shortcodes.
	 *
	 * @param {Array} shortcodes
	 * @returns {Array}
	 */
	YoastShortcodePlugin.prototype.getUnparsedShortcodes = function( shortcodes ) {
		if ( typeof shortcodes !== 'object') {
			console.error( 'Failed to get unparsed shortcodes. Expected parameter to be an array, instead received ' + typeof shortcodes ); // jshint ignore:line
			return false;
		}

		var unparsedShortcodes = [];

		for ( var i = 0; i < shortcodes.length; i++ ) {
			var shortcode = shortcodes[ i ];
			if ( unparsedShortcodes.indexOf( shortcode ) === -1 && this.isUnparsedShortcode( shortcode ) ) {
				unparsedShortcodes.push( shortcode );
			}
		}

		return unparsedShortcodes;
	};

	/**
	 * Checks if a given shortcode was already parsed.
	 *
	 * @param {string} shortcode
	 * @returns {boolean}
	 */
	YoastShortcodePlugin.prototype.isUnparsedShortcode = function( shortcode ) {
		var already_exists = false;

		for ( var i = 0; i < this.parsedShortcodes.length; i++ ) {
			if ( this.parsedShortcodes[ i ].shortcode === shortcode ) {
				already_exists = true;
			}
		}

		return already_exists === false;
	};

	/**
	 * Gets the shortcodes from a given piece of text.
	 *
	 * @param {string} text
	 * @returns {array} The matched shortcodes
	 */
	YoastShortcodePlugin.prototype.getShortcodes = function( text ) {
		if ( typeof text !== 'string') {
			console.error( 'Failed to get shortcodes. Expected parameter to be a string, instead received' + typeof text ); // jshint ignore:line
			return false;
		}

		var captures = this.matchCapturingShortcodes( text );

		// Remove the capturing shortcodes from the text before trying to match the capturing shortcodes.
		for ( var i = 0; i < captures.length; i++ ) {
			text = text.replace(captures[ i ], '');
		}

		var nonCaptures = this.matchNonCapturingShortcodes( text );

		return captures.concat( nonCaptures );
	};

	/**
	 * Matches the capturing shortcodes from a given piece of text.
	 *
	 * @param {string} text
	 * @returns {Array}
	 */
	YoastShortcodePlugin.prototype.matchCapturingShortcodes = function( text ) {
		var captures = [];

		// First identify which tags are being used in a capturing shortcode by looking for closing tags.
		var captureKeywords = ( text.match( this.closingTagRegex ) || [] ).join(' ').match( this.keywordRegex ) || [];

		// Fetch the capturing shortcodes and strip them from the text so we can easily match the non capturing shortcodes.
		for ( var i = 0; i < captureKeywords.length; i++ ) {
			var captureKeyword = captureKeywords[i];
			var captureRegex = '\\[' + captureKeyword + '[^\\]]*?\\].*?\\[\\/' + captureKeyword + '\\]';
			var matches = text.match( new RegExp(captureRegex, 'g') ) || [];

			captures = captures.concat( matches );
		}

		return captures;
	};

	/**
	 * Matches the non capturing shortcodes from a given piece of text.
	 *
	 * @param {string} text
	 * @returns {Array}
	 */
	YoastShortcodePlugin.prototype.matchNonCapturingShortcodes = function( text ) {
		return text.match( this.nonCaptureRegex ) || [];
	};

	/**
	 * Parses the unparsed shortcodes through AJAX and clears them.
	 *
	 * @param {Array} shortcodes shortcodes to be parsed.
	 * @param {function} callback function to be called in the context of the AJAX callback.
	 */
	YoastShortcodePlugin.prototype.parseShortcodes = function( shortcodes, callback ) {
		if ( typeof callback !== 'function' ) {
			console.error( 'Failed to parse shortcodes. Expected parameter to be a function, instead received ' + typeof callback ); // jshint ignore:line
			return false;
		}

		if ( typeof shortcodes === 'object' && shortcodes.length > 0 ) {
			jQuery.post( ajaxurl, {
					action: 'wpseo_filter_shortcodes',
					_wpnonce: wpseoShortcodePluginL10n.wpseo_filter_shortcodes_nonce,
					data: shortcodes
				},
				function( shortcodeResults ) {
					this.saveParsedShortcodes( shortcodeResults, callback );
				}.bind( this )
			);
		}
		else {
			callback();
		}
	};

	/**
	 * Saves the shortcodes that were parsed with AJAX to `this.parsedShortcodes`
	 *
	 * @param {Array} shortcodeResults
	 * @param {function} callback
	 */
	YoastShortcodePlugin.prototype.saveParsedShortcodes = function( shortcodeResults, callback ) {
		shortcodeResults = JSON.parse( shortcodeResults);
		for ( var i = 0; i < shortcodeResults.length; i++ ) {
			this.parsedShortcodes.push( shortcodeResults[ i ] );
		}

		callback();
	};

	window.YoastShortcodePlugin = YoastShortcodePlugin;
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXNob3J0Y29kZS1wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB0aW55TUNFICovXG4vKiBnbG9iYWwgd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuICovXG4vKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIF8gKi9cbi8qIGdsb2JhbCBjb25zb2xlICovXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogVGhlIFlvYXN0IFNob3J0Y29kZSBwbHVnaW4gcGFyc2VzIHRoZSBzaG9ydGNvZGVzIGluIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC4gSXQgYW5hbHl6ZXMgbXVsdGlwbGUgaW5wdXQgZmllbGRzIGZvciBzaG9ydGNvZGVzIHdoaWNoIGl0IHdpbGwgcHJlbG9hZCB1c2luZyBBSkFYLlxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGtleXdvcmRSZWdleCBVc2VkIHRvIG1hdGNoIGEgZ2l2ZW4gc3RyaW5nIGZvciB2YWxpZCBzaG9ydGNvZGUga2V5d29yZHMuXG5cdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBjbG9zaW5nVGFnUmVnZXggVXNlZCB0byBtYXRjaCBhIGdpdmVuIHN0cmluZyBmb3Igc2hvcnRjb2RlIGNsb3NpbmcgdGFncy5cblx0ICogQHByb3BlcnR5IHtSZWdFeHB9IG5vbkNhcHR1cmVSZWdleCBVc2VkIHRvIG1hdGNoIGEgZ2l2ZW4gc3RyaW5nIGZvciBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMuXG5cdCAqIEBwcm9wZXJ0eSB7QXJyYXl9IHBhcnNlZFNob3J0Y29kZXMgVXNlZCB0byBzdG9yZSBwYXJzZWQgc2hvcnRjb2Rlcy5cblx0ICovXG5cdHZhciBZb2FzdFNob3J0Y29kZVBsdWdpbiA9IGZ1bmN0aW9uKCBhcHAgKSB7XG5cdFx0dGhpcy5fYXBwID0gYXBwO1xuXG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyUGx1Z2luKCAnWW9hc3RTaG9ydGNvZGVQbHVnaW4nLCB7IHN0YXR1czogJ2xvYWRpbmcnIH0gKTtcblx0XHR0aGlzLmJpbmRFbGVtZW50RXZlbnRzKCk7XG5cblx0XHR2YXIga2V5d29yZFJlZ2V4U3RyaW5nID0gJygnICsgd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuLndwc2VvX3Nob3J0Y29kZV90YWdzLmpvaW4oJ3wnKSArICcpJztcblxuXHRcdC8vIFRoZSByZWdleCBmb3IgbWF0Y2hpbmcgc2hvcnRjb2RlcyBiYXNlZCBvbiB0aGUgYXZhaWxhYmxlIHNob3J0Y29kZSBrZXl3b3Jkcy5cblx0XHR0aGlzLmtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoIGtleXdvcmRSZWdleFN0cmluZywgJ2cnKTtcblx0XHR0aGlzLmNsb3NpbmdUYWdSZWdleCA9IG5ldyBSZWdFeHAoICdcXFxcW1xcXFwvJyArIGtleXdvcmRSZWdleFN0cmluZyArICdcXFxcXScsICdnJyApO1xuXHRcdHRoaXMubm9uQ2FwdHVyZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXFsnICsga2V5d29yZFJlZ2V4U3RyaW5nICsgJ1teXFxcXF1dKj9cXFxcXScsICdnJyk7XG5cblx0XHR0aGlzLnBhcnNlZFNob3J0Y29kZXMgPSBbXTtcblxuXHRcdHRoaXMubG9hZFNob3J0Y29kZXMoIHRoaXMuZGVjbGFyZVJlYWR5LmJpbmQoIHRoaXMgKSApO1xuXHR9O1xuXG5cdC8qIFlPQVNUIFNFTyBDTElFTlQgKi9cblxuXHQvKipcblx0ICogRGVjbGFyZXMgcmVhZHkgd2l0aCBZb2FzdFNFTy5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5kZWNsYXJlUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucGx1Z2luUmVhZHkoICdZb2FzdFNob3J0Y29kZVBsdWdpbicgKTtcblx0XHR0aGlzLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucygpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEZWNsYXJlcyByZWxvYWRlZCB3aXRoIFlvYXN0U0VPLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmRlY2xhcmVSZWxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWxvYWRlZCggJ1lvYXN0U2hvcnRjb2RlUGx1Z2luJyApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGhlIG1vZGlmaWNhdGlvbnMgZm9yIHRoZSBjb250ZW50IGluIHdoaWNoIHdlIHdhbnQgdG8gcmVwbGFjZSBzaG9ydGNvZGVzLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggJ2NvbnRlbnQnLCB0aGlzLnJlcGxhY2VTaG9ydGNvZGVzLmJpbmQoIHRoaXMgKSwgJ1lvYXN0U2hvcnRjb2RlUGx1Z2luJyApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdXNlZCB0byByZXBsYWNlIHRoZSBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnJlcGxhY2VTaG9ydGNvZGVzID0gZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0dmFyIHBhcnNlZFNob3J0Y29kZXMgPSB0aGlzLnBhcnNlZFNob3J0Y29kZXM7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiBwYXJzZWRTaG9ydGNvZGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBwYXJzZWRTaG9ydGNvZGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKCBwYXJzZWRTaG9ydGNvZGVzWyBpIF0uc2hvcnRjb2RlLCBwYXJzZWRTaG9ydGNvZGVzWyBpIF0ub3V0cHV0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH07XG5cblx0LyogREFUQSBTT1VSQ0lORyAqL1xuXG5cdC8qKlxuXHQgKiBHZXQgZGF0YSBmcm9tIGlucHV0ZmllbGRzIGFuZCBzdG9yZSB0aGVtIGluIGFuIGFuYWx5emVyRGF0YSBvYmplY3QuIFRoaXMgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBmaWxsXG5cdCAqIHRoZSBhbmFseXplciBhbmQgdGhlIHNuaXBwZXRwcmV2aWV3XG5cdCAqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRvIGRlY2xhcmUgZWl0aGVyIHJlYWR5IG9yIHJlbG9hZGVkIGFmdGVyIHBhcnNpbmcuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubG9hZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0dmFyIHVucGFyc2VkU2hvcnRjb2RlcyA9IHRoaXMuZ2V0VW5wYXJzZWRTaG9ydGNvZGVzKCB0aGlzLmdldFNob3J0Y29kZXMoIHRoaXMuZ2V0Q29udGVudFRpbnlNQ0UoKSApICk7XG5cdFx0aWYgKCB1bnBhcnNlZFNob3J0Y29kZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdHRoaXMucGFyc2VTaG9ydGNvZGVzKCB1bnBhcnNlZFNob3J0Y29kZXMsIGNhbGxiYWNrICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBCaW5kIGVsZW1lbnRzIHRvIGJlIGFibGUgdG8gcmVsb2FkIHRoZSBkYXRhc2V0IGlmIHNob3J0Y29kZXMgZ2V0IGFkZGVkLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmJpbmRFbGVtZW50RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdjb250ZW50JyApIHx8IGZhbHNlO1xuXHRcdHZhciBjYWxsYmFjayA9ICBfLmRlYm91bmNlKFx0dGhpcy5sb2FkU2hvcnRjb2Rlcy5iaW5kKCB0aGlzLCB0aGlzLmRlY2xhcmVSZWxvYWRlZC5iaW5kKCB0aGlzICkgKSwgNTAwICk7XG5cblx0XHRpZiAoY29udGVudEVsZW1lbnQpIHtcblx0XHRcdGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXl1cCcsIGNhbGxiYWNrICk7XG5cdFx0XHRjb250ZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgY2FsbGJhY2sgKTtcblx0XHR9XG5cblx0XHRpZiggdHlwZW9mIHRpbnlNQ0UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0aW55TUNFLm9uID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0dGlueU1DRS5vbiggJ2FkZEVkaXRvcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLmVkaXRvci5vbiggJ2NoYW5nZScsIGNhbGxiYWNrICk7XG5cdFx0XHRcdGUuZWRpdG9yLm9uKCAna2V5dXAnLCBjYWxsYmFjayApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBnZXRzIGNvbnRlbnQgZnJvbSB0aGUgY29udGVudCBmaWVsZCwgaWYgdGlueU1DRSBpcyBpbml0aWFsaXplZCwgdXNlIHRoZSBnZXRDb250ZW50IGZ1bmN0aW9uIHRvIGdldCB0aGUgZGF0YSBmcm9tIHRpbnlNQ0Vcblx0ICogQHJldHVybnMge1N0cmluZ31cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRDb250ZW50VGlueU1DRSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2NvbnRlbnQnICkgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdjb250ZW50JyApLnZhbHVlIHx8ICcnO1xuXHRcdGlmICggdHlwZW9mIHRpbnlNQ0UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0aW55TUNFLmVkaXRvcnMgIT09ICd1bmRlZmluZWQnICYmIHRpbnlNQ0UuZWRpdG9ycy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHR2YWwgPSB0aW55TUNFLmdldCggJ2NvbnRlbnQnICkgJiYgdGlueU1DRS5nZXQoICdjb250ZW50JyApLmdldENvbnRlbnQoKSB8fCAnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsO1xuXHR9O1xuXG5cdC8qIFNIT1JUQ09ERSBQQVJTSU5HICovXG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHVucGFyc2VkIHNob3J0Y29kZXMgb3V0IG9mIGEgY29sbGVjdGlvbiBvZiBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzaG9ydGNvZGVzXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRVbnBhcnNlZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlcyApIHtcblx0XHRpZiAoIHR5cGVvZiBzaG9ydGNvZGVzICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0Y29uc29sZS5lcnJvciggJ0ZhaWxlZCB0byBnZXQgdW5wYXJzZWQgc2hvcnRjb2Rlcy4gRXhwZWN0ZWQgcGFyYW1ldGVyIHRvIGJlIGFuIGFycmF5LCBpbnN0ZWFkIHJlY2VpdmVkICcgKyB0eXBlb2Ygc2hvcnRjb2RlcyApOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgdW5wYXJzZWRTaG9ydGNvZGVzID0gW107XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBzaG9ydGNvZGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dmFyIHNob3J0Y29kZSA9IHNob3J0Y29kZXNbIGkgXTtcblx0XHRcdGlmICggdW5wYXJzZWRTaG9ydGNvZGVzLmluZGV4T2YoIHNob3J0Y29kZSApID09PSAtMSAmJiB0aGlzLmlzVW5wYXJzZWRTaG9ydGNvZGUoIHNob3J0Y29kZSApICkge1xuXHRcdFx0XHR1bnBhcnNlZFNob3J0Y29kZXMucHVzaCggc2hvcnRjb2RlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVucGFyc2VkU2hvcnRjb2Rlcztcblx0fTtcblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIGEgZ2l2ZW4gc2hvcnRjb2RlIHdhcyBhbHJlYWR5IHBhcnNlZC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNob3J0Y29kZVxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5pc1VucGFyc2VkU2hvcnRjb2RlID0gZnVuY3Rpb24oIHNob3J0Y29kZSApIHtcblx0XHR2YXIgYWxyZWFkeV9leGlzdHMgPSBmYWxzZTtcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMucGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdGlmICggdGhpcy5wYXJzZWRTaG9ydGNvZGVzWyBpIF0uc2hvcnRjb2RlID09PSBzaG9ydGNvZGUgKSB7XG5cdFx0XHRcdGFscmVhZHlfZXhpc3RzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gYWxyZWFkeV9leGlzdHMgPT09IGZhbHNlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBzaG9ydGNvZGVzIGZyb20gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuXHQgKiBAcmV0dXJucyB7YXJyYXl9IFRoZSBtYXRjaGVkIHNob3J0Y29kZXNcblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdGV4dCAhPT0gJ3N0cmluZycpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoICdGYWlsZWQgdG8gZ2V0IHNob3J0Y29kZXMuIEV4cGVjdGVkIHBhcmFtZXRlciB0byBiZSBhIHN0cmluZywgaW5zdGVhZCByZWNlaXZlZCcgKyB0eXBlb2YgdGV4dCApOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgY2FwdHVyZXMgPSB0aGlzLm1hdGNoQ2FwdHVyaW5nU2hvcnRjb2RlcyggdGV4dCApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBmcm9tIHRoZSB0ZXh0IGJlZm9yZSB0cnlpbmcgdG8gbWF0Y2ggdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzLlxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGNhcHR1cmVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZShjYXB0dXJlc1sgaSBdLCAnJyk7XG5cdFx0fVxuXG5cdFx0dmFyIG5vbkNhcHR1cmVzID0gdGhpcy5tYXRjaE5vbkNhcHR1cmluZ1Nob3J0Y29kZXMoIHRleHQgKTtcblxuXHRcdHJldHVybiBjYXB0dXJlcy5jb25jYXQoIG5vbkNhcHR1cmVzICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE1hdGNoZXMgdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubWF0Y2hDYXB0dXJpbmdTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0dmFyIGNhcHR1cmVzID0gW107XG5cblx0XHQvLyBGaXJzdCBpZGVudGlmeSB3aGljaCB0YWdzIGFyZSBiZWluZyB1c2VkIGluIGEgY2FwdHVyaW5nIHNob3J0Y29kZSBieSBsb29raW5nIGZvciBjbG9zaW5nIHRhZ3MuXG5cdFx0dmFyIGNhcHR1cmVLZXl3b3JkcyA9ICggdGV4dC5tYXRjaCggdGhpcy5jbG9zaW5nVGFnUmVnZXggKSB8fCBbXSApLmpvaW4oJyAnKS5tYXRjaCggdGhpcy5rZXl3b3JkUmVnZXggKSB8fCBbXTtcblxuXHRcdC8vIEZldGNoIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBhbmQgc3RyaXAgdGhlbSBmcm9tIHRoZSB0ZXh0IHNvIHdlIGNhbiBlYXNpbHkgbWF0Y2ggdGhlIG5vbiBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBjYXB0dXJlS2V5d29yZHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR2YXIgY2FwdHVyZUtleXdvcmQgPSBjYXB0dXJlS2V5d29yZHNbaV07XG5cdFx0XHR2YXIgY2FwdHVyZVJlZ2V4ID0gJ1xcXFxbJyArIGNhcHR1cmVLZXl3b3JkICsgJ1teXFxcXF1dKj9cXFxcXS4qP1xcXFxbXFxcXC8nICsgY2FwdHVyZUtleXdvcmQgKyAnXFxcXF0nO1xuXHRcdFx0dmFyIG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKCBuZXcgUmVnRXhwKGNhcHR1cmVSZWdleCwgJ2cnKSApIHx8IFtdO1xuXG5cdFx0XHRjYXB0dXJlcyA9IGNhcHR1cmVzLmNvbmNhdCggbWF0Y2hlcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjYXB0dXJlcztcblx0fTtcblxuXHQvKipcblx0ICogTWF0Y2hlcyB0aGUgbm9uIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubWF0Y2hOb25DYXB0dXJpbmdTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0cmV0dXJuIHRleHQubWF0Y2goIHRoaXMubm9uQ2FwdHVyZVJlZ2V4ICkgfHwgW107XG5cdH07XG5cblx0LyoqXG5cdCAqIFBhcnNlcyB0aGUgdW5wYXJzZWQgc2hvcnRjb2RlcyB0aHJvdWdoIEFKQVggYW5kIGNsZWFycyB0aGVtLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzaG9ydGNvZGVzIHNob3J0Y29kZXMgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhlIEFKQVggY2FsbGJhY2suXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucGFyc2VTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHNob3J0Y29kZXMsIGNhbGxiYWNrICkge1xuXHRcdGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0Y29uc29sZS5lcnJvciggJ0ZhaWxlZCB0byBwYXJzZSBzaG9ydGNvZGVzLiBFeHBlY3RlZCBwYXJhbWV0ZXIgdG8gYmUgYSBmdW5jdGlvbiwgaW5zdGVhZCByZWNlaXZlZCAnICsgdHlwZW9mIGNhbGxiYWNrICk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHNob3J0Y29kZXMgPT09ICdvYmplY3QnICYmIHNob3J0Y29kZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRcdFx0YWN0aW9uOiAnd3BzZW9fZmlsdGVyX3Nob3J0Y29kZXMnLFxuXHRcdFx0XHRcdF93cG5vbmNlOiB3cHNlb1Nob3J0Y29kZVBsdWdpbkwxMG4ud3BzZW9fZmlsdGVyX3Nob3J0Y29kZXNfbm9uY2UsXG5cdFx0XHRcdFx0ZGF0YTogc2hvcnRjb2Rlc1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbiggc2hvcnRjb2RlUmVzdWx0cyApIHtcblx0XHRcdFx0XHR0aGlzLnNhdmVQYXJzZWRTaG9ydGNvZGVzKCBzaG9ydGNvZGVSZXN1bHRzLCBjYWxsYmFjayApO1xuXHRcdFx0XHR9LmJpbmQoIHRoaXMgKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjYWxsYmFjaygpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogU2F2ZXMgdGhlIHNob3J0Y29kZXMgdGhhdCB3ZXJlIHBhcnNlZCB3aXRoIEFKQVggdG8gYHRoaXMucGFyc2VkU2hvcnRjb2Rlc2Bcblx0ICpcblx0ICogQHBhcmFtIHtBcnJheX0gc2hvcnRjb2RlUmVzdWx0c1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnNhdmVQYXJzZWRTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHNob3J0Y29kZVJlc3VsdHMsIGNhbGxiYWNrICkge1xuXHRcdHNob3J0Y29kZVJlc3VsdHMgPSBKU09OLnBhcnNlKCBzaG9ydGNvZGVSZXN1bHRzKTtcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBzaG9ydGNvZGVSZXN1bHRzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dGhpcy5wYXJzZWRTaG9ydGNvZGVzLnB1c2goIHNob3J0Y29kZVJlc3VsdHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrKCk7XG5cdH07XG5cblx0d2luZG93LllvYXN0U2hvcnRjb2RlUGx1Z2luID0gWW9hc3RTaG9ydGNvZGVQbHVnaW47XG59KCkpO1xuIl19
