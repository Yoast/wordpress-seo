import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

/**
 * Control for handling SEMrush related keyphrases request and save of the country code to the database.
 *
 * @param {string} countryCode The country code to use.
 * @param {string} keyphrase The keyphrase to use.
 *
 * @returns {Promise} The API fetch promise, when resolved,
 * contains a list of related keyphrses with their search volumne, trends in recent year, search intent, and difficulty index.
 */
export const NEW_REQUEST = async( { countryCode, keyphrase } ) => {
	// Saves the country code in the database.
	apiFetch( {
		path: "yoast/v1/semrush/country_code",
		method: "POST",
		// eslint-disable-next-line camelcase
		data: { country_code: countryCode },
	} );

	return apiFetch( {
		path: addQueryArgs(
			"/yoast/v1/semrush/related_keyphrases",
			{
				keyphrase,
				// eslint-disable-next-line camelcase
				country_code: countryCode,
			}
		),
	} );
};
