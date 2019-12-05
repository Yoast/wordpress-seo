
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

			const editor = process.env.VISUAL || process.env.EDITOR || "subl";

			const { stdout } = spawn( editor );

			console.log( stdout.toString( "utf8" ) );

		}
	);
};
