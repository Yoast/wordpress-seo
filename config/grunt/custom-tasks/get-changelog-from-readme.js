/**
 * A task which extracts the changelog for the current release and
 * updates it on Yoast.com
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"get-changelog-from-readme",
		"Set grunt.config.data.currendChangelog variable to the changelog part from the readme file",
		function() {
			let options = this.options(
				{
					readmePath: "readme.txt"
				}
			);
			let changelog = grunt.file.read( readmePath );


			/*
			let currentChangelog = grunt.file.read( options.readmePath ).match(
				options.regEx
			)[ options.matchGroupIndex ];
			console.log("match", currentChangelog);
			*/
		}
	);
}
