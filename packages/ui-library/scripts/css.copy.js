#!/usr/local/bin/node
/* eslint-disable require-jsdoc */
const glob = require( "glob" );
const fs = require( "fs" );
const path = require( "path" );

// Ensure dest directory.
try {
	fs.mkdirSync( path.join( __dirname, "../build/css" ), { recursive: true } );
} catch ( e ) {
	console.error( e.toString() );
}

const copyStyles = ( scope, src, dest ) => {
	const result = { success: 0, error: 0 };
	const filenames = [];

	glob.sync( src ).map(
		file => {
			try {
				// Last folder name is the filename
				const filename = file.split( path.sep ).slice( -2, -1 )[ 0 ];
				fs.copyFileSync(
					file,
					path.join( __dirname, `${ dest + filename }.css` ),
				);
				filenames.push( `@import "./${ filename }.css";` );
				++result.success;
			} catch ( e ) {
				++result.error;
				console.error( e.toString() );
			}
		},
	);

	if ( scope ) {
		fs.writeFileSync( path.join( __dirname, dest + scope + ".css" ), filenames.join( "\n" ) );
	}

	return result;
};

const folders = [ "elements", "components" ];

// Index file content for our base, all our folder imports and the tailwind imports.
let indexFileContent = "@import \"./base.css\";\n";

fs.copyFileSync( "src/base.css", path.join( __dirname, "../build/css/base.css" ) );
folders.forEach( folder => {
	copyStyles( folder, `src/${ folder }/**/*.css`, "../build/css/" );
	indexFileContent += `@import "./${ folder }.css";\n`;
} );
indexFileContent += "\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";

// Write index.css file.
fs.writeFileSync( path.join( __dirname, "../build/css/index.css" ), indexFileContent );
