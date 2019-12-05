
const spawn = require( "child_process" ).spawnSync;


function openChangelogEditor( grunt ) {
	const editor = process.env.VISUAL || process.env.EDITOR || "vim";

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
		function() {
			// Open a text editor to get the changelog.
			const changelog = openChangelogEditor( grunt );

			const pluginVersion = grunt.file.readJSON( "package.json" ).yoast.pluginVersion;

			// Do not run on wordpress-seo (yet)
//			grunt.config( "gittag.rctag.options.tag", pluginVersion );
//			grunt.config( "gittag.rctag.options.message", changelog );
//			grunt.task.run( "gittag:rctag" );


			// todo: Set the URL on the grunt config, so that the Slack notifier has access to it.
			// grunt.config.set( "rc.github.url", "DE URL VAN DE RC ZIP HIER" );
			// todo: remove Temp:
			grunt.config.set( "rc.github.url", "https://github.com/Yoast/wordpress-seo/releases/download/12.7-RC2/wordpress-seo.zip" );
		}
	);
};
