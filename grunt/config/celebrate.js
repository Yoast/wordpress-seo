/**
 * Celebrates with emoji in the log.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"celebrate",
		"Celebration with emoji in the log",
		function() {
			grunt.log.writeln( "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉" );
		}
	);
};
