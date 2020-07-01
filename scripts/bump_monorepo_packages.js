#!/usr/local/bin/node
const fs = require( "fs" );
const execSync = require( "child_process" ).execSync;

// Non-@yoast packages.
const legacyYoastPackages = [ "yoastseo", "eslint-config-yoast", "yoast-components" ];

// Console colors.
const CONSOLE_STYLE_BRIGHT = "\x1b[1m";
const CONSOLE_STYLE_RED = "\x1b[31m";
const CONSOLE_STYLE_RESET = "\x1b[0m";

/**
 * Console logs with a bright font.
 *
 * @param {string} message The message to log.
 *
 * @returns {void}
 */
function log( message ) {
	// eslint-disable-next-line no-console
	console.log( CONSOLE_STYLE_BRIGHT + message + CONSOLE_STYLE_RESET );
}

/**
 * Console logs with a bright red font.
 *
 * @param {string} message The message to log.
 *
 * @returns {void}
 */
function errorlog( message ) {
	// eslint-disable-next-line no-console
	console.log( CONSOLE_STYLE_BRIGHT + CONSOLE_STYLE_RED + message + CONSOLE_STYLE_RESET );
}

/**
 * Checks whether a package is a Yoast monorepo package.
 *
 * @param {string} packageName A package name.
 *
 * @returns {boolean} Whether or not a package is a Yoast package.
 */
function isYoastMonorepoPackage( packageName ) {
	return ( packageName.includes( "@yoast" ) && packageName !== "@yoast/grunt-plugin-tasks" ) || legacyYoastPackages.includes( packageName );
}

/**
 * Get a yarn add version string for a version number or constraint. Prefixes with "@" if a version is given.
 *
 * @param {string} version A version number or constraint.
 *
 * @returns {string} An @-prefixed version string.
 */
function getVersionString( version = "" ) {
	return version ? "@" + version : "";
}

/**
 * Installs Yarn packages.
 *
 * @param {string[]} packageNames The package names to install.
 * @param {string} version The version to install.
 * @param {string} flags A string of flags to pass to the Yarn add command.
 *
 * @returns {void}
 */
function addPackages( packageNames, version = "", flags = "" ) {
	const packageVersions = packageNames.map( packageName => packageName + getVersionString( version ) ).join( " " );
	const cmd = `yarn add ${ packageVersions } ${ flags }`;
	log( cmd );
	execSync( cmd );
}

/**
 * Installs Yarn packages. And retries each package individually on failure.
 * This is useful for when a single package fail to install.
 *
 * @param {string[]} packageNames The package names to install.
 * @param {string} version The version to install.
 * @param {string} flags A string of flags to pass to the Yarn add command.
 *
 * @returns {void}
 */
function addPackagesWithFailsafe( packageNames, version = "", flags = "" ) {
	try {
		addPackages( packageNames, version, flags );
	} catch ( e ) {
		errorlog( "Failed to install one of the packages. Trying to install packages individually" );
		packageNames.forEach( packageName => {
			try {
				addPackages( [ packageName ], version, flags );
			} catch ( err ) {
				errorlog( `Failed to install ${ packageName }${ getVersionString( version ) }` );
			}
		} );
	}
}

/**
 * Bumps the version all installed Yoast monorepo packages to the specified or latest version.
 *
 * @param {array} args CLI arguments, the first arg being the version number.
 *
 * @returns {void}
 */
function bumpVersions( args ) {
	const packages = JSON.parse( fs.readFileSync( "package.json", "utf8" ) ) || {};

	const installedYoastPackages = Object.keys( packages.dependencies || {} ).filter( isYoastMonorepoPackage );
	const installedDevYoastPackages = Object.keys( packages.devDependencies || {} ).filter( isYoastMonorepoPackage );

	const version = args[ 0 ];
	addPackagesWithFailsafe( installedYoastPackages, version );
	addPackagesWithFailsafe( installedDevYoastPackages, version, "--dev" );
}

bumpVersions( process.argv.slice( 2 ) );
