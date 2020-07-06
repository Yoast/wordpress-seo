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
			grunt.log.writeln( "You should now merge the " + grunt.config.data.branchForRC + " branch back to trunk." );
		}
	);
};
