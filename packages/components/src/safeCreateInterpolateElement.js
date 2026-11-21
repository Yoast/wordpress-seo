import { createInterpolateElement } from "@wordpress/element";

/**
 * Wrapper function for `createInterpolateElement` to catch errors.
 *
 * @param {string} interpolatedString The interpolated string.
 * @param {Object<string, JSX.Element>} conversionMap The conversion map object.
 * @returns {JSX.Element|string} The interpolated element or string if it failed.
 */
export const safeCreateInterpolateElement = ( interpolatedString, conversionMap ) => {
	try {
		return createInterpolateElement( interpolatedString, conversionMap );
	} catch ( error ) {
		console.error( "Error in translation for:", interpolatedString, error );
		return interpolatedString;
	}
};
