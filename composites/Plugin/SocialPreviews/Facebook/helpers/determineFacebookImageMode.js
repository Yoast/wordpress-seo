/**
 * Determines the image display mode of the Facebook Image.
 *
 * @param {Object} dimensions The image's dimensions.
 *
 * @returns {string} The display mode of the image.
 */
export default function determineFacebookImageMode( dimensions ) {
	if ( dimensions.height > dimensions.width ) {
		return "portrait";
	}

	if ( dimensions.height === dimensions.width ) {
		return "square";
	}

	return "landscape";
}
