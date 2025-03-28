/* global elementor, YoastSEO */
import { dispatch, select } from "@wordpress/data";
import { debounce, get, noop } from "lodash";
import { markers, Paper } from "yoastseo";
import { refreshDelay } from "../../analysis/constants";
import firstImageUrlInContent from "../../helpers/firstImageUrlInContent";
import { registerElementorUIHookAfter, registerElementorUIHookBefore } from "../helpers/hooks";
import { isFormId, isFormIdEqualToDocumentId } from "../helpers/is-form-id";
import { excerptFromContent } from "../../helpers/replacementVariableHelpers";
import getContentLocale from "../../analysis/getContentLocale";

const editorData = {
	content: "",
	title: "",
	excerpt: "",
	slug: "",
	imageUrl: "",
	featuredImage: "",
	contentImage: "",
	excerptOnly: "",
};

const MARK_TAG = "yoastmark";

/**
 * Checks whether the given Elementor widget has Yoast marks.
 *
 * @param {Object} widget The widget.
 * @returns {boolean} Whether there are marks in the HTML of the widget.
 */
function widgetHasMarks( widget ) {
	return widget.innerHTML.indexOf( "<" + MARK_TAG ) !== -1;
}

/**
 * Retrieves all Elementor widget containers.
 * @returns {jQuery[]} Elementor widget containers.
 */
function getWidgetContainers( currentDocument = elementor.documents.getCurrent() ) {
	// Before the optimized markup feature, we used to find the widget containers using the .elementor-widget-container class.
	let containers = currentDocument.$element?.find( ".elementor-widget-container" );

	// With the optimized markup feature turned on, the surrounding .elementor-widget-container div is no longer used.
	// Instead, we grab the direct children of the .elementor-widget div, excluding any background overlays and resizable handles.
	if ( ! containers?.length ) {
		containers = currentDocument.$element?.find( ".elementor-widget" )
			.children()
			.not( ".elementor-background-overlay, .elementor-element-overlay, .ui-resizable-handle" );
	}

	return containers;
}

/**
 * Removes all marks from Elementor widgets.
 *
 * @returns {void}
 */
function removeMarks() {
	getWidgetContainers().each( ( index, element ) => {
		if ( widgetHasMarks( element ) ) {
			element.innerHTML = markers.removeMarks( element.innerHTML );
		}
	} );
}

/**
 * Gets the post content.
 *
 * @param {Document} editorDocument The current document.
 *
 * @returns {string} The post's content.
 */
function getContent( editorDocument ) {
	const content = [];

	getWidgetContainers( editorDocument )?.each( ( index, element ) => {
		// We remove \n and \t from the HTML as Elementor formats the HTML after saving.
		// As this spacing is purely cosmetic, we can remove it for analysis purposes.
		// When we apply the marks, we do need to make the same amendments.
		const rawHtml = element.innerHTML.replace( /[\n\t]/g, "" ).trim();
		content.push( rawHtml );
	} );

	return content.join( "" );
}

/**
 * Gets the excerpt with fallback.
 *
 * @param {string} content The content.
 * @param {boolean} onlyExcerpt Whether to only return the excerpt.
 *
 * @returns {string} The excerpt.
 */
function getExcerpt( content, onlyExcerpt = false ) {
	let excerpt = elementor.settings.page.model.get( "post_excerpt" );

	if ( onlyExcerpt ) {
		return excerpt || "";
	}

	// Fallback to the first piece of the content.
	if ( ! excerpt ) {
		const limit = ( getContentLocale() === "ja" ) ? 80 : 156;
		excerpt = excerptFromContent( content, limit );
	}

	return excerpt;
}

/**
 * Gets the data that is specific to this editor.
 *
 * @param {Document} editorDocument The current document.
 *
 * @returns {Object} The editorData object.
 */
function getEditorData( editorDocument ) {
	const content = getContent( editorDocument );
	const featuredImageUrl = get( elementor.settings.page.model.get( "post_featured_image" ), "url", "" );
	const contentImageUrl = firstImageUrlInContent( content );

	return {
		content,
		title: elementor.settings.page.model.get( "post_title" ),
		excerpt: getExcerpt( content ),
		excerptOnly: getExcerpt( content, true ),
		imageUrl: featuredImageUrl || contentImageUrl,
		featuredImage: featuredImageUrl,
		contentImage: contentImageUrl,
		status: elementor.settings.page.model.get( "post_status" ),
	};
}

/* eslint-disable complexity */
/**
 * Dispatches new data when the editor is dirty.
 *
 * @returns {void}
 */
