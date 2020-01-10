const fetch = require( "node-fetch" );

/**
 * Calls the GitHub API
 *
 * @param {string} path The path to call.
 * @param {Object} body The body data to send.
 * @param {string} [method] Optional. The request method, "POST", "GET", "PATCH".
 *
 * @returns {Promise<Object>} Response object.
 */
async function githubApi( path, body, method = "GET" ) {
	const apiRoot = "https://api.github.com";
	const accessToken = process.env.GITHUB_ACCESS_TOKEN;
	const repository = process.env.GITHUB_REPOSITORY;
	const apiUrl = `${ apiRoot }/repos/${ repository }/${ path }`;

	const config = {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `token ${ accessToken }`,
		},
	};

	if ( method !== "GET" && method !== "HEAD" ) {
		config.body = JSON.stringify( body );
	}

	return await fetch( apiUrl, config );
}

module.exports = githubApi;
