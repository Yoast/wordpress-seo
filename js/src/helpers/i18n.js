import { setLocaleData, getI18n } from "@wordpress/i18n";
import get from "lodash/get";

/**
 * Configures the i18n for yoast-components.
 *
 * We call translation functions using `@wordpress/i18n` so we need to register
 * all our strings there too. This function does that.
 *
 * @returns {void}
 */
export function setYoastComponentsI18n() {
	const jed = getI18n();
	const currentTranslations = get( jed, [ "options", "locale_data", "yoast-components" ], false );

	if ( currentTranslations === false ) {
		const translations = get( window, [ "wpseoYoastComponentsL10n", "locale_data", "yoast-components" ], false );

		if ( translations === false ) {
			// Jed needs to have meta information in the object keyed by an empty string.
			setLocaleData( { "": {} }, "yoast-components" );
		} else {
			setLocaleData( translations, "yoast-components" );
		}
	}
}
