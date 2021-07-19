import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, get } from "lodash";
import { Paper } from "yoastseo";

/**
 * Retrieves the estimated reading time.
 *
 * @param {string} content The content.
 *
 * @returns {void}
 */
function getEstimatedReadingTime( content ) {
	window.YoastSEO.analysis.worker.runResearch( "readingTime", new Paper( content, {} ) )
		.then( ( response ) => {
			dispatch( "yoast-seo/editor" ).setEstimatedReadingTime( response.result );
		} );
}

// Delays execution by 1,5 seconds for any change, forces execution after 3 seconds.
const debouncedGetEstimatedReadingTime = debounce( getEstimatedReadingTime, 1500, { maxWait: 3000 } );

/**
 * Initializes the estimated reading time for the classic editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeClassic() {
	const tmceEvents = [ "input", "change", "cut", "paste" ];
	const editorHandle = get( window, "wpseoScriptData.isPost", "0" ) === "1" ? "content" : "description";

	// Once tinyMCE is initialized, add the listeners.
	jQuery( document ).on( "tinymce-editor-init", ( event, editor ) => {
		if ( editor.id !== editorHandle ) {
			return;
		}

		tmceEvents.forEach( ( eventName ) => {
			editor.on( eventName, () => {
				debouncedGetEstimatedReadingTime( editor.getContent() );
			} );
		} );
	} );
}

// Used to trigger the initial reading time calculation for the block and Elementor editors.
let previousContent = '';

/**
 * Initializes the estimated reading time for the block editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeBlockEditor() {
	subscribe( () => {
		doBlockEditorDebounce();
	} );
}

/**
 * Reads and compares the data from the block editor.
 *
 * @returns {void}
 */
function blockEditorDebounce() {
	const content = select( "core/editor" ).getEditedPostAttribute( "content" );
	if ( previousContent != content ){
		previousContent = content;
		getEstimatedReadingTime( content );
	}
}

// Delays execution by 1,5 seconds for any change, forces execution after 3 seconds.
const doBlockEditorDebounce = debounce( blockEditorDebounce, 1500, { maxWait: 3000 } );

/**
 * Initializes the estimated reading time for the Elementor editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeElementor() {
	subscribe( () => {
		doElementorEditorDebounce();
	} );
}

/**
 * Reads and compares the data from the Elementor editor.
 *
 * @returns {void}
 */
 function elementorEditorDebounce() {
	const content = select( "yoast-seo/editor" ).getEditorDataContent();
	if ( previousContent != content ){
		previousContent = content;
		getEstimatedReadingTime( content );
	}
}

// Delays execution by 1,5 seconds for any change, forces execution after 3 seconds.
const doElementorEditorDebounce = debounce( elementorEditorDebounce, 1500, { maxWait: 3000 } );

/**
 * Initializes the estimated reading time.
 *
 * @returns {void}
 */
export default function initializeEstimatedReadingTime() {
	if ( get( window, "wpseoScriptData.analysis.estimatedReadingTimeEnabled", false ) === false ) {
		return;
	}

	dispatch( "yoast-seo/editor" ).loadEstimatedReadingTime();

	if ( window.wpseoScriptData.isElementorEditor === "1" ) {
		initializeEstimatedReadingTimeElementor();
	} else if ( window.wpseoScriptData.isBlockEditor === "1" ) {
		initializeEstimatedReadingTimeBlockEditor();
	} else {
		initializeEstimatedReadingTimeClassic();
	}
}
