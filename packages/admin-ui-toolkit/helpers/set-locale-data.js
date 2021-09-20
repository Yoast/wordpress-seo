import { setLocaleData } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * Sets the l10n for the given textdomain in Jed.
 *
 * @param {string} global The global variable to read.
 * @param {string} domain The translations domain.
 *
 * @returns {void}
 */
export default function( global, domain ) {
	const translations = get( window, [ global, "locale_data", domain ], false );

	if ( translations === false ) {
		// Jed needs to have meta information in the object keyed by an empty string.
		setLocaleData( { "": {} }, domain );
	} else {
		setLocaleData( translations, domain );
	}
}
