
const spawn = require( "child_process" ).spawnSync;
const request = require( "request" );

function openChangelogEditor ( grunt ) {
	const editor = process.env.VISUAL || process.env.EDITOR || "vim" || "code" || "subl";

	// Spawn editor and save to changelog_buffer.txt
	const { status } = spawn( editor, ["changelog_buffer.txt"], {stdio:"inherit"} );
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
		function() {
			const done = this.async();

			// Open a text editor to get the changelog.
			const changelog = openChangelogEditor( grunt );
			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;

			//TODO It seems a target [commit] is not necessary, so we use grunt-git to run the git tag with name and message.
			// Check if this is necessary at all, because the request to create the release already includes creation of a tag.

			// Create the tag.
			//			grunt.config( "gittag.rctag.options.tag", pluginVersion );
			//			grunt.config( "gittag.rctag.options.message", changelog );
			//			grunt.task.run( "gittag:rctag" );

			let github = {};
			github.apiRoot = 'https://api.github.com';
			github.accesToken = ""; // TODO: Get from ENV
			github.api_url = github.apiRoot + "/repos/Yoast/wordpress-seo/releases?access_token=" + github.accesToken;

			const release_data = {
				"tag_name": "v" + pluginVersion,
				"target_commitish": "master",
				"name": "v" + pluginVersion,
				"body": changelog,
				"draft": false,
				"prerelease": true
			};

			// TODO: fix this request.
			request.post( github.api_url )
			       .send( release_data )
			       .end(function(err, res) {
				       console.log( err, res );
				       done();
			       } );
		}
	);
};
