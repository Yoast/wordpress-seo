/**
 * The config for the API, containing the endpoint url and headers for the requests.
 *
 * @type {{url: string, headers: {X-WP-Nonce: string}}}
 */

const host = window.location.host.split( ":" )[ 0 ];

const apiConfig = {
	url: "http://" + host + ":8882/onboarding",
	headers: {
		// The nonce is for WordPress only.
		"X-WP-Nonce": "test1234",
	},
};

export default apiConfig;
