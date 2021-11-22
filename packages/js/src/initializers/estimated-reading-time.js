import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, get } from "lodash";
import { Paper } from "yoastseo";

/**
 * Retrieves the estimated reading time.
 *
 * @param {string} content The content.
 * @param {string} locale The content locale.
 *
 * @returns {void}
 */
function getEstimatedReadingTime( content, locale ) {
	window.YoastSEO.analysis.worker.runResearch( "readingTime", new Paper( content, { locale: locale } ) )
		.then( ( response ) => {
			dispatch( "yoast-seo/editor" ).setEstimatedReadingTime( response.result );
		} );
}

// Delays execution by 1.5 seconds for any change, forces execution after 3 seconds.
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
let previousContent = "";
let previousRecord = null;
let previousLocale = "";

/**
 * Gets the estimated reading time in the block editor if the content has changed.
 *
 * @returns {void}
 */
function getEstimatedReadingTimeBlockEditor() {
	const postId   = select( "core/editor" ).getCurrentPostId();
	const postType = select( "core/editor" ).getCurrentPostType();
	const record   = select( "core" ).getEditedEntityRecord( "postType", postType, postId );

	// If the post object itself hasn't changed don't convert blocks to HTML.
	if ( previousRecord === record ) {
		return;
	}
	previousRecord = record;

	const content = select( "core/editor" ).getEditedPostAttribute( "content" );
	const locale = select( "yoast-seo/editor" ).getContentLocale();

	if ( previousContent !== content || previousLocale !== locale ) {
		previousContent = content;
		previousLocale = locale;
		getEstimatedReadingTime( content, locale );
	}
}

/**
 * Gets the estimated reading time in the Elementor editor if the content has changed.
 *
 * @returns {void}
 */
function getEstimatedReadingTimeElementor() {
	const content = select( "yoast-seo/editor" ).getEditorDataContent();
	const locale = select( "yoast-seo/editor" ).getContentLocale();

	if ( previousContent !== content || previousLocale !== locale ) {
		previousContent = content;
		previousLocale = locale;
		getEstimatedReadingTime( content, locale );
	}
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

	// For the Elementor and Block editor, debounce the subscribe function, since this fires almost continuously.
	// If not debounced, the editor would become very slow.
	if ( window.wpseoScriptData.isElementorEditor === "1" ) {
		// Delays execution by 1.5 seconds for any change, forces execution after 3 seconds.
		subscribe( debounce( getEstimatedReadingTimeElementor, 1500, { maxWait: 3000 } ) );
	} else if ( window.wpseoScriptData.isBlockEditor === "1" ) {
		subscribe( debounce( getEstimatedReadingTimeBlockEditor, 1500, { maxWait: 3000 } ) );
	} else {
		initializeEstimatedReadingTimeClassic();
	}
}
