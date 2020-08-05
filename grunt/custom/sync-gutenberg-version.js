const fetch = require( "node-fetch" );

module.exports = function( grunt ) {
	grunt.registerTask(
		"sync-gutenberg-version",
		"Makes sure the Gutenberg-supported version is set to the latest release.",
		async function() {
			const done = this.async();

			const targetFile = "admin/class-gutenberg-compatibility.php";

			const gutenbergInfo = await fetch( "https://api.wordpress.org/plugins/info/1.0/gutenberg.json" );
			const gutenbergInfoJSON = await gutenbergInfo.json();

			const currentVersion = getVersion( targetFile, /(\s?)(const CURRENT_RELEASE = ')(\d+(\.\d+){0,3})(';\n)/, 3 );

			// Only change the file if the version does not match.
			if ( currentVersion !== gutenbergInfoJSON.version ) {
				setVersion( targetFile, /(\s?)(const CURRENT_RELEASE = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5" );
				setVersion( targetFile, /(\s?)(const MINIMUM_SUPPORTED = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5" );

				// Add the file to commit the version bump.
				grunt.config( "gitadd.gutenbergFiles", { files: { src: [targetFile] } } );
				grunt.task.run( "gitadd:gutenbergFiles" );

				// Commit the version bump.
				grunt.config( "gitcommit.gutenbergFiles", {
					options: { message: "Bump Gutenberg supported version." },
					files: { src: [targetFile] }
				} );
				grunt.task.run( "gitcommit:gutenbergFiles" );
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
	 * Reads the current Gutenberg version from the file.
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
