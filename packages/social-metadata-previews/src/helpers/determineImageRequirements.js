/** Checks the if the filesize exceeds 5MB. If not correct returns a warning.
 *
 * @param {String} imageBytes The filesize in MB.
 * @returns {String | Void} A warning string.
 */
const checkImageBytes = ( imageBytes ) => {
	if ( imageBytes > 5 ) {
		return "The file size of the uploaded image is too large for Twitter. File size must be less than 5MB.";
	}
	return;
};

/** Checks if the image type is allowed. If not correct returns a warning.
 *
 * @param {String} type The image type.
 * @returns {String | Void} A warning string.
 */
const checkImageType = ( type ) => {
	switch ( type ) {
		case "JPG":
		case "JPEG":
		case "PNG":
		case "WEBP":
			break;
		case "GIF":
			return "You have uploaded a GIF. Please note that, if it’s an animated GIF, only the first frame will be used.";
		default:
			return "The format of the uploaded image is not supported. The supported formats are: JPG, PNG, WEBP and GIF.";
	}
};

/** Checks if the height and the width of an image are correct. If not correct returns a warning.
 *
 * @param {Number} height The image height.
 * @param {Number} width The image width.
 *
 * @returns {String | Void} A warning string.
 */
const checkTwitterImageSize = ( height, width ) => {
	const warningMessage = "Your image dimensions are not suitable: " +
	"The minimum dimensions are 200x200 pixels. The maximum dimensions are 4096x4096 pixels.";

	if ( height < 200 || width < 200 ) {
		return warningMessage;
	}
	if ( height > 4096 || width > 4096 ) {
		return warningMessage;
	}
	return;
};

/** Checks if the height and the width of an image are correct. If not correct returns a warning.
 *
 * @param {Number} height The image height.
 * @param {Number} width The image width.
 *
 * @returns {String | Void} A warning string.
 */
const checkFacebookImageSize = ( height, width ) => {
	if ( height < 200 || width < 200 ) {
		return "The uploaded image is too small. The minimum dimensions for this image are 200x200 pixels.";
	}
	return;
};

/**
 * @param {Object} image The image Object.
 *
 * @returns {String[]} An Array containing warnings.
 */
export const checkTwitterRequirements = ( image ) => {
	const { bytes, height, width, type } = image;

	let warningsArray = [];

	const imageBytesResult = checkImageBytes( bytes );
	const imageTypeResult = checkImageType( type );
	const imageSizeResult = checkTwitterImageSize( height, width );

	if ( imageBytesResult ) {
		warningsArray = [ ...warningsArray, imageBytesResult ];
	}
	if ( imageTypeResult ) {
		warningsArray = [ ...warningsArray, imageTypeResult ];
	}
	if ( imageSizeResult ) {
		warningsArray = [ ...warningsArray, imageSizeResult ];
	}
	return warningsArray;
};

/**
 * @param {Object} image The image Object.
 * @returns {String[]} An Array containting warning.
 */
export const checkFacebookRequirements = ( image ) => {
	const { height, width } = image;

	let warningsArray = [];

	const imageSizeResult = checkFacebookImageSize( height, width );
	if ( imageSizeResult ) {
		warningsArray = [ ...warningsArray, imageSizeResult ];
	}

	return warningsArray;
};
