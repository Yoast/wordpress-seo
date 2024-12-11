import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

/**
 * Control for handling SEMrush related keyphrases request.
 *
 * @param {Object} action The action object.
 *
 * @returns {Promise} The API fetch promise.
 */
export const NEW_REQUEST = async( action ) => {
	const { countryCode, keyphrase } = action;

	await apiFetch( {
		path: "yoast/v1/semrush/country_code",
		method: "POST",
		// eslint-disable-next-line camelcase
		data: { country_code: countryCode },
	} );

	const response = await apiFetch( {
		path: addQueryArgs(
			"/yoast/v1/semrush/related_keyphrases",
			{
				keyphrase,
				// eslint-disable-next-line camelcase
				country_code: countryCode,
			}
		),
	} );

	return response;
};
