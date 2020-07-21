const fetch = require( "node-fetch" );
const fs = require( "fs" );

/**
 * Calls the GitHub API
 *
 * @param {string}  uploadUrl The path to call. The Upload URL is returned by the GitHub API when you create a release.
 *                            The URL returned has a placeholder {?name,label}, which needs to be replaced.
 * @param {string} fileName   The name of the source zip file. Default: artifact.zip.
 * @param {string} label      The name that Github will show for this file.
 *
 * @returns {Promise<Object>} Response object.
 */
async function uploadToGitHub( uploadUrl, fileName, label ) {
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
	const urlWithQueryParams = uploadUrl.replace( "{?name,label}", `?name=${ label }` );
	return await fetch( urlWithQueryParams, config );
}

module.exports = uploadToGitHub;
