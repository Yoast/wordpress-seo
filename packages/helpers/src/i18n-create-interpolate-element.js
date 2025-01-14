import { createInterpolateElement } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";

/**
 * Create an interpolated element from a translated string and catches errors.
 *
 * @param {string} translatedString The translated string to be interpolated.
 * @param {[string]} args The arguments to be interpolated into the translated string.
 * @param {object} conversionMap The conversion map for the interpolated values.
 *
 * @returns {object} The interpolated element.
 */
export const i18nCreateInterpolateElement = ( translatedString, args, conversionMap ) => {
	try {
		return createInterpolateElement(
			sprintf(
				translatedString,
				...args
			), conversionMap );
	} catch ( error ) {
		console.error( "Error in translation for:", translatedString );
		return translatedString;
	}
};