function handleEditorChange() {
	const currentDocument = elementor.documents.getCurrent();

	// Don't update the editor data when the form ID is not equal to the document ID.
	if ( ! isFormIdEqualToDocumentId() ) {
		return;
	}

	// Quit early if the change was caused by switching out of the wp-post/page document.
	// This can happen when users go to Site Settings, for example.
	if ( ! [ "wp-post", "wp-page" ].includes( currentDocument.config.type ) ) {
		return;
	}

	// Quit early if the highlighting functionality is on.
	if ( select( "yoast-seo/editor" ).getActiveMarker() ) {
		return;
	}

	const data = getEditorData( currentDocument );

	if ( data.content !== editorData.content ) {
		editorData.content = data.content;
		dispatch( "yoast-seo/editor" ).setEditorDataContent( editorData.content );
	}

	if ( data.title !== editorData.title ) {
		editorData.title = data.title;
		dispatch( "yoast-seo/editor" ).setEditorDataTitle( editorData.title );
	}

	if ( data.excerpt !== editorData.excerpt ) {
		editorData.excerpt = data.excerpt;
		editorData.excerptOnly = data.excerptOnly;
		dispatch( "yoast-seo/editor" ).setEditorDataExcerpt( editorData.excerpt );
		dispatch( "yoast-seo/editor" ).updateReplacementVariable( "excerpt", editorData.excerpt );
		dispatch( "yoast-seo/editor" ).updateReplacementVariable( "excerpt_only", editorData.excerptOnly );
	}

	if ( data.imageUrl !== editorData.imageUrl ) {
		editorData.imageUrl = data.imageUrl;
		dispatch( "yoast-seo/editor" ).setEditorDataImageUrl( editorData.imageUrl );
	}

	if ( data.contentImage !== editorData.contentImage ) {
		editorData.contentImage = data.contentImage;
		dispatch( "yoast-seo/editor" ).setContentImage( editorData.contentImage );
	}

	if ( data.featuredImage !== editorData.featuredImage ) {
		editorData.featuredImage = data.featuredImage;
		dispatch( "yoast-seo/editor" ).updateData( { snippetPreviewImageURL: editorData.featuredImage } );
	}
}

/* eslint-enable complexity */


/**
 * Removes highlighting from Elementor widgets and reset the highlighting button.
 *
 * @returns {void}
 */
function resetMarks() {
	removeMarks();

	dispatch( "yoast-seo/editor" ).setActiveMarker( null );
	dispatch( "yoast-seo/editor" ).setMarkerPauseStatus( false );

	YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
}

const debouncedHandleEditorChange = debounce( handleEditorChange, refreshDelay );

/**
 * Creates a MutationObserver to observe changes to the document.
 *
 * @param {function} callback The callback to execute when a change is detected.
 *
 * @returns {function} A function to disconnect the observer.
 */
const createMutationObserver = ( callback ) => {
	const observer = new MutationObserver( callback );

	/**
	 * Observes changes in the document.
	 *
	 * @param {Node} [target=document] A DOM Node (which may be an Element) within the DOM tree to watch for changes.
	 *
	 * @returns {function} The disconnect function.
	 */
	return ( target = document ) => {
		observer.observe( target, { attributes: true, childList: true, subtree: true, characterData: true } );

		/**
		 * Disconnects the observer.
		 * @returns {void}
		 */
		return () => observer.disconnect();
	};
};

/**
 * Initializes the watcher by coupling the change handlers to the change events.
 *
 * @returns {void}
 */
export default function initialize() {
	// This hook will fire 500ms after a widget is edited -- this allows Elementor to set the cursor at the end of the widget.
	registerElementorUIHookBefore( "panel/editor/open", "yoast-seo/marks/reset-on-edit", debounce( resetMarks, refreshDelay ), isFormIdEqualToDocumentId );
	// This hook will fire just before the document is saved.
	registerElementorUIHookBefore( "document/save/save", "yoast-seo/marks/reset-on-save", resetMarks, ( { document } ) => isFormId( document?.id || elementor.documents.getCurrent().id ) );

	const startObserver = createMutationObserver( debouncedHandleEditorChange );
	let stopObserver = noop;

	/**
	 * Stops the observer and cancels any pending changes.
	 * @returns {void}
	 */
	const stopObserverAndPendingChanges = () => {
		// Stop listening to the document.
		stopObserver();
		stopObserver = noop;
		// Stop any pending debounced editor change calls.
		debouncedHandleEditorChange.cancel();
	};

	registerElementorUIHookAfter(
		"editor/documents/close",
		"yoast-seo/content-scraper/stop",
		stopObserverAndPendingChanges,
		( { id } ) => isFormId( id )
	);
	// This hook will fire when the Elementor preview becomes available.
	registerElementorUIHookAfter( "editor/documents/attach-preview", "yoast-seo/content-scraper/start", () => {
		stopObserver = startObserver();
	}, isFormIdEqualToDocumentId );

	// This hook will fire when the contents of the editor are modified.
	registerElementorUIHookAfter( "document/save/set-is-modified", "yoast-seo/content-scraper/on-modified", debouncedHandleEditorChange, ( { document } ) => isFormId( document?.id || elementor.documents.getCurrent().id ) );

	// Set the initial editor data (note: content is not there yet due to $element loading in later).
	handleEditorChange();
}
