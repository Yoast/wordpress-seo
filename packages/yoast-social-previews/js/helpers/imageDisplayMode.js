/**
 * Retrieves the image display mode
 *
 * @param {Object} image The image object.
 * @returns {string} The display mode of the image.
 */
function imageDisplayMode( image ) {
	if ( image.height > image.width ) {
		return "portrait";
	}

	return "landscape";
}

module.exports = imageDisplayMode;
