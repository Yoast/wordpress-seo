/* global tinyMCE, require, YoastSEO */

var forEach = require( "lodash/forEach" );
var isUndefined = require( "lodash/isUndefined" );
var editorHasMarks = require( "./decorator/tinyMCE" ).editorHasMarks;
var editorRemoveMarks = require( "./decorator/tinyMCE" ).editorRemoveMarks;
import { setMarkerStatus } from "./redux/actions/markerButtons";
let store;

/**
 * The HTML 'id' attribute for the TinyMCE editor.
 *
 * @type {string}
 */
var tmceId = "content";

/**
 * The HTML 'id' attribute for the tinyMCE editor on the edit term page.
 *
 * @type {string}
 */
var termsTmceId = "description";

( function() {
	/**
	 * Sets the store.
	 *
	 * @param {Object} newStore The store to set.
	 * @returns {void}
	 */
	function setStore( newStore ) {
		store = newStore;
	}

	/**
	 * Gets content from the content field by element id.
	 *
	 * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
	 *
	 * @returns {String} The tinyMCE content.
	 */
	function tinyMCEElementContent( contentID ) {
		return document.getElementById( contentID ) && document.getElementById( contentID ).value || "";
	}

	/**
	 * Returns whether or not the tinyMCE script is available on the page.
	 *
	 * @returns {boolean} True when tinyMCE is loaded.
	 */
	function isTinyMCELoaded() {
		return (
			typeof tinyMCE !== "undefined" &&
			typeof tinyMCE.editors !== "undefined" &&
			tinyMCE.editors.length !== 0
		);
	}

	/**
	 * Checks if the TinyMCE iframe is available. TinyMCE needs this for getContent to be working.
	 * If this element isn't loaded yet, it will let tinyMCE crash when calling getContent. Since tinyMCE
	 * itself doesn't have a check for this and simply assumes the element is always there, we need
	 * to do this check ourselves.
	 *
	 * @param {string} editorID The ID of the tinyMCE editor.
	 *
	 * @returns {boolean} Whether the element is found or not.
	 */
	function isTinyMCEBodyAvailable( editorID ) {
		return document.getElementById( editorID + "_ifr" ) !== null;
	}

	/**
	 * Returns whether or not a tinyMCE editor with the given ID is available.
	 *
	 * @param {string} editorID The ID of the tinyMCE editor.
	 *
	 * @returns {void}
	 */
	function isTinyMCEAvailable( editorID ) {
		if ( ! isTinyMCELoaded() ) {
			return false;
		}

		var editor = tinyMCE.get( editorID );

		return (
			editor !== null && ! editor.isHidden()
		);
	}

	/**
	 * Converts the html entities for symbols back to the original symbol. For now this only converts the & symbol.
	 * @param {String} text The text to replace the '&amp;' entities.
	 * @returns {String} text Text with html entities replaced by the symbol.
	 */
	function convertHtmlEntities( text ) {
		// Create regular expression, this searches for the html entity '&amp;', the 'g' param is for searching the whole text.
		var regularExpression = new RegExp( "&amp;", "g" );
		return text.replace( regularExpression, "&" );
	}

	/**
	 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
	 * Also converts 'amp;' to & in the content.
	 * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
	 * @returns {String} Content from the TinyMCE editor.
	 */
	function getContentTinyMce( contentID ) {
		// If no TinyMCE object available
		var content = "";
		if ( isTinyMCEAvailable( contentID ) === false || isTinyMCEBodyAvailable( contentID ) === false ) {
			content = tinyMCEElementContent( contentID );
		} else {
			content = tinyMCE.get( contentID ).getContent();
		}

		return convertHtmlEntities( content );
	}
	/**
	 * Adds an event handler to certain tinyMCE events.
	 *
	 * @param {string} editorId The ID for the tinyMCE editor.
	 * @param {Array<string>} events The events to bind to.
	 * @param {Function} callback The function to call when an event occurs.
	 *
	 * @returns {void}
	 */
	function addEventHandler( editorId, events, callback ) {
		if ( typeof tinyMCE === "undefined" || typeof tinyMCE.on !== "function" ) {
			return;
		}

		tinyMCE.on( "addEditor", function( evt ) {
			var editor = evt.editor;

			if ( editor.id !== editorId ) {
				return;
			}

			forEach( events, function( eventName ) {
				editor.on( eventName, callback );
			} );
		} );
	}

	/**
	 * Calls the function in the YoastSEO.js app that disables the marker (eye)icons.
	 *
	 * @returns {void}
	 */
	function disableMarkerButtons() {
		if ( ! isUndefined( store ) ) {
			store.dispatch( setMarkerStatus( "disabled" ) );
		}
	}

	/**
	 * Calls the function in the YoastSEO.js app that enables the marker (eye)icons.
	 *
	 * @returns {void}
	 */
	function enableMarkerButtons() {
		if ( ! isUndefined( store ) ) {
			store.dispatch( setMarkerStatus( "enabled" ) );
		}
	}

	/**
	 * If #wp-content-wrap has the 'html-active' class, text view is enabled in WordPress.
	 * TMCE is not available, the text cannot be marked and so the marker buttons are disabled.
	 *
	 * @returns {boolean} Whether the text view is active.
	 */
	function isTextViewActive() {
		const contentWrapElement = document.getElementById( "wp-content-wrap" );
		if ( ! contentWrapElement ) {
			return false;
		}
		return document.getElementById( "wp-content-wrap" ).classList.contains( "html-active" );
	}

	/**
	 * Check if the TinyMCE editor is created in the DOM. If it doesn't exist yet an on create event created.
	 * This enables the marker buttons, when TinyMCE is created.
	 *
	 * @returns {void}
	 */
	function wpTextViewOnInitCheck() {
		if ( isTextViewActive() ) {
			disableMarkerButtons();

			if( isTinyMCELoaded() ) {
				tinyMCE.on( "AddEditor", function() {
					enableMarkerButtons();
				} );
			}
		}
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {App} app YoastSeo application.
	 * @param {String} tmceId The ID of the tinyMCE editor.
	 *
	 * @returns {void}
	 */
	function tinyMceEventBinder( app, tmceId ) {
		addEventHandler( tmceId, [ "input", "change", "cut", "paste" ], app.refresh.bind( app ) );

		addEventHandler( tmceId, [ "hide" ], disableMarkerButtons );
		addEventHandler( tmceId, [ "show" ], enableMarkerButtons );

		addEventHandler( "content", [ "focus" ], function( evt ) {
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
		wpTextViewOnInitCheck: wpTextViewOnInitCheck,
		isTextViewActive: isTextViewActive,
		tmceId,
		termsTmceId,
		setStore,
	};
}( jQuery ) );
