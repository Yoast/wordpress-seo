
const spawn = require( "child_process" ).spawnSync;

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
			const editor = process.env.VISUAL || process.env.EDITOR || "vim";

			// Spawn editor and read out the contents (in buffer form).
			const { stdout, status } = spawn( editor );

			if ( status !== 0 ) {
				grunt.fail.fatal( "Something went wrong while editing the changelog." );
			}

			// Decode the buffer contents to a UTF-8 encoded string.
			const description = stdout.toString( "utf-8" );

			if ( description.length === 0 ) {
				grunt.fail.fatal( "The changelog cannot be empty." );
			}
		}
	);
};
