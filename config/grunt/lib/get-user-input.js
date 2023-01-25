const tmp = require( "tmp" );
const spawn = require( "child_process" ).spawn;
const fs = require( "fs" );

/**
 * Prompts the user with an editor for providing input.
 *
 * @param {Object} [options]                Optional. The options.
 * @param {string} [options.command]        Optional. The executable for the editor to use.
 * @param {string} [options.initialContent] Optional. The initial value for the user input.
 *
 * @returns {Promise<string>} A promise resolving to the user input.
 */
async function getUserInput( options = {} ) {
	const editorCommand = options.command || process.env.EDITOR || "nano";
	const initialContent = options.initialContent || "";

	const editorCommands = editorCommand.split( " " );
	const editorExecutable = editorCommands.shift();

	return new Promise( ( resolve, reject ) => {
		const tmpFile = tmp.fileSync();
		if ( initialContent ) {
			fs.appendFileSync( tmpFile.name, initialContent );
		}
		const editorSpawn = spawn( editorExecutable, [ ...editorCommands, tmpFile.name ], {
			stdio: "inherit",
			detached: false,
		} );
		editorSpawn.on( "exit", () => {
			const content = fs.readFileSync( tmpFile.name, { encoding: "utf8" } );
			tmpFile.removeCallback();
			resolve( content );
		} );
		editorSpawn.on( "error", ( e ) => {
			reject( e );
		} );
	} );
}

module.exports = getUserInput;
