// External dependencies.
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

// Internal dependencies.
import getL10nObject from "./getL10nObject";


/**
 * Retrieves translations for YoastSEO.js for the current page, either term or post.
 *
 * @returns {Object} The translations object for the current page.
 */
export default function getTranslations() {
	const l10nObject = getL10nObject();

	// Retrieve the translations from the localization object.
	const translations = get( l10nObject, "translations", {
		domain: "js-text-analysis",
		locale_data: { // eslint-disable-line camelcase, yoast/comment-starting-capital
			"js-text-analysis": {
				"": {},
			},
		},
	} );

	// Move the `wordpress-seo` translations domain to `js-text-analysis`.
	if ( translations.domain === "wordpress-seo" && ! isUndefined( translations.locale_data[ "wordpress-seo" ] ) ) {
		translations.domain = "js-text-analysis";
		translations.locale_data[ "js-text-analysis" ] = translations.locale_data[ "wordpress-seo" ];
		translations.locale_data[ "js-text-analysis" ][ "" ].domain = "js-text-analysis";
		delete( translations.locale_data[ "wordpress-seo" ] );
	}

	return translations;
}
