/* global tinyMCE, require, YoastSEO */

var forEach = require( 'lodash/forEach' );
var isUndefined = require( 'lodash/isUndefined' );
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
	 * Converts the html entities for symbols back to the original symbol. For now this only converts the & symbol.
	 * @param {String} text The text to replace the '&amp;' entities.
	 * @returns {String} text Text with html entities replaced by the symbol.
	 */
	function convertHtmlEntities( text ) {
		// Create regular expression, this searches for the html entity '&amp;', the 'g' param is for searching the whole text.
		var regularExpression = new RegExp('&amp;','g');
		return text.replace(regularExpression, '&');
	}

	/**
	 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
	 * Also converts 'amp;' to & in the content.
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String} Content from the TinyMCE editor.
	 */
	function getContentTinyMce( content_id ) {
		//if no TinyMce object available
		var content = '';
		if ( isTinyMCEAvailable( content_id ) === false ) {
			content = tinyMCEElementContent( content_id );
		}
		else {
			content = tinyMCE.get( content_id ).getContent();
		}

		return convertHtmlEntities( content );
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
	 * Calls the function in the YoastSEO.js app that disables the marker (eye)icons.
	 */
	function disableMarkerButtons() {
		if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
			YoastSEO.app.contentAssessorPresenter.disableMarkerButtons();
		}

		if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
			YoastSEO.app.seoAssessorPresenter.disableMarkerButtons();
		}
	}

	/**
	 * Calls the function in the YoastSEO.js app that enables the marker (eye)icons.
	 */
	function enableMarkerButtons() {
		if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
			YoastSEO.app.contentAssessorPresenter.enableMarkerButtons();
		}

		if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
			YoastSEO.app.seoAssessorPresenter.enableMarkerButtons();
		}
	}

	/**
	 * Check if the TinyMCE editor is created in the DOM. If it doesn't exist yet an on create event created.
	 * This enables the marker buttons, when TinyMCE is created.
	 */
	function wpTextViewOnInitCheck() {
		// If #wp-content-wrap has the 'html-active' class, text view is enabled in WordPress.
		// TMCE is not available, the text cannot be marked and so the marker buttons are disabled.
		if ( jQuery( '#wp-content-wrap' ).hasClass( 'html-active' ) ) {
			// The enable/disable marker functions are not called here,
			// because the render function(in yoastseo lib) doesn't have to be called.
			if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
				YoastSEO.app.contentAssessorPresenter._disableMarkerButtons = true;
			}
			if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
				YoastSEO.app.seoAssessorPresenter._disableMarkerButtons = true;
			}
			if( isTinyMCELoaded() ) {
				tinyMCE.on( 'AddEditor' , function( ) {
					enableMarkerButtons( );
				} );
			}

		}
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {App} app YoastSeo application.
	 * @param {String} tmceId The ID of the tinyMCE editor.
	 */
	function tinyMceEventBinder( app, tmceId ) {
		addEventHandler( tmceId, [ 'input', 'change', 'cut', 'paste' ], app.refresh.bind( app ) );

		addEventHandler( tmceId, [ 'hide' ], disableMarkerButtons );
		addEventHandler( tmceId, [ 'show' ], enableMarkerButtons );

		addEventHandler( 'content', [ 'focus' ], function( evt ) {
			var editor = evt.target;

			if ( editorHasMarks( editor ) ) {
				editorRemoveMarks( editor );

				YoastSEO.app.disableMarkers();
			}
		} );
	}

	module.exports = {
		addEventHandler: addEventHandler,
		tinyMceEventBinder: tinyMceEventBinder,
		getContentTinyMce: getContentTinyMce,
		isTinyMCEAvailable: isTinyMCEAvailable,
		isTinyMCELoaded: isTinyMCELoaded,
		disableMarkerButtons: disableMarkerButtons,
		enableMarkerButtons: enableMarkerButtons,
		wpTextViewOnInitCheck: wpTextViewOnInitCheck
	};
})(jQuery);
