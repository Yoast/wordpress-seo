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
			const file = "package.json";
			const packageJson = require( "../../" + file );
			const version = parseInt( packageJson.yoast.recalibrationVersion, 10 ) + 1;

			/*
			 * The set-version command is used in our process without any specification. E.g. grunt set-version --new-version=X.X
			 * This is a temporary script. Therefore, removing the recalibration from set-version to not have to adapt our process.
			 *
			 * The following is copied from: https://github.com/Yoast/plugin-grunt-tasks/blob/master/tasks/set-version.js
			 */

			packageJson.yoast.recalibrationVersion = version.toString();
			grunt.file.write( file, JSON.stringify( packageJson, null, "  " ) + "\n" );
		}
	);
};
