// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";


/** Validates the image dimensions. Returns a warning if not valid.
 *
 * @param {Object} image The image object.
 * @returns {String | Boolean} A warning string | true.
 */
const validateSize = ( image ) => {
	const { width, height } = image;

	const warningMessage = sprintf(
		/* Translators: %d expands to the minimum width, %d expands to the minimum hight,
		%d expands to the maximum width, %d expands to the maximum hight. */
		__(
			"Your image dimensions are not suitable: The minimum dimensions are %dx%d pixels. The maximum dimensions are %dx%d pixels.",
			"yoast-components"
		),
		200, 200, 4096, 4096,
	);

	if ( width < 200 || height < 200 ) {
		return warningMessage;
	}
	if ( width > 4096 || height > 4096 ) {
		return warningMessage;
	}
	return true;
};

/** Validates image type. Returns a warning if not valid.
 *
 * @param {String} image The image object.
 * @returns {String | Boolean} A warning string | true.
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


/** Validates if the filesize exceeds 5MB. Returns a warning if not valid.
 *
 * @param {String} image The image object.
 * @returns {String | Boolean} A warning string | true.
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

	if ( bytes > 5 ) {
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

