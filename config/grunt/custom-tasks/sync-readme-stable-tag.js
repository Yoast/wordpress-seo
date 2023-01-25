const wordpressApi = require( "../lib/wordpress-api" );

module.exports = function( grunt ) {
	/**
	 * Helper function to update the content of the file.
	 *
	 * @param {string} file Target file.
	 * @param {RegExp} pattern Pattern to search for.
	 * @param {string} version Version to insert.
	 *
	 * @returns {void}
	 */
	function setVersion( file, pattern, version ) {
		const contents = grunt.file.read( file ).replace(
			pattern,
			version
		);

		grunt.file.write( file, contents );
	}

	/**
	 * Reads the value pattern from the file.
	 *
	 * @param {string} file Target file.
	 * @param {RegExp} pattern Pattern to search for.
	 * @param {int} index Index to return.
	 *
	 * @returns {string} The version from the file.
	 */
	function getVersion( file, pattern, index ) {
		return pattern.exec( grunt.file.read( file ) )[ index ];
	}

	grunt.registerTask(
		"sync-readme-stable-tag",
		"Makes sure the Stable version is set to the latest released on wordpress.org.",
		async function() {
			const done = this.async();

			const targetFile = "readme.txt";
			const stableVersion = await wordpressApi.getPluginStableVersionFromWordPressApi( grunt.config.data.pluginSlug );
			if ( stableVersion === null ) {
				grunt.fail.fatal(
					"The Stable tag for plugin: " + grunt.config.data.pluginSlug + " could not be retrieved from api.wordpress.org\n" +
					"The release process has been stopped."
				);
			}

			const currentVersion = getVersion( targetFile, /(\n?)(Stable tag: )(\d+(\.\d+){0,3})(\n)/, 3 );
			// Only change the file if the version does not match.
			if ( currentVersion !== stableVersion ) {
				grunt.verbose.writeln( "Stable tag version in readme.txt: " + currentVersion + "\n" +
					"Retrieved version from wordpress.org: " + stableVersion + "\n" +
					"Will set the version in readme.txt to the retrieved wordpress.org value now." );
				setVersion( targetFile, /(\n?)(Stable tag: )(\d+(\.\d+){0,3})(\n)/, "$1$2" + stableVersion + "\n" );
			}

			return done();
		}
	);
};
