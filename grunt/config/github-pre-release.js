const spawn = require( "child_process" ).spawnSync;
const fetch = require( "node-fetch" );

function openChangelogEditor( grunt ) {
	const editor = process.env.VISUAL || process.env.EDITOR || "vim" || "code" || "subl";

	// Spawn editor and save to changelog_buffer.txt
	const { status } = spawn( editor, [ "changelog_buffer.txt" ], { stdio: "inherit" } );
	if ( status !== 0 ) {
		grunt.fail.fatal( "Something went wrong while editing the changelog." );
	}

	// Read out the changelog_buffer.txt contents.
	const data = grunt.file.read( "changelog_buffer.txt" );

	if ( data.length === 0 ) {
		grunt.file.delete( "changelog_buffer.txt" );
		grunt.fail.fatal( "The changelog cannot be empty." );
	}

	grunt.file.delete( "changelog_buffer.txt" );

	return data;
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
			const changelog = openChangelogEditor( grunt );
			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;

			// Creating the release on github through an API request.
			const github = {};
			github.apiRoot = "https://api.github.com";
			github.accesToken = process.env.GITHUB_TOKEN;

			// Note: do not uncomment the /Yoast/wordpress-seo URL unless you want to create a real tag. Use a personal fork for testing, instead:
			//github.api_url = github.apiRoot + "/repos/{ YOUR PERSONAL REPO }/wordpress-seo/releases?access_token=" + github.accesToken;

			// github.api_url = github.apiRoot + "/repos/Yoast/wordpress-seo/releases?access_token=" + github.accesToken;

			const releaseData = {
				tag_name: "v" + pluginVersion,
				target_commitish: "release/12.8",
				name: "v" + pluginVersion,
				body: changelog,
				draft: false,
				prerelease: true,
			};

			let responseObject;
			try {
				const response = await fetch( github.api_url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify( releaseData ),
				} );
				responseObject = await response.json();

				// If there are error(s), throw them into the catch.
				if ( responseObject.errors && responseObject.errors.length > 0 ) {
					throw responseObject;
				}
			} catch ( error ) {
				grunt.log.error( error.message );
				error.errors.forEach( error => {
					grunt.log.error( JSON.stringify( error ) );
				} );
				grunt.fail.fatal( "Quit due to the errors above" );
			}

			// Slack notifier logic.
			const constructedZipUrl = "https://github.com/Yoast/wordpress-seo/archive/" + releaseData.tag_name + ".zip";
			grunt.config.set( "rc.github.url", constructedZipUrl );
			done();
		}
	);
};
