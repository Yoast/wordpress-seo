import getImagesInTree from "./getImagesInTree";

/**
 * @typedef {import("../../../contract/providedImages").ProvidedImage} ProvidedImage
 */

/**
 * Maps an image from the Paper's `providedImages` attribute to an `img` pseudo-node,
 * so downstream helpers that read image nodes (e.g. `getAltAttribute`) work unchanged.
 *
 * Missing `src` and `alt` default to empty strings rather than throwing: the contract makes `alt`
 * required and `toPaper()` rejects a DTO without it, but a Paper constructed directly bypasses that
 * validation, and an empty `alt` degrades to the correct "no alt text" score instead of a hard failure.
 *
 * @param {ProvidedImage} image The provided image to map.
 *
 * The producer's `id` is kept on the node, outside `attributes`, so it is not mistaken for an HTML attribute.
 * It is what lets an assessment report which images it flagged (see `getImageIdentifier`); it is optional in the
 * contract, and images from the text tree never have one.
 *
 * @returns {{name: string, id: (number|undefined), attributes: {src: string, alt: string}}} The mapped `img` pseudo-node.
 */
const toImageNode = ( image ) => ( {
	name: "img",
	id: image.id,
	attributes: { src: image.src || "", alt: image.alt || "" },
} );

/**
 * Retrieves the images the image researches should assess. The scope travels with the Paper,
 * like `productData` does for the product assessments:
 * - a producer that provides the `providedImages` attribute opts in — only those images are assessed,
 *   mapped to `img` pseudo-nodes. An empty array is a valid opt-in: an item without images.
 * - without the attribute, the images in the text's tree are assessed — the default behaviour.
 *
 * @param {Paper} paper The paper to get the images from.
 *
 * @returns {Array} Array containing the images in scope.
 */
export default function getImagesInScope( paper ) {
	if ( paper.hasProvidedImages() ) {
		return paper.getProvidedImages().map( toImageNode );
	}
	return getImagesInTree( paper );
}
