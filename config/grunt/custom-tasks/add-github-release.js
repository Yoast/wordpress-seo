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

	if ( responseObject.errors ) {
		responseObject.errors.forEach( error => {
			grunt.log.error( JSON.stringify( error ) );
		} );
	}

	grunt.fail.fatal( "Failed to create a pre-release on GitHub." );
}

/**
 * Creates and pushes a GitHub (pre-)release and uploads the artifact to GitHub, using the GitHub API.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"add-github-release",
		"Creates and pushes a GitHub release and uploads the artifact to GitHub",
		async function() {
			const done = this.async();
            let options = this.options({
				manualEditChangelog: true,
				target_commitish: '',
				draft: false,
				prerelease: true,
				srcZipFilename: '',
				dstZipFilename: '',
				githubOwner:  '',
				githubRepo: '',
				enable: false,
				uploadZip: false,
			});
			
            
			if ( ! options.enable) {
				grunt.config.data.tagUrl = 'The GitHub release was skipped - because it is disabled in this run.'
				return done();
			}
			
			let changelog;
			const owner = options.githubOwner;
			const repo = options.githubRepo;

			
			if (options.manualEditChangelog === true) {
				// Open a text editor to get the changelog.
				changelog = await getUserInput( { initialContent: grunt.option( "changelog" ) } );
			} else {
				// Use the changelog from the arguments.
				changelog = grunt.option( 'changelog' ) || process.env.RELEASECHANGELOG || grunt.config.data.changelog ;
			}
			// Perform sanity checks to fail fast when data is missing.
			if (changelog === '') {
				grunt.fail.fatal( 'No changelog was provided, this is required.' );
			}
			if (owner === '') {
				grunt.fail.fatal( 'Github owner (organisation) required');
			}
			if (repo === '') {
				grunt.fail.fatal( 'No GitHub repository is configured, this is required.' );
			}
			if (options.srcZipFilename === '') {
				grunt.fail.fatal( 'Github release source Zipfile name required');
			}
			if (options.dstZipFilename === '') {
				grunt.fail.fatal( 'GitHub release destination filename is not configured, this is required.' );
			}
			if (options.target_commitish === '') {
				grunt.fail.fatal( 'Github release target_commitish name required');
			}


			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;
			/* eslint-disable camelcase */
			const releaseData = {
				tag_name: pluginVersion,
				target_commitish: options.target_commitish,
				name: pluginVersion,
				body: changelog,
				draft: options.draft,
				prerelease: options.prerelease,
			};
			/* eslint-enable camelcase */
 
			const path = `${ owner }/${ repo }/releases`;
			grunt.verbose.writeln( "GitHub release path = " + path );
			let responseData;
			try {
				const response = await githubApi( path, releaseData, "POST");
				if ( ! response.ok ) {
					await logError( response, grunt );
				}
				responseData = await response.json();
			} catch ( error ) {
				grunt.log.error( error );
				grunt.fail.fatal( "An error occurred creating a GitHub release." );
			}

			// Upload the zip to GitHub.
			grunt.verbose.writeln( "GitHub release upload URL = " + responseData.upload_url );
			if (options.uploadZip) {
				try {
					const uploadResponse = await uploadToGitHub( responseData.upload_url, options.srcZipFilename, options.dstZipFilename );
					if ( ! uploadResponse.ok ) {
						await logError( uploadResponse, grunt );
					}
				} catch ( error ) {
					grunt.log.error( error );
					grunt.fail.fatal( "An error occurred creating a GitHub release." );
				}
			}
			// Slack notifier logic.
			const tagUrl = `https://github.com/${ path }/tag/${ releaseData.tag_name }`;
			grunt.config.data.tagUrl =  tagUrl ;
			
			done();
		}
	);
};
