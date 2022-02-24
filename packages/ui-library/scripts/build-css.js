#!/usr/local/bin/node
/* eslint-disable require-jsdoc */
const fs = require( "fs" );
const path = require( "path" );
const execSync = require( "child_process" ).execSync;

const wrapInTryCatch = fn => {
	try {
		return fn();
	} catch ( e ) {
		console.error( e.toString() );
	}
};

const mergeStyles = ( scope, src, dest ) => fs.writeFileSync(
	path.join( __dirname, dest + scope + ".css" ),
	execSync( `cat ${ src }` ),
);

// Ensure dest directory.
wrapInTryCatch( () => fs.mkdirSync( path.join( __dirname, "../build/css" ), { recursive: true } ) );

// All styles file content. Imports the base, the folders and tailwind.
let styleFileContent = "@import \"./base.css\";\n";

// Merge the CSS files for each folder.
[ "elements", "components" ].forEach( folder => {
	wrapInTryCatch( () => mergeStyles( folder, `src/${ folder }/**/*.css`, "../build/css/" ) );
	// Add the file to the index.
	styleFileContent += `@import "./${ folder }.css";\n`;
} );

// Copy the base CSS file.
fs.copyFileSync( "src/base.css", path.join( __dirname, "../build/css/base.css" ) );

// Add Tailwind imports to the index.
styleFileContent += "\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
// Write style.css file.
wrapInTryCatch( () => fs.writeFileSync( path.join( __dirname, "../build/css/style.css" ), styleFileContent ) );
