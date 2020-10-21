import { dispatch } from "@wordpress/data";
import firstImageUrlInContent from "../helpers/firstImageUrlInContent";

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

	window.elementor.$preview.contents().find( "[data-elementor-type]" ).find( ".elementor-widget-container" ).each( ( index, element ) => {
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
	const { url } = window.elementor.settings.page.model.get( "post_featured_image" );

	if ( ! url || url === "" ) {
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

/**
 * Initializes the watcher by coupling the change handler to the change event.
 *
 * @returns {void}
 */
export default function initialize() {
	// Initialize Elementor data one time after the preview is available.
	window.elementor.once( "preview:loaded", () => {
		window.elementorFrontend.hooks.addAction( "frontend/element_ready/global", () => {
			handleEditorChange();
		} );

		// Give Elementor elements 2 seconds to load in.
		setTimeout( () => {
			window.elementorFrontend.hooks.removeAction( "frontend/element_ready/global" );
		}, 2000 );
	} );

	// Subscribe to Elementor changes.
	window.elementor.channels.editor.on( "status:change", handleEditorChange );
}
