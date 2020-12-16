/* global tinyMCE */
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

const debouncedGetEstimatedReadingTime = debounce( getEstimatedReadingTime, 500 );

/**
 * Initializes the estimated reading time for the classic editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeClassic() {
	const tmceEvents = [ "input", "change", "cut", "paste" ];
	const editorHandle = get( window, "wpseoScriptData.isPost", "0" ) === "1" ? "content" : "description";
	const tmceEditor = tinyMCE.get( editorHandle );

	tmceEvents.forEach( function( eventName ) {
		tmceEditor.on( eventName, () => {
			debouncedGetEstimatedReadingTime( tmceEditor.getContent() );
		} );
	} );
}

/**
 * Initializes the estimated reading time for the block editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeBlockEditor() {
	let previousContent = select( "core/editor" ).getEditedPostAttribute( "content" );

	subscribe( () => {
		const content = select( "core/editor" ).getEditedPostAttribute( "content" );

		if ( content !== previousContent ) {
			previousContent = content;
			debouncedGetEstimatedReadingTime( content );
		}
	} );
}

/**
 * Initializes the estimated reading time for the Elementor editor.
 *
 * @returns {void}
 */
function initializeEstimatedReadingTimeElementor() {
	let previousContent = select( "yoast-seo/editor" ).getEditorDataContent();

	subscribe( () => {
		const content = select( "yoast-seo/editor" ).getEditorDataContent();

		if ( content !== previousContent ) {
			previousContent = content;
			debouncedGetEstimatedReadingTime( content );
		}
	} );
}

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
