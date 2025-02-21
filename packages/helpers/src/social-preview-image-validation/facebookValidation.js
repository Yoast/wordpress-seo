// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;

/**
 * Checks if the image dimensions are allowed. If not correct returns a warning.
 *
 * @param {Object} image The image type.
 *
 * @returns {string | boolean} A warning string | true.
 */
export const validateSize = ( image ) => {
	const { width, height } = image;

	const warningMessage = sprintf(
		/* Translators: %1$d expands to the minimum width, %2$d expands to the minimum height */
		__(
			"Your image dimensions are not suitable. The minimum dimensions are %1$dx%2$d pixels.",
			"wordpress-seo"
		),
		MIN_WIDTH, MIN_HEIGHT
	);

	return ( width < MIN_WIDTH || height < MIN_HEIGHT ) ? warningMessage : true;
};

/**
 * Checks if the image type is allowed. If not correct returns a warning.
 *
 * @param {string} image The image type.
 *
 * @returns {string | boolean} A warning string | true.
 */
export const validateType = ( image ) => {
	const { type } = image;
	const validTypes = [ "jpg", "png", "gif", "jpeg", "webp" ];

	const warningMessage = sprintf(
		/* Translators: %1$s expands to the jpg format, %2$s expands to the png format,
		%3$s expands to the webp format, %4$s expands to the gif format. */
		__(
			"The format of the uploaded image is not supported. The supported formats are: %1$s, %2$s, %3$s and %4$s.",
			"wordpress-seo"
		),
		"JPG", "PNG", "WEBP", "GIF"
	);

	if ( ! validTypes.includes( type ) ) {
		return warningMessage;
	}
	return true;
};


const validate = validationFactory( [
	validateSize,
	validateType,
] );

export default validate;

