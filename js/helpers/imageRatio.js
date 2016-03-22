
function imageRatio( image, maxWidth, maxHeight ) {
	var width = image.width;
	var height = image.height;

	if ( maxWidth !== undefined && width > maxWidth ) {
		image.width = maxWidth;
		image.height = height * ( maxWidth / width );
	}

	if ( maxHeight !== undefined && height > maxHeight ) {
		image.height = maxHeight;
		image.width = width * ( maxHeight / height );
	}
}

module.exports = imageRatio;
