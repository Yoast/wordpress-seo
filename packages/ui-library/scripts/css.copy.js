#!/usr/local/bin/node
const glob = require( "glob" );
const fs = require( "fs" );
const path = require( "path" );

const copyFiles = ( src, dest ) => {
	const result = { success: 0, error: 0 };

	try {
		fs.mkdirSync( path.join( __dirname, dest ), { recursive: true } );
	} catch ( e ) {
		console.error( e.toString() );

		return result;
	}

	glob.sync( src ).map(
		file => {
			try {
				fs.copyFileSync(
					file,
					path.join( __dirname, dest + file.split( path.sep ).slice( -1 ) ),
				);
				++result.success;
			} catch ( e ) {
				++result.error;
				console.error( e.toString() );
			}
		},
	);

	return result;
};

const { success, error } = copyFiles( "src/**/*.css", "../build/css/" );
if ( error > 0 ) {
	console.warn( `Failed to copy ${ error } files.` );
}
console.log( `Successfully copied ${ success } files.` );
