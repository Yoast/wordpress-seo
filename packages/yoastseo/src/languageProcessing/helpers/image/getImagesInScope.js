import getImagesInTree from "./getImagesInTree";

/**
 * Maps a product image from the Paper's `productImages` attribute to an `img` pseudo-node,
 * so downstream helpers that read image nodes (e.g. `getAltAttribute`) work unchanged.
 *
 * @param {{id: ?number, src: ?string, alt: ?string}} image The product image to map.
 *
 * @returns {{name: string, attributes: {src: string, alt: string}}} The mapped `img` pseudo-node.
 */
const toImageNode = ( image ) => ( { name: "img", attributes: { src: image.src || "", alt: image.alt || "" } } );

/**
 * Retrieves the images the image researches should assess. The scope travels with the Paper,
 * like `productData` does for the product assessments:
 * - a producer that provides the `productImages` attribute opts in — only those images are assessed,
 *   mapped to `img` pseudo-nodes. An empty array is a valid opt-in: a product without images.
 * - without the attribute, the images in the text's tree are assessed — the default behaviour.
 *
 * @param {Paper} paper The paper to get the images from.
 *
 * @returns {Array} Array containing the images in scope.
 */
export default function getImagesInScope( paper ) {
	if ( paper.hasProductImages() ) {
		return paper.getProductImages().map( toImageNode );
	}
	return getImagesInTree( paper );
}
