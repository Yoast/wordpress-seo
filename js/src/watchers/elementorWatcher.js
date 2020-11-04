import { dispatch } from "@wordpress/data";
import { get, debounce } from "lodash";
import { refreshDelay } from "../analysis/constants";
import firstImageUrlInContent from "../helpers/firstImageUrlInContent";
import registerElementorHook from "../helpers/elementorHook";

const editorData = {
	content: "",
	title: "",
	excerpt: "",
	slug: "",
	imageUrl: "",
};

/**
 * Gets the post content.
 *
 * @returns {string} The post's content.
 */
function getContent() {
	const content = [];

	window.elementor.documents.getCurrent().$element.find( ".elementor-widget-container" ).each( ( index, element ) => {
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
 * @returns {Object} The editorData object.
 */
function getEditorData() {
	const content = getContent();

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
	const data = getEditorData();

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

const debouncedHandleEditorChange = debounce( handleEditorChange, 500 );

/**
 * Initializes the watcher by coupling the change handler to the change event.
 *
 * @returns {void}
 */
export default function initialize() {
	// This hook will fire when the Elementor preview becomes available.
	registerElementorHook( "editor/documents/attach-preview", "yoast-seo-content-scraper-attach-preview", debouncedHandleEditorChange );

	// This hook will fire when the contents of the editor are modified.
	registerElementorHook( "document/save/set-is-modified", "yoast-seo-content-scraper-on-modified", debouncedHandleEditorChange );
}
