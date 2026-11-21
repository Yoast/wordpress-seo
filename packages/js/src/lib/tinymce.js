/* global tinyMCE, YoastSEO */
import {
	forEach,
	isUndefined,
} from "lodash";

import { editorHasMarks, editorRemoveMarks } from "../decorator/tinyMCE";
import CompatibilityHelper from "../compatibility/compatibilityHelper";
import { actions } from "@yoast/externals/redux";

let store;

/**
 * The HTML 'id' attribute for the TinyMCE editor.
 *
 * @type {string}
 */
export const tmceId = "content";

/**
 * The HTML 'id' attribute for the tinyMCE editor on the edit term page.
 *
 * @type {string}
 */
export const termsTmceId = "description";

/**
 * Sets the store.
 *
 * @param {Object} newStore The store to set.
 * @returns {void}
 */
export function setStore( newStore ) {
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
 * Returns whether the tinyMCE script is available on the page.
 *
 * @returns {boolean} True when tinyMCE is loaded.
 */
export function isTinyMCELoaded() {
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
 * Returns whether a tinyMCE editor with the given ID is available.
 *
 * @param {string} editorID The ID of the tinyMCE editor.
 *
 * @returns {void}
 */
export function isTinyMCEAvailable( editorID ) {
	if ( ! isTinyMCELoaded() ) {
		return false;
	}

	const editor = tinyMCE.get( editorID );

	return (
		editor !== null && ! editor.isHidden()
	);
}

/**
 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
 * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
 * @returns {String} Content from the TinyMCE editor.
 */
export function getContentTinyMce( contentID ) {
	// If no TinyMCE object available
	let content = "";
	if ( isTinyMCEAvailable( contentID ) === false || isTinyMCEBodyAvailable( contentID ) === false ) {
		content = tinyMCEElementContent( contentID );
	} else {
		content = tinyMCE.get( contentID ).getContent();
	}

	return content;
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
export function addEventHandler( editorId, events, callback ) {
	if ( typeof tinyMCE === "undefined" || typeof tinyMCE.on !== "function" ) {
		return;
	}

	tinyMCE.on( "addEditor", function( evt ) {
		const editor = evt.editor;

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
export function disableMarkerButtons() {
	if ( ! isUndefined( store ) ) {
		store.dispatch( actions.setMarkerStatus( "disabled" ) );
	}
}

/**
 * Calls the function in the YoastSEO.js app that enables the marker (eye)icons.
 *
 * @returns {void}
 */
export function enableMarkerButtons() {
	if ( ! isUndefined( store ) ) {
		store.dispatch( actions.setMarkerStatus( "enabled" ) );
	}
}

/**
 * Calls the function in the YoastSEO.js app that pauses to display the markers in the TinyMCE editor.
 *
 * @returns {void}
 */
export function pauseMarkers() {
	if ( ! isUndefined( store ) ) {
		store.dispatch( actions.setMarkerPauseStatus( true ) );
	}
}

/**
 * Calls the function in the YoastSEO.js app that restores showing markers in the TinyMCE editor.
 *
 * @returns {void}
 */
export function resumeMarkers() {
	if ( ! isUndefined( store ) ) {
		store.dispatch( actions.setMarkerPauseStatus( false ) );
	}
}

/**
 * If #wp-content-wrap has the 'html-active' class, text view is enabled in WordPress.
 * TMCE is not available, the text cannot be marked and so the marker buttons are disabled.
 *
 * @returns {boolean} Whether the text view is active.
 */
export function isTextViewActive() {
	const contentWrapElement = document.getElementById( "wp-content-wrap" );
	if ( ! contentWrapElement ) {
		return false;
	}
	return contentWrapElement.classList.contains( "html-active" );
}

/**
 * Check if the TinyMCE editor is created in the DOM. If it doesn't exist yet an on create event created.
 * This enables the marker buttons, when TinyMCE is created.
 *
 * @returns {void}
 */
export function wpTextViewOnInitCheck() {
	if ( ! isTextViewActive() ) {
		return;
	}

	disableMarkerButtons();

	if ( isTinyMCELoaded() ) {
		tinyMCE.on( "AddEditor", function() {
			enableMarkerButtons();
		} );
	}
}

/**
 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
 *
 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
 * @param {string}   tinyMceId       The ID of the tinyMCE editor.
 *
 * @returns {void}
 */
export function tinyMceEventBinder( refreshAnalysis, tinyMceId ) {
	addEventHandler( tinyMceId, [ "input", "change", "cut", "paste" ], refreshAnalysis );

	addEventHandler( tinyMceId, [ "hide" ], disableMarkerButtons );

	const enableEvents = [ "show" ];
	const compatibilityHelper = new CompatibilityHelper();
	if ( ! compatibilityHelper.isPageBuilderActive() ) {
		enableEvents.push( "init" );
	}

	addEventHandler( tinyMceId, enableEvents, enableMarkerButtons );

	addEventHandler( "content", [ "focus" ], function( evt ) {
		const editor = evt.target;

		if ( editorHasMarks( editor ) ) {
			editorRemoveMarks( editor );

			YoastSEO.app.disableMarkers();
		}

		pauseMarkers();
	} );

	addEventHandler( "content", [ "blur" ], function() {
		resumeMarkers();
	} );
}
