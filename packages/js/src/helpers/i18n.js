import { setLocaleData } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { get } from "lodash";

/**
 * Sets the l10n for the given textdomain in Jed.
 *
 * All the locale data should be available in the l10nNamespace.
 *
 * @param {string} textdomain      The textdomain to set the locale data for.
 * @param {string} [l10nNamespace] The global namespace to get the localization
 *                                 data from.
 *
 * @returns {void}
 */
export function setTextdomainL10n( textdomain, l10nNamespace = "wpseoYoastJSL10n" ) {
	const translations = get( window, [ l10nNamespace, textdomain, "locale_data", textdomain ], false );

	if ( textdomain === "yoast-components" ) {
		textdomain = "wordpress-seo";
	}

	if ( translations === false ) {
		// Jed needs to have meta information in the object keyed by an empty string.
		setLocaleData( { "": {} }, textdomain );
	} else {
		setLocaleData( translations, textdomain );
	}
}

/**
 * Wrapper function for `createInterpolateElement` to catch errors.
 *
 * @param {string} interpolatedString The interpolated string.
 * @param {object} conversionMap The conversion map object.
 * @returns {string} The interpolated string.
 */
export const i18nCreateInterpolateElement = ( interpolatedString, conversionMap ) => {
	try {
		return createInterpolateElement( interpolatedString, conversionMap );
	} catch ( error ) {
		console.error( "Error in translation for:", interpolatedString, error );
		return interpolatedString;
	}
};
