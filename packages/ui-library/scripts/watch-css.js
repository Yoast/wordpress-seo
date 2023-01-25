#!/usr/local/bin/node
/* eslint-disable require-jsdoc, no-console */
const fs = require( "fs" );
const path = require( "path" );
const { execSync } = require( "child_process" );
const { debounce } = require( "lodash" );

const build = () => {
	console.time( "CSS done" );
	execSync( "yarn build:css" );
	console.timeEnd( "CSS done" );
};

const debouncedBuild = debounce( build, 500 );

// Watch the CSS files in source and build on changes.
fs.watch( "src", { recursive: true }, ( event, filename ) => {
	if ( path.extname( filename ) === ".css" ) {
		debouncedBuild();
	}
} );

// Build right away.
build();
