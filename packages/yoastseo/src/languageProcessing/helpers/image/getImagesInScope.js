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
 * Retrieves the images the image researches should assess, based on the researcher's `imageScope` config:
 * - unset/unknown: the images in the text's tree — the default behaviour.
 * - `"productImages"`: only the Paper's `productImages`, mapped to `img` pseudo-nodes.
 *
 * @param {Paper}       paper           The paper to get the images from.
 * @param {Researcher}  [researcher]    The researcher carrying the `imageScope` config; may be absent in direct research calls.
 *
 * @returns {Array} Array containing the images in scope.
 */
export default function getImagesInScope( paper, researcher ) {
	const scope = ( researcher && researcher.getConfig ) ? researcher.getConfig( "imageScope" ) : false;
	if ( scope === "productImages" ) {
		return ( paper.getProductImages() || [] ).map( toImageNode );
	}
	return getImagesInTree( paper );
}
