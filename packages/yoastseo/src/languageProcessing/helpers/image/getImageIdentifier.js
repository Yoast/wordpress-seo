import { isUndefined } from "lodash";

/**
 * Returns the identifier of an image, as the producer identified it.
 *
 * The identifier is opaque to the analysis: it is never parsed, interpreted or constructed here, it is only
 * passed back out so a consumer can match a flagged image to its own data. A producer that supplies
 * `providedImages` sends an `id` of its own (WooCommerce sends the attachment ID, another platform sends
 * whatever it uses); `id` is optional in that contract, and images taken from the text tree have none, so the
 * `src` is the fallback. Keeping this in one helper is what makes the identifiers comparable: every alt text
 * assessment flags the same image under the same value, so a consumer can merge the results of several
 * assessments without the same image appearing twice.
 *
 * @param {Object} imageNode The image node, either an `img` node from the tree or a pseudo-node built from a provided image.
 *
 * @returns {string|number} The identifier, or an empty string when the image carries neither an id nor a src.
 */
export default function getImageIdentifier( imageNode ) {
	if ( ! isUndefined( imageNode.id ) && imageNode.id !== null ) {
		return imageNode.id;
	}

	return imageNode.attributes?.src || "";
}
