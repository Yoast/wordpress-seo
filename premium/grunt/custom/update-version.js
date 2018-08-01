/**
 * A task that updates version numbers in project files in accordance with
 * build config.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"update-version",
		"Updates the version tags in all the right places.",
		function() {
			let options = this.options(
				{
					version: "version",
					regEx: "regEx",
					preVersionMatch: "preVersionMatch",
					postVersionMatch: "postVersionMatch"
				}
			);

			this.files.forEach( (file) => {
				file.src.forEach( (path) => {
					const oldContents = grunt.file.read( path );

					let contents = oldContents.replace(
						options.regEx,
						options.preVersionMatch + options.version + options.postVersionMatch
					);

					if ( oldContents === contents ) {
						grunt.log.writeln( "Old contents are identical to new contents, probably the version wasn't correctly replaced".red );
					}

					grunt.file.write( path, contents );
				} );
			} );
		}
	);
}
