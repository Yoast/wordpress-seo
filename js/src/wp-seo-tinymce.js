/* global tinyMCE */
(function() {
	'use strict';

	/**
	 * Gets content from the content field by element id.
	 *
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String} Returns the content from the TinyMCE editor.
	 */
	function tinyMCEElementContent( content_id ) {
		return document.getElementById( content_id ) && document.getElementById( content_id ).value || '';
	}

	/**
	 * Returns whether or not the tinyMCE script is available on the page.
	 *
	 * @returns {boolean} True if TinyMCE is available, false if not.
	 */
	function isTinyMCELoaded() {
		return (
			typeof tinyMCE !== 'undefined' &&
			typeof tinyMCE.editors !== 'undefined' &&
			tinyMCE.editors.length !== 0
		);
	}

	/**
	 * Returns whether or not a tinyMCE editor with the given ID is loaded and available.
	 *
	 * @param {String} editorID The ID of the tinyMCE editor
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
	 * @returns {String} The content from the TinyMCE editor.
	 */
	function getContentTinyMce( content_id ) {
		//if no TinyMce object available
		if ( isTinyMCEAvailable( content_id ) === false ) {
			return tinyMCEElementContent( content_id );
		}
		return tinyMCE.get( content_id ).getContent();
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {String} app Application
	 * @param {String} tmce_id The ID of the tinyMCE editor.
	 */
	function tinyMceEventBinder( app, tmce_id ) {
		if ( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			//binds the input, change, cut and paste event to tinyMCE. All events are needed, because sometimes tinyMCE doesn'
			//trigger them, or takes up to ten seconds to fire an event.
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( evt ) {
				if ( evt.id === tmce_id ) {
					for ( var i = 0; i < events.length; i++ ) {
						evt.editor.on( events[ i ], app.analyzeTimer.bind( app ) );
					}
				}
			} );
		}
	}

	module.exports = {
		tinyMceEventBinder: tinyMceEventBinder,
		getContentTinyMce: getContentTinyMce,
		isTinyMCEAvailable: isTinyMCEAvailable,
		isTinyMCELoaded: isTinyMCELoaded
	};
}());
