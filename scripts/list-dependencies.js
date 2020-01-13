#!/usr/local/bin/node
const writeFileSync = require( "fs" ).writeFileSync;
const execSync = require( "child_process" ).execSync;

const NO_OUTPUT = { stdio: [ null, null, null ] };

/**
 * Gets a list of packages.
 *
 * @returns {string[]} The packages.
 */
function getPackages() {
	try {
		return execSync( "yarn lerna list --json | grep name -A 0", NO_OUTPUT )
			.toString()
			.split( "\n" )
			.filter( line => line !== "" )
			.map( line => line.replace( /\s+"name": "|",?/g, "" ) );
	} catch ( e ) {
		return [];
	}
}

/**
 * Gets a list of dependencies for the given package.
 *
 * @param {string}  name              The package to check the dependencies for.
 * @param {boolean} [ignoreApps=true] Whether to ignore app dependencies.
 *
 * @returns {string[]} The packages.
 */
function whyPackage( name, ignoreApps = true ) {
	try {
		return execSync( `yarn why ${ name } | grep Hoisted -A 0`, NO_OUTPUT )
			.toString()
			.split( "\n" )
			.map( line => line.replace( /^\s+- Hoisted from "_project_#|"$/g, "" ) )
			.map( line => line.replace( /#/g, "/" ) )
			.map( line => line.replace( new RegExp( `/\?${ name }` ), "" ) )
			.filter( line => line !== "" && ( ! ignoreApps || ( ignoreApps && ! line.endsWith( "-app" ) ) ) )
			.sort();
	} catch ( e ) {
		return [];
	}
}

/**
 * Creates a list of dependencies.
 *
 * @returns {{name: string, dependencies: string[]}[]} The list of dependencies.
 */
function createDependencyList() {
	return getPackages().map( name => ( {
		name,
		dependencies: whyPackage( name )
	} ) );
}

/**
 * Converts a list of dependencies to markdown output.
 *
 * @param {{name: string, dependencies: string[]}[]} data The list of dependencies.
 *
 * @returns {string} The list of dependencies as a markdown string.
 */
function convertToMarkDown( data ) {
	return "| This package: | Is a dependency of: |\n|---|---|\n" +
		data
			.map( ( { name, dependencies } ) => {
				const deps = dependencies.length === 0 ? "-" : dependencies.join( "<br>" );
				return `| ${ name } | ${ deps } |`;
			} )
			.join( "\n" );
}

/**
 * Writes a file.
 *
 * @param {string} filename The filename of the file.
 * @param {string} data     The data to write.
 */
function writeFile( filename, data ) {
	try {
		writeFileSync( filename, data );
		console.log( `Created file: ${ filename }` );
	} catch ( e ) {
		console.error( `Something went wrong trying to write the file: ${ filename }` );
	}
}

const params = process.argv.splice( 2 );

let filename = "dependencies.";
let data = createDependencyList();

if ( params.includes( "--markdown" ) ) {
	filename += "md";
	data = convertToMarkDown( data );
} else {
	filename += "json";
	data = JSON.stringify( data, null, 2 );
}

writeFile( filename, data );
