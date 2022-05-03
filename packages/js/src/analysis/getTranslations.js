// External dependencies.
import { get } from "lodash-es";

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
	return get( l10nObject, "translations", {
		domain: "wordpress-seo",
		/* eslint-disable-next-line camelcase */
		locale_data: {
			"wordpress-seo": {
				"": {},
			},
		},
	} );
}
