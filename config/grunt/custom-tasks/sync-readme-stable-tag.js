const wordpressApi = require( "../lib/wordpress-api" );

module.exports = function( grunt ) {
	grunt.registerTask(
		"sync-readme-stable-tag",
		"Makes sure the Stable version is set to the latest released on wordpress.org.",
		async function() {
			const done = this.async();

			const targetFile = "readme.txt";
			const stableVerion = await wordpressApi.getPluginStableVersionFromWordPressApi( grunt.config.data.pluginSlug );
			if ( stableVerion === null ){
				grunt.fail.fatal(
					"The Stable tag for plugin: " + grunt.config.data.pluginSlug + " could not be retrieved from api.wordpress.org\n" +
					"The release process has been stopped."
				);
			}

			const currentVersion = getVersion( targetFile, /(\n?)(Stable tag: )(\d+(\.\d+){0,3})(\n)/, 3 );
			//grunt.verbose.writeln ( "stable Tag version in readme.txt: " + currentVersion + "\nretrieved verion: " + stableVerion );
			// Only change the file if the version does not match.
			if ( currentVersion !== stableVerion ) {
				grunt.verbose.writeln ( "stable Tag version in readme.txt: " + currentVersion + "\nretrieved version: " + stableVerion + "\nWill set it to the retrieved worpress.org value now." );
				setVersion( targetFile, /(\n?)(Stable tag: )(\d+(\.\d+){0,3})(\n)/, "$1$2" + stableVerion + "\n" );
			}

			return done();
		}
	);

	/**
	 * Helper function to update the content of the file.
	 *
	 * @param {string} file Target file.
	 * @param {RegExp} pattern Pattern to search for.
	 * @param {string} version Version to insert.
	 */
	function setVersion( file, pattern, version ) {
		let contents = grunt.file.read( file ).replace(
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
	 * @return {string} The version from the file.
	 */
	function getVersion( file, pattern, index ) {
		return pattern.exec( grunt.file.read( file ) )[ index ];
	}
};
