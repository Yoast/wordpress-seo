// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";


/**
 * @param {Object} image A.
 * @returns {String | Boolean} Image.
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

	if ( image.width < 200 || image.height < 200 ) {
		return warningMessage;
	}
	if ( width > 4096 || height > 4096 ) {
		return warningMessage;
	}
	return true;
};

/** Checks if the image type is allowed. If not correct returns a warning.
 *
 * @param {String} type The image type.
 * @returns {String | Boolean} A warning string.
 */
export const validateImageType = ( { type } ) => {
	const validTypes = [ "jpg", "png", "gif" ];

	const warningMessage = sprintf(
		/* Translators: %s expands to the jpg format, %s expands to the png format, %s expands to the gif format. */
		__(
			"The format of the uploaded image is not supported. The supported formats are: %s, %s and %s.",
			"yoast-components"
		),
		"JPG", "PNG", "GIF"
	);

	if ( ! validTypes.includes( type ) ) {
		return warningMessage;
	}
	return true;
};


const validate = validationFactory( [
	validateSize,
] );

export default validate;

