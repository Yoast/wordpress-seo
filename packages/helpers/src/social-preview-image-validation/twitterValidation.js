// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";


/**
 * Validates the image dimensions. Returns a warning if not valid.
 *
 * @param {Object} image The image object.
 *  @param {boolean} isLarge Is the card large yes/no?
 *
 * @returns {string | boolean} A warning string | true.
 */
export const validateSize = ( image, isLarge ) => {
	const { width, height } = image;

	const warningString = "Your image dimensions are not suitable. The minimum dimensions are %dx%d pixels. The maximum dimensions are %dx%d pixels.";

	const warningMessageSmall = sprintf(
		/* Translators: %d expands to the minimum width, %d expands to the minimum hight,
		%d expands to the maximum width, %d expands to the maximum hight. */
		__( warningString, "yoast-components" ),
		200, 200, 4096, 4096,
	);

	const warningMessageLarge = sprintf(
		/* Translators: %d expands to the minimum width, %d expands to the minimum hight,
		%d expands to the maximum width, %d expands to the maximum hight. */
		__( warningString, "yoast-components" ),
		300, 157, 4096, 4096,
	);

	const isMaximumDimensions = width > 4096 || height > 4096;

	if ( isLarge && ( width < 300 || height < 157 || isMaximumDimensions ) ) {
		return warningMessageLarge;
	}
	if ( width < 200 || height < 200 || isMaximumDimensions ) {
		return warningMessageSmall;
	}
	return true;
};

/**
 * Validates image type. Returns a warning if not valid.
 * The Gif type is an exception it is a valid type but results a warning.
 *
 * @param {Object} image The image object.
 *
 * @returns {string | boolean} A warning string | true.
 */
export const validateType = ( image ) => {
	const { type } = image;
	const validTypes = [ "jpg", "png", "webp" ];

	const gifMessage = sprintf(
		/* Translators: %s expands to the gif format, %s expands to the gif format. */
		__(
			"You have uploaded a %s. Please note that, if it’s an animated %s, only the first frame will be used.",
			"yoast-components"
		),
		"GIF", "GIF",
	);

	const warningMessage = sprintf(
		/* Translators: %s expands to the jpg format, %s expands to the png format, %s expands to the gif format. */
		__(
			"The format of the uploaded image is not supported. The supported formats are: %s, %s, %s and %s.",
			"yoast-components"
		),
		"JPG", "PNG", "WEBP", "GIF",
	);

	if ( validTypes.includes( type ) ) {
		return true;
	}
	if ( type === "gif" ) {
		return gifMessage;
	}
	return warningMessage;
};


/**
 * Validates if the filesize exceeds 5MB. Returns a warning if not valid.
 *
 * @param {string} image The image object.
 *
 * @returns {string | boolean} A warning string | true.
 */
export const validatesBytes = ( image ) => {
	const { bytes } = image;

	const warningMessage = sprintf(
		/* Translators: %s expands to Twitter, %s expands to the 5MB size. */
		__(
			"The file size of the uploaded image is too large for %s. File size must be less than %s.",
			"yoast-components"
		),
		"Twitter", "5MB",
	);

	if ( bytes >= 5 ) {
		return warningMessage;
	}
	return true;
};

const validate = validationFactory( [
	validateSize,
	validateType,
	validatesBytes,
] );

export default validate;
