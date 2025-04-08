const fetch = require( "node-fetch" );

module.exports = function( grunt ) {
	/**
	 * Helper function to update the content of the file.
	 *
	 * @param {string} file    Target file.
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
	 * Reads the current Gutenberg version from the file.
	 *
	 * @param {string} file    Target file.
	 * @param {RegExp} pattern Pattern to search for.
	 * @param {int} index      Index to return.
	 *
	 * @returns {string} The version from the file.
	 */
	function getVersion( file, pattern, index ) {
		return pattern.exec( grunt.file.read( file ) )[ index ];
	}

	grunt.registerTask(
		"sync-gutenberg-version",
		"Makes sure the Gutenberg-supported version is set to the latest release.",
		async function() {
			const done = this.async();

			const targetFile = "admin/class-gutenberg-compatibility.php";

			const gruntFlags = grunt.option.flags();
			const noGitPush = gruntFlags.indexOf( "--no-git-push" ) !== -1;

			const gutenbergInfo = await fetch( "https://api.wordpress.org/plugins/info/1.0/gutenberg.json" );
			const gutenbergInfoJSON = await gutenbergInfo.json();

			const currentVersion = getVersion( targetFile, /(\s?)(const CURRENT_RELEASE = ')(\d+(\.\d+){0,3})(';\n)/, 3 );

			// Only change the file if the version does not match.
			if ( currentVersion !== gutenbergInfoJSON.version ) {
				setVersion( targetFile, /(\s?)(const CURRENT_RELEASE = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5" );
				setVersion( targetFile, /(\s?)(const MINIMUM_SUPPORTED = ')(\d+(\.\d+){0,3})(';\n)/, "$1$2" + gutenbergInfoJSON.version + "$5" );

				// Add the file to commit the version bump.
				grunt.config( "gitadd.gutenbergFiles", { files: { src: [ targetFile ] } } );
				grunt.task.run( "gitadd:gutenbergFiles" );

				// Commit the version bump.
				grunt.config( "gitcommit.gutenbergFiles", {
					options: { message: "Bump Gutenberg supported version." },
					files: { src: [ targetFile ] },
				} );
				grunt.task.run( "gitcommit:gutenbergFiles" );


				// Push the commit to the branch.
				if ( ! noGitPush ) {
					grunt.verbose.writeln( "push changes to github" );
					grunt.config( "gitpush.gutenbergVersion.options", { remote: "origin", upstream: true, branch: grunt.config.data.branchForRC } );
					grunt.task.run( "gitpush:gutenbergVersion" );
				}
			}

			return done();
		}
	);
};
