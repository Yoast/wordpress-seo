/**
 * A task which extracts the changelog for the current release and
 * updates it on Yoast.com
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"update-changelog",
		"Updates the changelog on yoast.com.",
		function() {
			let options = this.options(
				{
					version: "version",
					regEx: "regEx",
					matchGroupIndex: "matchGroupIndex",
					readmePath: "readmePath"
				}
			);
			let currentChangelog = grunt.file.read( options.readmePath ).match(
				options.regEx
			)[ options.matchGroupIndex ];
			console.log("match", currentChangelog);
		}
	);
}
