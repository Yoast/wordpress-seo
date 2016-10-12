/**
 * The config for the API, containing the endpoint url and headers for the requests.
 *
 * @type {{url: string, headers: {X-WP-Nonce: string}}}
 */
let apiConfig = {
	url: "http://127.0.0.1:8882/onboarding",
	headers: {
		// The nonce is for WordPress only.
		"X-WP-Nonce": "test1234",
	},
};

export default apiConfig;
