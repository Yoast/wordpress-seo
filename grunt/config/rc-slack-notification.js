/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"rc-slack-notification",
		"Posts a notification in the #test slack channel, saying that the rc is released",
		function() {
		}
	);
};
