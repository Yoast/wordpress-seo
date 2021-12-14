import { addFilter } from "@wordpress/hooks";

/**
 * Creates image HTML from the given WordPress media frame.
 *
 * @param {Object} mediaFrame The WordPress media frame.
 *
 * @returns {string} The image HTML.
 */
function getImageHtml( mediaFrame ) {
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
 * Initializes the featured image plugin.
 *
 * @returns {void}
 */
function initFeaturedImagePlugin() {
	let featuredImageHtml = "";

	const frame = window.wp.media.featuredImage.frame();

	// Set the featured image currently selected in the editor.
	featuredImageHtml = getImageHtml( frame );

	// Change the featured image when one is selected in the editor.
	frame.on( "select", () => {
		featuredImageHtml = getImageHtml( frame );
	} );

	// Remove the featured image when it is removed in the editor.
	const removeFeaturedImageLink = document.getElementById( "remove-post-thumbnail" );
	if ( removeFeaturedImageLink ) {
		removeFeaturedImageLink.addEventListener( "click", () => {
			featuredImageHtml = "";
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

	addFilter( "yoast.seoStore.analysis.preparePaper", "yoast-seo", addFeaturedImageToPaperContents );
}

export default initFeaturedImagePlugin;
