// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";

const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

const MIN_WIDTH_SMALL = 200;
const MIN_HEIGHT_SMALL = 200;

const MIN_WIDTH_LARGE = 300;
const MIN_HEIGHT_LARGE = 157;

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
	/* Translators: %1$d expands to the minimum width, %2$d expands to the minimum height,
	%3$d expands to the maximum width, %4$d expands to the maximum height. */
	const warningString = __(
		"Your image dimensions are not suitable. The minimum dimensions are %1$dx%2$d pixels. The maximum dimensions are %3$dx%4$d pixels.",
		"wordpress-seo"
	);

	const isMaximumDimensions = width > MAX_WIDTH || height > MAX_HEIGHT;

	if ( isLarge && ( width < MIN_WIDTH_LARGE || height < MIN_HEIGHT_LARGE || isMaximumDimensions ) ) {
		return sprintf( warningString, MIN_WIDTH_LARGE, MIN_HEIGHT_LARGE, MAX_WIDTH, MAX_HEIGHT );
	}
	if ( width < MIN_WIDTH_SMALL || height < MIN_HEIGHT_SMALL || isMaximumDimensions ) {
		return sprintf( warningString, MIN_WIDTH_SMALL, MIN_HEIGHT_SMALL, MAX_WIDTH, MAX_HEIGHT );
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
	const validTypes = [ "jpg", "jpeg", "png", "webp" ];

	const gifMessage = sprintf(
		/* Translators: %1$s expands to the gif format, %2$s expands to the gif format. */
		__(
			"You have uploaded a %1$s. Please note that, if it’s an animated %2$s, only the first frame will be used.",
			"wordpress-seo"
		),
		"GIF", "GIF"
	);

	const warningMessage = sprintf(
		/* Translators: %1$s expands to the jpg format, %2$s expands to the png format,
		%3$s expands to the webp format, %4$s expands to the gif format. */
		__(
			"The format of the uploaded image is not supported. The supported formats are: %1$s, %2$s, %3$s and %4$s.",
			"wordpress-seo"
		),
		"JPG", "PNG", "WEBP", "GIF"
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
		/* translators: %1$s expands to X, %2$s expands to the 5MB size. */
		__(
			"The file size of the uploaded image is too large for %1$s. File size must be less than %2$s.",
			"wordpress-seo"
		),
		"X", "5MB"
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
