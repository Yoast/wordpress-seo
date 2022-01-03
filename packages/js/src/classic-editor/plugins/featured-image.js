import { addFilter } from "@wordpress/hooks";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import { dispatch } from "@wordpress/data";

/**
 * Creates image HTML from the given WordPress media frame.
 *
 * @param {Object} mediaFrame The WordPress media frame.
 *
 * @returns {string} The image HTML.
 */
function getSelectedImage( mediaFrame ) {
	if ( ! ( mediaFrame && mediaFrame.state() ) ) {
		return "";
	}
	const selectedImage = mediaFrame.state().get( "selection" ).first();

	const src = selectedImage.get( "url" );
	const alt = selectedImage.get( "alt" );
	const width = selectedImage.get( "width" );
	const height = selectedImage.get( "height" );

	return `<img src="${ src }" alt="${ alt }" width="${ width }" height="${ height }"/>`;
}

/**
 * Gets the featured image that is currently set within the editor.
 *
 * @returns {string} The featured image that is currently set, as an HTML string.
 */
function getCurrentFeaturedImage() {
	const featuredImageElement = document.querySelector( "#set-post-thumbnail > img" );

	const src = featuredImageElement.getAttribute( "src" );
	const alt = featuredImageElement.getAttribute( "alt" );
	const width = featuredImageElement.getAttribute( "width" );
	const height = featuredImageElement.getAttribute( "height" );

	return `<img src="${ src }" alt="${ alt }" width="${ width }" height="${ height }"/>`;
}

/**
 * Initializes the featured image plugin.
 *
 * @returns {void}
 */
function initFeaturedImagePlugin() {
	let featuredImageHtml = "";

	const { analyze } = dispatch( SEO_STORE_NAME );

	const frame = window.wp.media.featuredImage.frame();

	// Set the featured image currently selected in the editor.
	featuredImageHtml = getCurrentFeaturedImage();

	// Change the featured image when one is selected in the editor.
	frame.on( "select", () => {
		featuredImageHtml = getSelectedImage( frame );
		// Trigger a new analysis.
		analyze();
	} );

	// Remove the featured image when it is removed in the editor.
	const removeFeaturedImageLink = document.getElementById( "remove-post-thumbnail" );
	if ( removeFeaturedImageLink ) {
		removeFeaturedImageLink.addEventListener( "click", () => {
			featuredImageHtml = "";
			// Trigger a new analysis.
			analyze();
		} );
	}

	/**
	 * Adds the featured image to the paper.
	 *
	 * @param {Object} paper The paper.
	 *
	 * @returns {Object} The paper with the featured image added.
	 */
	function addFeaturedImageToPaperContents( paper ) {
		paper.content += featuredImageHtml;
		return paper;
	}

	addFilter( "yoast.seoStore.analysis.preparePaper", "yoast/free/addFeaturedImageToPaperContents", addFeaturedImageToPaperContents );
}

export default initFeaturedImagePlugin;
