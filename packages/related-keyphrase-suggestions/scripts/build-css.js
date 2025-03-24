#!/usr/local/bin/node
const fs = require( "fs" );
const path = require( "path" );
const { execSync } = require( "child_process" );

// Define build directory.
const BUILD_DIR = path.join( __dirname, "../build/css" );

// Cleanup.
fs.rmSync( BUILD_DIR, { recursive: true, force: true } );

// Ensure CSS build directory.
fs.mkdirSync( BUILD_DIR, { recursive: true } );

// Merge all CSS files to single style.css file.
[ "elements", "components" ].forEach( scope => {
	try {
		fs.appendFileSync( `${ BUILD_DIR }/style.css`, execSync( `cat src/${ scope }/**/*.css` ) );
	} catch ( error ) {
		console.error( error.message );
	}
} );
