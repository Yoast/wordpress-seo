// External
import { __, sprintf } from "@wordpress/i18n";

// Internal
import validationFactory from "./validationFactory";


/** Checks if the image dimensions are allowed. If not correct returns a warning.
 *
 * @param {Object} image The image type.
 * @returns {String | Boolean} A warning string | true.
 */
const validateSize = ( image ) => {
	const { width, height } = image;

	const warningMessage = sprintf(
		/* Translators: %d expands to the minimum width, %d expands to the minimum hight */
		__(
			"Your image dimensions are not suitable: The minimum dimensions are %dx%d pixels.",
			"yoast-components"
		),
		200, 200,
	);

	if ( width < 200 || height < 200 ) {
		return warningMessage;
	}
	return true;
};

/** Checks if the image type is allowed. If not correct returns a warning.
 *
 * @param {String} image The image type.
 * @returns {String | Boolean} A warning string | true.
 */
export const validateImageType = ( image ) => {
	const { type } = image;
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
	validateImageType,
] );

export default validate;

