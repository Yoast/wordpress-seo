/**
 * Sets the images ratio.
 *
 * @param {Object} image The image object.
 * @param {int|undefined} maxWidth The max width in pixels.
 * @param {int|undefined} maxHeight The max height in pixels.
 */
function imageRatio( image, maxWidth, maxHeight ) {
	var width = image.width;
	var height = image.height;

	if ( typeof maxWidth !== "undefined" && width > maxWidth ) {
		image.width = maxWidth;
		image.height = height * ( maxWidth / width );
	}

	if ( typeof maxHeight !== "undefined" && height > maxHeight ) {
		image.height = maxHeight;
		image.width = width * ( maxHeight / height );
	}
}

module.exports = imageRatio;
