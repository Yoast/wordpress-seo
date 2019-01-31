/**
 * Determines the image display mode of the Facebook Image.
 *
 * @param {string} width The image width.
 * @param {string} height The image height.
 *
 * @returns {string} The display mode of the image.
 */
export default function determineFacebookImageMode( width, height ) {
	if ( height > width ) {
		return "portrait";
	}

	if ( height === width ) {
		return "square";
	}

	return "landscape";
}
