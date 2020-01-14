const fetch = require( "node-fetch" );
const fs = require( "fs" );

/**
 * Calls the GitHub API
 *
 * @param {string} path The path to call.
 * @param {Object} body The body data to send.
 * @param {string} [method] Optional. The request method, "POST", "GET", "PATCH".
 *
 * @returns {Promise<Object>} Response object.
 */
async function uploadToGitHub( uploadUrl, fileName = "artifact.zip", label = "wordpress-seo.zip" ) {
	const accessToken = process.env.GITHUB_ACCESS_TOKEN;
	const body = fs.readFileSync( fileName );

	const config = {
		method: "POST",
		headers: {
			"Content-Type": "application/zip",
			Authorization: `token ${ accessToken }`,
		},
		body: body,
	};

	return await fetch( uploadUrl.replace( "{?name, label}", `?name=${ label }` ), config );
}

module.exports = uploadToGitHub;
