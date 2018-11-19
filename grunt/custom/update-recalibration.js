/**
 * A task which extracts the recalibration version and increments it.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"update-recalibration",
		"Bumps the recalibration version.",
		function() {
			const packageJson = require( "../../package.json" );
			const version = parseInt( packageJson.yoast.recalibrationVersion, 10 ) + 1;

			grunt.option( "new-version", JSON.stringify( version ) );
			grunt.task.run( "set-version:recalibration" );
		}
	);
};
