const getUserInput = require( "./tools/get-user-input" );
let _isEmpty = require( "lodash/isEmpty" );

/**
 * Class representing a version number.
 */
class VersionNumber {
	/**
	 * Parses a version number string into a version number object.
	 *
	 * @param {string} versionNumberString The version number string to parse.
	 */
	constructor( versionNumberString ) {
		this.versionNumberString = versionNumberString;

		const versionNumbersObject = this.versionNumber();

		this.major = versionNumbersObject.major;
		this.minor = versionNumbersObject.minor;
		this.patch = versionNumbersObject.patch;
	}

	/**
	 * Parses a version number string of the format major.minor.patch (patch optional) into a version number object.
	 *
	 * @returns {{major: number, minor: number, patch: number}} The version numbers.
	 */
	versionNumber() {
		const versionNumberString = this.versionNumberString;
		const versionNumber = ( /(\d+).(\d+).?(\d+)?/g ).exec( versionNumberString );

		return {
			major: parseInt( versionNumber[ 1 ], 10 ),
			minor: parseInt( versionNumber[ 2 ], 10 ),
			patch: parseInt( versionNumber[ 3 ], 10 ) || 0,
		};
	}

	/**
	 * Checks whether a given version number is a patch.
	 *
	 * @returns {boolean} True if the version number is a patch.
	 */
	isPatch() {
		return this.versionNumber().patch > 0;
	}
}

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

			const newVersion = grunt.option( "plugin-version" );
			const versionNumber = new VersionNumber( newVersion );

			let changelog = grunt.file.read( "./readme.txt" );

			const releaseInChangelog = /[=] \d+\.\d+(\.\d+)? =/g;
			const allReleasesInChangelog = changelog.match( releaseInChangelog );
			const changelogVersions = allReleasesInChangelog.map(
				element => new VersionNumber( element.slice( 2, element.length - 2 ) )
			);

			// Only if the version is not a patch we remove old changelog entries.
			if ( ! versionNumber.isPatch() ) {
				let cleanedChangelog = changelog;

				// Remove the current version from the list; this should not be removed.
				const relevantChangelogVersions = changelogVersions.filter( version => {
					return ! (
						versionNumber.major === version.major &&
						versionNumber.minor === version.minor &&
						versionNumber.patch === version.patch
					);
				} );

				const highestMajor = Math.max( ...relevantChangelogVersions.map( version => version.major ) );
				const lowestMajor = Math.min( ...relevantChangelogVersions.map( version => version.major ) );

				if ( highestMajor === lowestMajor ) {
					// If there are only multiple minor versions of the same major version, remove all entries from the oldest minor version.
					const lowestMinor = Math.min( ...relevantChangelogVersions.map( version => version.minor ) );
					const lowestVersion = `${lowestMajor}.${lowestMinor}`;
					cleanedChangelog = changelog.replace(
						new RegExp( "= " + lowestVersion + "(.|\\n)*= Earlier versions =" ),
						"= Earlier versions ="
					);
				} else {
					// If there are multiple major versions in the current changelog, remove all entries from the oldest major version.
					cleanedChangelog = changelog.replace(
						new RegExp( "= " + lowestMajor + "(.|\\n)*= Earlier versions =" ),
						"= Earlier versions ="
					);
				}

				if ( cleanedChangelog !== changelog ) {
					changelog = cleanedChangelog;

					grunt.option( "changelog", changelog );

					// Write changes to the file.
					grunt.file.write( "./readme.txt", changelog );
				}
			}

			// Check if the current version already exists in the changelog.
			const containsCurrentVersion = ! _isEmpty(
				changelogVersions.filter( version => {
					return (
						versionNumber.major === version.major &&
						versionNumber.minor === version.minor &&
						versionNumber.patch === version.patch
					);
				} )
			);

			if ( containsCurrentVersion ) {
				// Present the user with the entire changelog file.
				getUserInput( { initialContent: changelog } ).then( newChangelog => {
					grunt.option( "changelog", newChangelog );

					// Write changes to the file.
					grunt.file.write( "./readme.txt", newChangelog );
					done();
				} );
			} else {
				// Present the user with only the version number.
				getUserInput( { initialContent: `= ${newVersion} =` } ).then( newChangelog => {
					grunt.option( "changelog", newChangelog );

					// Add the user input to the changelog.
					changelog = changelog.replace( /[=]= Changelog ==/ig, "== Changelog ==\n\n" + newChangelog.trim() );

					// Write changes to the file.
					grunt.file.write( "./readme.txt", changelog );
					done();
				} );
			}

			// Stage the changed readme.txt.
			grunt.config( "gitadd.addChangelog.files", { src: [ "./readme.txt" ] } );
			// grunt.task.run( "gitadd:addChangelog" );

			// Commit the changed readme.txt.
			grunt.config( "gitcommit.commitChangelog.options.message", "Add changelog" );
			// grunt.task.run( "gitcommit:commitChangelog" );
		}
	);
};
