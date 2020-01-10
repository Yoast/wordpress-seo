/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"prompt-monorepo-versions",
		[ "prompt:monorepoVersions" ]
	);
};
