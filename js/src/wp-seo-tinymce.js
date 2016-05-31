/* global tinyMCE, require */

var forEach = require( 'lodash/forEach' );
var editorHasMarks = require( './decorator/tinyMCE' ).editorHasMarks;
var editorRemoveMarks = require( './decorator/tinyMCE' ).editorRemoveMarks;

(function() {
	'use strict';

	/**
	 * Gets content from the content field by element id.
	 *
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String}
	 */
	function tinyMCEElementContent( content_id ) {
		return document.getElementById( content_id ) && document.getElementById( content_id ).value || '';
	}

	/**
	 * Returns whether or not the tinyMCE script is available on the page.
	 *
	 * @returns {boolean}
	 */
	function isTinyMCELoaded() {
		return (
			typeof tinyMCE !== 'undefined' &&
			typeof tinyMCE.editors !== 'undefined' &&
			tinyMCE.editors.length !== 0
		);
	}

	/**
	 * Returns whether or not a tinyMCE editor with the given ID is available.
	 *
	 * @param {string} editorID The ID of the tinyMCE editor.
	 */
	function isTinyMCEAvailable( editorID ) {
		if ( !isTinyMCELoaded() ) {
			return false;
		}

		var editor = tinyMCE.get( editorID );

		return (
			editor !== null && !editor.isHidden()
		);
	}

	/**
	 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String}
	 */
	function getContentTinyMce( content_id ) {
		//if no TinyMce object available
		if ( isTinyMCEAvailable( content_id ) === false ) {
			return tinyMCEElementContent( content_id );
		}
		return tinyMCE.get( content_id ).getContent();
	}

	/**
	 * Adds an event handler to certain tinyMCE events
	 *
	 * @param {string} editorId The ID for the tinyMCE editor.
	 * @param {Array<string>} events The events to bind to.
	 * @param {Function} callback The function to call when an event occurs.
	 */
	function addEventHandler( editorId, events, callback ) {
		if ( typeof tinyMCE === 'undefined' || typeof tinyMCE.on !== 'function' ) {
			return;
		}

		tinyMCE.on( 'addEditor', function( evt ) {
			var editor = evt.editor;

			if ( editor.id !== editorId ) {
				return;
			}

			forEach( events, function( eventName ) {
				editor.on( eventName, callback );
			} );
		});
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {App} app YoastSeo application.
	 * @param {String} tmceId The ID of the tinyMCE editor.
	 */
	function tinyMceEventBinder( app, tmceId ) {
		addEventHandler( tmceId, [ 'input', 'change', 'cut', 'paste' ], app.refresh.bind( app ) );

		addEventHandler( 'content', [ 'focus' ], function( evt ) {
			var editor = evt.target;

			if ( editorHasMarks( editor ) ) {
				editorRemoveMarks( editor );
			}
		} );
	}

	module.exports = {
		addEventHandler: addEventHandler,
		tinyMceEventBinder: tinyMceEventBinder,
		getContentTinyMce: getContentTinyMce,
		isTinyMCEAvailable: isTinyMCEAvailable,
		isTinyMCELoaded: isTinyMCELoaded
	};
})(jQuery);
