import Jed from "jed";
import { isEmpty } from "lodash-es";
import getTranslations from "./getTranslations";

/**
 * Returns a Jed object usable in YoastSEO.js
 *
 * @returns {Jed} A usable i18n translations object.
 */
export default function getI18n() {
	const translations = getTranslations();
	let i18n = new Jed( translations );

	if ( isEmpty( translations ) ) {
		i18n = new Jed( {
			domain: "js-text-analysis",
			/* eslint-disable-next-line camelcase */
			locale_data: {
				"js-text-analysis": {
					"": {},
				},
			},
		} );
	}

	return i18n;
}
