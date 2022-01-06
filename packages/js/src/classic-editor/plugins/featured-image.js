import { addFilter, removeFilter } from "@wordpress/hooks";
import { select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";

/**
 * Initializes the featured image plugin.
 *
 * @returns {void}
 */
function registersFeaturedImagePlugin() {
	const hookName = "yoast.seoStore.analysis.preparePaper";
	const namespace = "yoast/free/measureSeoTitleWidth";

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

		return {
			...paper,
			content: paper.content + featuredImageHtml,
		};
	}

	addFilter( hookName, namespace, addFeaturedImageToPaperContents, 10 );

	return () => removeFilter( hookName, namespace );
}

export default registersFeaturedImagePlugin;
