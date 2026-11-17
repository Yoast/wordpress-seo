import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import getImagesInScope from "../helpers/image/getImagesInScope";

/**
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Finds the images in scope that share their alt text with at least one other image.
 *
 * Alt texts are compared trimmed and lowercased. Images without alt text are skipped: several decorative images
 * with an empty alt text are correct. Two entries with the same identifier (see `getImageIdentifier`: the producer's
 * `id`, else the `src`) are the same image and count once. An image with neither counts as a different image. For
 * example, three different images with the same alt text count as 3. The same image in two sizes has two `src`
 * values, so on the text path it counts as two images.
 *
 * `flagged` lists the identifier of every counted image, each once, so a consumer can point at those images. An image
 * without an identifier cannot be pointed at and is left out, so `flagged` can be shorter than `count`.
 *
 * @param {Paper} paper The paper to get the images from.
 *
 * @returns {{count: number, flagged: Array<string|number>}} The number of flagged images and their identifiers.
 */
export default function( paper ) {
	// Per alt text, the keys of the different images that use it.
	const imageKeysByAltText = new Map();

	getImagesInScope( paper ).forEach( ( imageNode, index ) => {
		const altText = getAltAttribute( imageNode ).trim().toLowerCase();
		if ( altText === "" ) {
			return;
		}

		const identifier = getImageIdentifier( imageNode );
		// Without an identifier nothing proves this is the same image as another one, so it gets a key of its own.
		const key = identifier === "" ? { index } : identifier;

		if ( ! imageKeysByAltText.has( altText ) ) {
			imageKeysByAltText.set( altText, new Set() );
		}
		imageKeysByAltText.get( altText ).add( key );
	} );

	// One image can share two different alt texts with other images; it still counts once.
	const flaggedKeys = new Set();
	imageKeysByAltText.forEach( ( imageKeys ) => {
		if ( imageKeys.size > 1 ) {
			imageKeys.forEach( ( key ) => flaggedKeys.add( key ) );
		}
	} );

	return {
		count: flaggedKeys.size,
		flagged: [ ...flaggedKeys ].filter( ( key ) => typeof key !== "object" ),
	};
}
