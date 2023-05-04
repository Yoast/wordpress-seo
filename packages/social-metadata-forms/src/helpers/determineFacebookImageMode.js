import { FACEBOOK_IMAGE_SIZES } from "../constants";

/**
 * Determines the image display mode for Facebook images, given its dimensions.
 *
 * @param {Object} originalDimensions The dimensions of the original image.
 *
 * @returns {string} The display mode of the image.
 */
function determineFacebookImageMode( originalDimensions ) {
	const { largeThreshold } = FACEBOOK_IMAGE_SIZES;

	if ( originalDimensions.height > originalDimensions.width ) {
		return "portrait";
	}

	if (  originalDimensions.width < largeThreshold.width || originalDimensions.height < largeThreshold.height ) {
		return "square";
	}

	if ( originalDimensions.height === originalDimensions.width ) {
		return "square";
	}

	return "landscape";
}

export default determineFacebookImageMode;
