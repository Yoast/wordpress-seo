const getUserInput = require( "../lib/get-user-input" );
const githubApi = require( "../lib/github-api" );
const uploadToGitHub = require( "../lib/upload-to-github" );

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
	grunt.log.error( `URL: ${ response.url }` );

	if ( responseObject.errors ) {
		responseObject.errors.forEach( error => {
			grunt.log.error( JSON.stringify( error ) );
		} );
	}

	grunt.fail.fatal( "Failed to create a pre-release on GitHub." );
}

/**
 * Creates and pushes a GitHub pre-release and uploads the artifact to GitHub, using the GitHub API.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"github-pre-release",
		"Creates and pushes a GitHub pre-release and uploads the artifact to GitHub",
		async function() {
			const done = this.async();

			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;

			let initialContent = `Changes compared to ${grunt.config.get( "previousPluginVersion" )}:\n`;
			// For the first RC use the full changelog, for follow-up RCs only use the changes.
			if ( pluginVersion.substr( pluginVersion.length - 3 ) === "RC1" ) {
				initialContent = `Changes in this RC (${pluginVersion}):\n`;
			}

			// Open a text editor to get the changelog.
			const changelog = await getUserInput( { initialContent } );

			/* eslint-disable camelcase */
			const releaseData = {
				tag_name: pluginVersion,
				target_commitish: grunt.config.data.branchForRC,
				name: pluginVersion,
				body: changelog,
				draft: false,
				prerelease: true,
			};
			/* eslint-enable camelcase */

			let responseData;
			try {
				const response = await githubApi( "releases", releaseData, "POST" );
				if ( ! response.ok ) {
					await logError( response, grunt );
				}
				responseData = await response.json();
			} catch ( error ) {
				grunt.log.error( error );
				grunt.fail.fatal( "An error occurred creating a GitHub pre-release." );
			}

			// Upload the zip to GitHub.
			try {
				const uploadResponse = await uploadToGitHub( responseData.upload_url, "artifact.zip", "wordpress-seo.zip" );
				if ( ! uploadResponse.ok ) {
					await logError( uploadResponse, grunt );
				}
			} catch ( error ) {
				grunt.log.error( error );
				grunt.fail.fatal( "An error occurred creating a GitHub pre-release." );
			}

			// Slack notifier logic.
			const tagUrl = `https://github.com/${ process.env.GITHUB_REPOSITORY }/releases/tag/${ releaseData.tag_name }`;
			grunt.config.set( "rc.github.url", tagUrl );
			done();
		}
	);
};
