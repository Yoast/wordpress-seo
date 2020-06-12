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

			setVersion( targetFile, /(\s?)(const CURRENT_RELEASE = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5");
			setVersion( targetFile, /(\s?)(const MINIMUM_SUPPORTED = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5");

			return done();
		}
	);

	/**
	 * Helper function to update the content of the file.
	 *
	 * @param file
	 * @param search
	 * @param version
	 */
	function setVersion( file, search, version ) {
		let contents = grunt.file.read( file ).replace(
			search,
			version
		);

		grunt.file.write( file, contents );
	}
}
