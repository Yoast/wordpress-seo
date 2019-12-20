const fetch = require( "node-fetch" );
const getUserInput = require( "./tools/get-user-input" );

/**
 * Throws an error.
 *
 * @param {Object} response The response object.
 * @param {Object} grunt    The grunt object.
 *
 * @returns {void}
 */
async function logError( response, grunt ) {
	const responseObject = await response.json();

	grunt.log.error( `Status: ${ response.status }` );
	grunt.log.error( `Message: ${ responseObject.message }` );

	if ( responseObject.errors ) {
		responseObject.errors.forEach( error => {
			grunt.log.error( JSON.stringify( error ) );
		} );
	}

	grunt.fail.fatal( "Failed to create a pre release on github." );
}

/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"github-pre-release",
		"Creates and pushes a github pre-release and uploads the artifact to GitHub",
		async function() {
			const done = this.async();

			// Open a text editor to get the changelog.
			const changelog = await getUserInput( { initialContent: grunt.option( "changelog" ) } );
			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;

			// Creating the release on github through an API request.
			const github = {};
			github.apiRoot = "https://api.github.com";
			github.accesToken = process.env.GITHUB_ACCESS_TOKEN;

			// Note: do not uncomment the /Yoast/wordpress-seo URL unless you want to create a real tag. Use a personal fork for testing, instead:
			github.api_url = github.apiRoot + "/repos/Xyfi/wordpress-seo/releases?access_token=" + github.accesToken;

			// github.api_url = github.apiRoot + "/repos/Yoast/wordpress-seo/releases?access_token=" + github.accesToken;

			/* eslint-disable camelcase */
			const releaseData = {
				tag_name: "v" + pluginVersion,
				target_commitish: "master",
				name: "v" + pluginVersion,
				body: changelog,
				draft: false,
				prerelease: true,
			};
			/* eslint-enable camelcase */

			try {
				const response = await fetch( github.api_url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify( releaseData ),
				} );

				if ( ! response.ok ) {
					await logError( response, grunt );
				}
			} catch ( error ) {
				grunt.fail.fatal( "An error occurred" );
			}

			// Slack notifier logic.
			const constructedZipUrl = "https://github.com/Yoast/wordpress-seo/archive/" + releaseData.tag_name + ".zip";
			grunt.config.set( "rc.github.url", constructedZipUrl );
			done();
		}
	);
};
