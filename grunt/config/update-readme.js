const getUserInput = require( "./tools/get-user-input" );
const parseVersion = require( "./tools/parse-version" );

/**
 * ...
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"update-readme",
		"Prompts the user for the changelog entries and updates the readme.txt",
		function() {
			const done = this.async();

			let changelog = grunt.file.read( "./readme.txt" );
			const newVersion = grunt.option( "plugin-version" );
			getUserInput( { initialContent: `= ${newVersion} =` } ).then( newChangelog => {
				grunt.option( "changelog", newChangelog );
				const versionNumber = parseVersion( newVersion );

				// Only if the version is not a patch we remove old changelog entries.
				if ( versionNumber.patch !== 0 ) {
					const releaseInChangelog = /[=] \d+\.\d+(\.\d+)? =/g;
					const allReleasesInChangelog = changelog.match( releaseInChangelog );
					const sanitizedVersionNumbers = allReleasesInChangelog.map(
						element => parseVersion( element.slice( 2, element.length - 2 ) )
					);
					const highestMajor = Math.max( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.major ) );
					const lowestMajor = Math.min( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.major ) );

					if ( highestMajor !== lowestMajor ) {
						// If there are multiple major versions in the current changelog, remove all entries from the oldest major version.
						changelog = changelog.replace( new RegExp( "= " + lowestMajor + "(.|\\n)*= Earlier versions =" ), "= Earlier versions =" );
					} else {
						// If there are only multiple minor versions of the same major version, remove all entries from the oldest minor version.
						const lowestMinor = Math.min( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.minor ) );
						const lowestVersion = `${lowestMajor}.${lowestMinor}`;
						changelog = changelog.replace( new RegExp( "= " + lowestVersion + "(.|\\n)*= Earlier versions =" ), "= Earlier versions =" );
					}
				}
				// Add the user input to the changelog.
				changelog = changelog.replace( /[=]= Changelog ==/ig, "== Changelog ==\n\n" + newChangelog.trim() );
				grunt.file.write( "./readme.txt", changelog );
				done();
			} );

			// Stage the changed readme.txt.
			grunt.config( "gitadd.addChangelog.files", { src: [ "./readme.txt" ] } );
			grunt.task.run( "gitadd:addChangelog" );

			// Commit the changed readme.txt.
			grunt.config( "gitcommit.commitChangelog.options.message", "Add changelog" );
			grunt.task.run( "gitcommit:commitChangelog" );
		}
	);
};
