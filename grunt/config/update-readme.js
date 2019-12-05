const tmp = require( "tmp" );
const child_process = require( "child_process" );
const fs = require( "fs" );

async function getUserInput( options = {} ) {
	let {
		command = null,
		initialContent = "",
	} = options;
	if ( command === null ) {
		command = process.env.EDITOR || "nano";
	}
	const editorCommands = command.split( " " );
	const editorExecutable = editorCommands.shift();
	return new Promise( (resolve, reject) => {
		const tmpFile = tmp.fileSync();
		if ( initialContent ) {
			fs.appendFileSync(tmpFile.name, initialContent);
		}
		const editorSpawn = child_process.spawn(editorExecutable, [ ...editorCommands, tmpFile.name ], {
			stdio: 'inherit',
			detached: false,
		} );
		editorSpawn.on('exit', function (e, code) {
			const content = fs.readFileSync( tmpFile.name, { encoding: "utf8" } );
			tmpFile.removeCallback();
			resolve( content );
		});
		editorSpawn.on( "error", ( e ) => {
			reject( e );
		} );
	} );
}

class VersionNumber {
	constructor( versionNumberString ) {
		this.versionNumberString = versionNumberString;
		this.major = this.versionNumber().major;
		this.minor = this.versionNumber().minor;
		this.patch = this.versionNumber().patch;
	}
	versionNumber( ) {
		const versionNumberString = this.versionNumberString;
		const versionNumber = ( /(\d+).(\d+).?(\d+)?/g ).exec( versionNumberString );
		// return versionNumber;
		return {
			major: parseInt( versionNumber[1] ),
			minor: parseInt( versionNumber[2] ),
			patch: parseInt( versionNumber[3] ) || 0,
		}
	}
	isPatch( ) {
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

			let changelog = grunt.file.read( "./readme.txt" );
			let newVersion = grunt.option('plugin-version');
			let newChangelog = getUserInput( { initialContent: `= ${newVersion} =` } ).then( newChangelog => {
				const versionNumber = new VersionNumber( newVersion );
				if( !versionNumber.isPatch() ) {
					const releaseInChangelog = /= \d+\.\d+(\.\d+)? =/g;
					const allReleasesInChangelog = changelog.match( releaseInChangelog );
					const sanitizedVersionNumbers = allReleasesInChangelog.map( element => new VersionNumber(element.slice( 2, element.length- 2) ) );
					const highestMajor = Math.max( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.major ) );
					const lowestMajor = Math.min( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.major ) );
					if ( highestMajor !== lowestMajor ) {
						changelog = changelog.replace( new RegExp( "= " + lowestMajor + "(.|\\n)*= Earlier versions =" ), "= Earlier versions =" );
					} else {
						const lowestMinor = Math.min( ...sanitizedVersionNumbers.map( sanitizedVersionNumber => sanitizedVersionNumber.minor ) );
						const lowestVersion = `${lowestMajor}.${lowestMinor}`;
						changelog = changelog.replace( new RegExp( "= " + lowestVersion + "(.|\\n)*= Earlier versions =" ), "= Earlier versions =" );
					}
				}
				changelog = changelog.replace( /== Changelog ==/ig, "== Changelog ==\n\n" + newChangelog.trim() );

				grunt.file.write( "./readme.txt", changelog );
				done();
			} );

		}
	);
};
