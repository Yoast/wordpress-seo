#!/usr/local/bin/node
/* eslint-disable require-jsdoc */
const fs = require( "fs" );
const path = require( "path" );
const execSync = require( "child_process" ).execSync;

// Define build directory.
const BUILD_DIR = path.join( __dirname, "../build/css" );

// Cleanup.
fs.rmSync( BUILD_DIR, { recursive: true, force: true } );

// Ensure CSS build directory.
fs.mkdirSync( BUILD_DIR, { recursive: true } );

// Merge all CSS files to single style.css file.
[ "elements", "components" ].forEach( scope => {
	fs.appendFileSync( `${ BUILD_DIR }/style.css`, execSync( `cat src/${ scope }/**/*.css` ) );
} );

// Copy the base CSS file.
fs.copyFileSync( "src/base.css", `${ BUILD_DIR }/base.css` );
