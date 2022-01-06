import { addFilter } from "@wordpress/hooks";
import { select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";

/**
 * Initializes the featured image plugin.
 *
 * @returns {void}
 */
function initFeaturedImagePlugin() {
	/**
	 * Adds the featured image to the paper.
	 *
	 * @param {Object} paper The paper.
	 *
	 * @returns {Object} The paper with the featured image added.
	 */
	function addFeaturedImageToPaperContents( paper ) {
		const { url, alt, width, height } = select( SEO_STORE_NAME ).selectFeaturedImage();

		if ( ! url ) {
			// Do not add the image to the paper's content if no featured image is set.
			return paper;
		}

		const featuredImageHtml = `<img src="${ url }" alt="${ alt }" width="${ width }" height="${ height }"/>`;

		paper.content += featuredImageHtml;

		return paper;
	}

	addFilter( "yoast.seoStore.analysis.preparePaper", "yoast/free/addFeaturedImageToPaperContents", addFeaturedImageToPaperContents );
}

export default initFeaturedImagePlugin;
