/**
 * Generates the public `yoastseo/languages/<language>` entry points.
 *
 * Writes one `languages/<language>/package.json` per folder in `src/languageProcessing/languages`, so the list
 * always matches the source. `main` points to the CommonJS build and `module` to the ESM build.
 */
const { mkdirSync, readdirSync, rmSync, writeFileSync } = require( "fs" );
const { join } = require( "path" );

const root = join( __dirname, ".." );
const outputDir = join( root, "languages" );

const languages = readdirSync( join( root, "src/languageProcessing/languages" ), { withFileTypes: true } )
	.filter( entry => entry.isDirectory() )
	.map( entry => entry.name );

rmSync( outputDir, { recursive: true, force: true } );

languages.forEach( language => {
	const researcherPath = `languageProcessing/languages/${ language }/Researcher.js`;
	const packageJson = {
		main: `../../build/${ researcherPath }`,
		module: `../../esm/${ researcherPath }`,
		sideEffects: false,
	};

	mkdirSync( join( outputDir, language ), { recursive: true } );
	writeFileSync( join( outputDir, language, "package.json" ), JSON.stringify( packageJson, null, 2 ) + "\n" );
} );
