import { dispatch } from "@wordpress/data";
import { get, debounce } from "lodash";
import firstImageUrlInContent from "../helpers/firstImageUrlInContent";
import { registerElementorUIHookAfter, registerElementorUIHookBefore } from "../helpers/elementorHook";
import { markers, Paper } from "yoastseo";

const editorData = {
	content: "",
	title: "",
	excerpt: "",
	slug: "",
	imageUrl: "",
};

export const MARK_TAG = "yoastmark";

/**
 * Returns whether or not the elementor widget has marks
 *
 * @param {*} widget The widget.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
export function widgetHasMarks( widget ) {
	var content = widget.innerHTML;

	return -1 !== content.indexOf( "<" + MARK_TAG );
}

/**
 * Remove all marks from elementor.
 *
 * @returns {void}
 */
function removeMarks() {
	const currentDocument = window.elementor.documents.getCurrent();

	currentDocument.$element.find( ".elementor-widget-container" ).each( ( index, element ) => {
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

	editorDocument.$element.find( ".elementor-widget-container" ).each( ( index, element ) => {
		content.push( element.innerHTML.trim() );
	} );

	return content.join( "" );
}

/**
 * Gets the image URL. Searches for the first image in the content as fallback.
 *
 * @param {string} content The content to get an image URL as fallback.
 *
 * @returns {string} The image URL.
 */
function getImageUrl( content ) {
	const featuredImage = window.elementor.settings.page.model.get( "post_featured_image" );
	const url = get( featuredImage, "url", "" );

	if ( url === "" ) {
		return firstImageUrlInContent( content );
	}

	return url;
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

	return {
		content,
		title: window.elementor.settings.page.model.get( "post_title" ),
		excerpt: window.elementor.settings.page.model.get( "post_excerpt" ) || "",
		imageUrl: getImageUrl( content ),
	};
}

/**
 * Dispatches new data when the editor is dirty.
 *
 * @returns {void}
 */
function handleEditorChange() {
	const currentDocument = window.elementor.documents.getCurrent();

	/*
	Quit early if the change was caused by switching out of the wp-post/page document.
	This can happen when users go to Site Settings, for example.
	*/
	if ( ! [ "wp-post", "wp-page" ].includes( currentDocument.config.type ) ) {
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
		dispatch( "yoast-seo/editor" ).setEditorDataExcerpt( editorData.excerpt );
	}

	if ( data.imageUrl !== editorData.imageUrl ) {
		editorData.imageUrl = data.imageUrl;
		dispatch( "yoast-seo/editor" ).setEditorDataImageUrl( editorData.imageUrl );
	}
}

/**
 * Remove highlighting from Elementor widgets and uncheck highlight button when panel editor open.
 *
 * @returns {void}
 */
function handlePanelEditorOpen() {
	removeMarks();

	dispatch( "yoast-seo/editor" ).setActiveMarker( null );
	dispatch( "yoast-seo/editor" ).setMarkerPauseStatus( false );

	window.YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
}

const debouncedHandleEditorChange = debounce( handleEditorChange, 500 );

/**
 * Initializes the watcher by coupling the change handler to the change event.
 *
 * @returns {void}
 */
export default function initialize() {
	registerElementorUIHookBefore( "panel/editor/open", "yoast-seo-content-scraper-panel-editor-open", handlePanelEditorOpen );
	// This hook will fire when the Elementor preview becomes available.
	registerElementorUIHookAfter( "editor/documents/attach-preview", "yoast-seo-content-scraper-attach-preview", debouncedHandleEditorChange );

	// This hook will fire when the contents of the editor are modified.
	registerElementorUIHookAfter( "document/save/set-is-modified", "yoast-seo-content-scraper-on-modified", debouncedHandleEditorChange );
}
