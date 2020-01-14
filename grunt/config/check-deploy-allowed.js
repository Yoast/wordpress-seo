/**
 * Checks if the stable tag is an RC version and aborts the release process if so.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"check-deploy-allowed",
		"Checks if the stable tag is an RC version and aborts the release process if so.",
		function() {
			const contents = grunt.file.read( "readme.txt" );
			const regex = new RegExp( "Stable tag: .*-RC.*" );
			const isRCVersion = contents.search( regex ) !== -1;
			if ( isRCVersion ) {
				grunt.fail.fatal(
					"The Stable tag specified in the readme.txt file contains RC tag. You cannot deploy an RC version. " +
					"The release process has been stopped."
				);
			}
		}
	);
};
