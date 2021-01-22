const tmp = require( "tmp" );
const fs = require( "fs" );

/**
 * Prompts the user with an editor for providing input.
 *
 * @param {Object} [options]                Optional. The options.

 * @param {string} [options.newChangelogContent] Optional. The initial value for the user input.
 *
 * @returns {Promise<string>} A promise resolving to the user input.
 */
async function mergeChangeLog( options = {} ) {
	return new Promise( ( resolve, reject ) => {
		const newChangelogContent = options.newChangelogContent || "";
		
		const tmpFile = tmp.fileSync();
		
		if ( newChangelogContent ) {
			fs.appendFileSync( tmpFile.name, newChangelogContent );
		}
		const content = fs.readFileSync( tmpFile.name, { encoding: "utf8" } );
		tmpFile.removeCallback();
		resolve( content );
		
	} );
}

module.exports = mergeChangeLog;
