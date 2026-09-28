import getAltAttribute from "../helpers/image/getAltAttribute";
import getImagesInScope from "../helpers/image/getImagesInScope";

/**
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Matches the class WordPress adds to an image inserted from the media library, e.g. `wp-image-123`.
 * Every size of one attachment gets the same class, while its `src` differs per size.
 *
 * @type {RegExp}
 */
const WP_IMAGE_CLASS_REGEX = /^wp-image-(\d+)$/;

/**
 * Returns a key that is the same for two entries of the same image, so one image used twice is counted once.
 *
 * In order of preference: the attachment id of a provided image, the attachment id in a `wp-image-<id>` class,
 * the `src`. An image without any of these gets a key of its own, because nothing proves it is the same image
 * as another one.
 *
 * @param {Object} imageNode The image node, from the tree or mapped from the provided images.
 * @param {number} index     The position of the image in the list, used for an image without any identifier.
 *
 * @returns {string} The key.
 */
const getImageKey = ( imageNode, index ) => {
	if ( imageNode.attachmentId ) {
		return `attachment:${ imageNode.attachmentId }`;
	}

	// In the tree, the class attribute is a Set of class names.
	const classNames = imageNode.attributes.class ? [ ...imageNode.attributes.class ] : [];
	for ( const className of classNames ) {
		const match = className.match( WP_IMAGE_CLASS_REGEX );
		if ( match ) {
			return `attachment:${ match[ 1 ] }`;
		}
	}

	if ( imageNode.attributes.src ) {
		return `src:${ imageNode.attributes.src }`;
	}

	return `index:${ index }`;
};

/**
 * Counts the images in scope that share their alt text with at least one other image.
 *
 * Alt texts are compared trimmed and lowercased. Images without alt text are skipped: several decorative images
 * with an empty alt text are correct. The same image used more than once counts as one image. For example, three
 * different images with the same alt text count as 3.
 *
 * @param {Paper} paper The paper to get the images from.
 *
 * @returns {number} The number of images that share their alt text with another image.
 */
export default function( paper ) {
	const imageKeysByAltText = new Map();

	getImagesInScope( paper ).forEach( ( imageNode, index ) => {
		const altText = getAltAttribute( imageNode ).trim().toLowerCase();
		if ( altText === "" ) {
			return;
		}

		if ( ! imageKeysByAltText.has( altText ) ) {
			imageKeysByAltText.set( altText, new Set() );
		}
		imageKeysByAltText.get( altText ).add( getImageKey( imageNode, index ) );
	} );

	let count = 0;
	imageKeysByAltText.forEach( ( imageKeys ) => {
		if ( imageKeys.size > 1 ) {
			count += imageKeys.size;
		}
	} );

	return count;
}
