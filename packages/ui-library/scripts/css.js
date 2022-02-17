#!/usr/local/bin/node
const glob = require( "glob" );
const fs = require( "fs" );
const path = require( "path" );

glob.sync( "src/**/*.css" ).map( file => {
	const destination = path.join( __dirname, "../build/css/" + file.split( path.sep ).slice( -1 ) );
	console.log( file, destination );
	fs.copyFileSync( file, destination );
} );
