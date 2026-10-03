/* global elementor */
/**
 * @file Elementor V4 atomic editor entry. Extracts content from the rendered preview DOM
 *       and dispatches it to the Yoast editor store.
 */

import { debounce, noop } from "lodash";
import { refreshDelay } from "../analysis/constants";
import { registerElementorUIHookAfter, registerElementorUIHookBefore } from "../elementor/helpers/hooks";
import { isFormId, isFormIdEqualToDocumentId } from "../elementor/helpers/is-form-id";
import { handleEditorChange, debouncedHandleEditorChange } from "./change-handler";
import { resetMarks, getWidgetMap } from "./marks";

// Expose V4 utilities so premium's mark applicator can locate widgets by ID
// without re-implementing the content-walker tree traversal.
window.yoastElementorV4 = { getWidgetMap };

/**
 * Initializes the content watcher.
 *
 * @returns {void}
 */
function initializeElementorV4() {
	let stopObserver = noop;

	registerElementorUIHookAfter(
		"editor/documents/attach-preview",
		"yoast-seo/v4/content-walker/start-observer",
		() => {
			stopObserver();

			// The preview DOM renders asynchronously after this hook fires, so a single read now
			// would miss the initial content. A MutationObserver re-runs the extraction once
			// Elementor has rendered the widgets (and again when the panel opens), the same way
			// the legacy watcher handles `$element` loading in later.
			const previewElement = elementor.documents.getCurrent()?.$element?.get( 0 );
			const observer = new MutationObserver( debouncedHandleEditorChange );
			if ( previewElement ) {
				observer.observe( previewElement, { attributes: true, childList: true, subtree: true, characterData: true } );
			}
			elementor.channels.editor.on( "change", debouncedHandleEditorChange );
			elementor.settings.page.model.on( "change", debouncedHandleEditorChange );

			stopObserver = () => {
				observer.disconnect();
				elementor.channels.editor.off( "change", debouncedHandleEditorChange );
				elementor.settings.page.model.off( "change", debouncedHandleEditorChange );
			};

			// Read now in case the content is already rendered; the observer covers the later render.
			debouncedHandleEditorChange();
		},
		isFormIdEqualToDocumentId
	);

	registerElementorUIHookBefore(
		"panel/editor/open",
		"yoast-seo/v4/marks/reset-on-edit",
		debounce( resetMarks, refreshDelay ),
		isFormIdEqualToDocumentId
	);

	registerElementorUIHookBefore(
		"document/save/save",
		"yoast-seo/v4/marks/reset-on-save",
		resetMarks,
		( { document } ) => isFormId( document?.id || elementor.documents.getCurrent().id )
	);

	registerElementorUIHookAfter(
		"editor/documents/close",
		"yoast-seo/v4/content-walker/stop",
		() => {
			stopObserver();
			stopObserver = noop;
			debouncedHandleEditorChange.cancel();
		},
		( { id } ) => isFormId( id )
	);

	registerElementorUIHookAfter(
		"document/save/set-is-modified",
		"yoast-seo/v4/content-walker/on-modified",
		debouncedHandleEditorChange,
		( { document } ) => isFormId( document?.id || elementor.documents.getCurrent().id )
	);

	handleEditorChange();
}

jQuery( window ).on( "elementor:init", () => {
	window.elementor.on( "panel:init", () => {
		// Defer to let Elementor finish setting up the panel before we register hooks.
		setTimeout( initializeElementorV4 );
	} );
} );
