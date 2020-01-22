#!/usr/local/bin/node
/* eslint-disable no-console */
const writeFileSync = require( "fs" ).writeFileSync;
const execSync = require( "child_process" ).execSync;

const NO_OUTPUT = { stdio: [ null, null, null ] };

/**
 * Gets a list of packages.
 *
 * @returns {string[]} The packages.
 */
function getPackages() {
	let list;

	console.info( "Collecting the packages" );
	console.group();

	try {
		list = execSync( "yarn lerna list --json | grep name -A 0", NO_OUTPUT )
			.toString()
			.split( "\n" )
			.filter( line => line !== "" )
			.map( line => line.replace( /\s+"name": "|",?/g, "" ) );
	} catch ( e ) {
		list = [];
	}

	console.info( "Found", list.length, "packages" );
	console.groupEnd();

	return list;
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
 * @param {string[]} packages The list of packages.
 *
 * @returns {{name: string, dependencyOf: string[]}[]} The list of dependencies.
 */
function createDependencyList( packages ) {
	const padAmount = packages.length % 10;

	console.info( "Fetching package dependencies:" );
	console.group();
	const list = packages.map( ( name, index ) => {
		console.info( `${ ( index + 1 ).toString().padStart( padAmount, "0" ) }/${ packages.length }: ${ name }` );
		return {
			name,
			dependencyOf: whyPackage( name ),
		};
	} );
	console.groupEnd();

	return list;
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
			.map( ( { name, dependencyOf } ) => {
				const deps = dependencyOf.length === 0 ? "-" : dependencyOf.join( "<br>" );
				return `| ${ name } | ${ deps } |`;
			} )
			.join( "\n" );
}

/**
 * Writes a file.
 *
 * @param {string} filename The filename of the file.
 * @param {string} data     The data to write.
 *
 * @returns {void}
 */
function writeFile( filename, data ) {
	try {
		writeFileSync( filename, data );
		console.info( `Created file: ${ filename }` );
	} catch ( e ) {
		console.error( `Something went wrong trying to write the file: ${ filename }` );
	}
}

const params = process.argv.splice( 2 );
let outputFilename = "dependencies.";
let outputData = createDependencyList( getPackages() );

if ( params.includes( "--markdown" ) ) {
	outputFilename += "md";
	console.info( "Converting to markdown data" );
	outputData = convertToMarkDown( outputData );
} else {
	outputFilename += "json";
	console.info( "Converting to plain text" );
	outputData = JSON.stringify( outputData, null, 2 );
}

writeFile( outputFilename, outputData );
