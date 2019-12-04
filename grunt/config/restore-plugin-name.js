/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"restore-plugin-name",
		"Restores the main plugin file in order to revert change-plugin-name-to-rc.js",
		function() {
		}
	);
};
