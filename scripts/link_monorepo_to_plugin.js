#!/usr/local/bin/node
const fs = require( "fs" );
const path = require( "path" );
const readlineSync = require( "readline-sync" );
const execSync = require( "child_process" ).execSync;

const AUTO_CHECKOUT = process.env.AUTO_CHECKOUT_MONOREPO_BRANCH;
const TRAVIS_BRANCH = process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH;

let monorepoLocation;

/**
 * Get the .yoast configuration contents.
 *
 * @returns {Object} The yoast configuration object.
 */
function getConfiguration() {
	try {
		return JSON.parse( fs.readFileSync( ".yoast", "utf8" ) ) || {};
	} catch ( e ) {
		return {};
	}
}

/**
 * Saves the configuration to the configuration file.
 *
 * @param {Object} configuration The new configuration.
 *
 * @returns {void}
 */
function saveConfiguration( configuration ) {
	fs.writeFileSync( ".yoast", JSON.stringify( configuration ), "utf8" );
}

/**
 * Function to check if the given location is a valid location for the monorepo.
 *
 * @param {string} location The location that is checked.
 *
 * @returns {boolean} Returns true if the location exists and has a remote.origin.url that includes Yoast/javascript.
 */
function isValidMonorepoLocation( location ) {
	if ( ! location ) {
		return false;
	}

	if ( ! fs.existsSync( location ) ) {
		return false;
	}

	try {
		return execSync( `cd ${ location } && git config --get remote.origin.url` )
			.toString()
			.toLowerCase()
			.includes( "yoast/javascript" );
	} catch ( e ) {
		return false;
	}
}

/**
 * Gets the monorepo-location from the .yoast file or asks the user for a location if either the file does not exist or the right key is not there.
 * If a .yoast file exists but the key "monorepo-location" is not there, this function adds a new key to the file without overwriting existing values.
 *
 * @returns {string} The monorepo-location.
 */
function getMonorepoLocationFromFile() {
	if ( monorepoLocation ) {
		return monorepoLocation;
	}

	const yoastConfig = getConfiguration();

	let location = yoastConfig[ "monorepo-location" ];

	if ( isValidMonorepoLocation( location ) ) {
		return location;
	}

	while ( ! isValidMonorepoLocation( location ) ) {
		location = readlineSync.question( "The location in your .yoast file or the location you've provided is not valid. " +
			"Please provide the location of your javascript clone." +
			"Where is your monorepo git clone located? " +
			"Please provide an absolute path or a path relative to the current directory '" + process.cwd() + "." +
			" (note that ~ is not supported)'.\n" );
		// Ensure compatibility with Windows.
		location = path.normalize( location );
	}

	const newConfig = Object.assign( {}, yoastConfig, { "monorepo-location": location } );
	try {
		saveConfiguration( newConfig );
	} catch ( e ) {
		// Ignore not being able to write. Just return the location.
	}

	return location;
}

const NO_OUTPUT = { stdio: [ null, null, null ] };

/**
 * Creates a command that can be used for executing commands in the monorepoLocation.
 *
 * @param {string} cmd The command that is executed in the monorepoLocation.
 *
 * @returns {Buffer | string} A buffer with the result or a string when it is a simple command.
 */
const execMonorepo = cmd => execSync( cmd, { cwd: getMonorepoLocationFromFile() } );

/**
 * Creates a command that can be used for executing commands in the monorepoLocation.
 * This version does not output anything to the console.
 *
 * @param {string} cmd The command that is executed in the monorepoLocation.
 *
 * @returns {Buffer | string} Outputs nothing.
 */
const execMonorepoNoOutput = cmd => execSync( cmd, { cwd: getMonorepoLocationFromFile(), NO_OUTPUT } );

/**
 * Unlink all the yoast packages that are linked in the ~/.config/yarn/link directory.
 * Note: We cannot use "~" in the cwd field so we have to use a little workaround.
 *
 * @returns {void}
 */
function unlinkAllYoastPackages() {
	const homeDirectory = execSync( "echo $HOME" ).toString().split( "\n" )[ 0 ];
	const yarnLinkDir = homeDirectory + "/.config/yarn/link";
	let linkedYoastPackages;

	try {
		linkedYoastPackages = execSync( "ls", { cwd: yarnLinkDir } ).toString().split( "\n" ).filter( value => value.includes( "yoast" ) );
	} catch ( e ) {
		linkedYoastPackages = [];
	}

	linkedYoastPackages.forEach( linkedYoastPackage => {
		execSync( `rm -rf ${ linkedYoastPackage }`, { cwd: yarnLinkDir } );
	} );

	// Remove the symlinks from node_modules.
	execSync( "rm -rf *yoast*", { cwd: "./node_modules/" } );
}

/**
 * Checkout the right branch on the monorepo.
 *
 * @param {string} yoastSEOBranch The Yoast SEO branch.
 * @returns {string} The checked out monorepo branch.
 */
function checkoutMonorepoBranch( yoastSEOBranch ) {
	let monorepoBranch = yoastSEOBranch === "trunk" ? "develop" : yoastSEOBranch;

	try {
		execMonorepoNoOutput( `git checkout ${ monorepoBranch }` );
	} catch ( error ) {
		monorepoBranch = "develop";
		execMonorepoNoOutput( `git checkout ${ monorepoBranch }` );
	}

	return monorepoBranch;
}

/**
 * Console logs with a bright font.
 *
 * @param message The message to log.
 */
function log( message ) {
	// eslint-disable-next-line no-console
	console.log( "\x1b[1m" + message + "\x1b[0m" );
}

/**
 * Console logs with yellow font for warnings.
 *
 * @param {string} message The message to log.
 *
 * @returns {void}
 */
function warning( message ) {
	// eslint-disable-next-line no-console
	console.log( "\x1b[33m%s\x1b[0m", message );
}

// Start the script.
log( `Your monorepo is located in "${ getMonorepoLocationFromFile() }". ` );

log( "Fetching branches of the monorepo." );
execMonorepoNoOutput( "git fetch" );
if ( AUTO_CHECKOUT ) {
	const monorepoBranch = checkoutMonorepoBranch( TRAVIS_BRANCH );
	log( "Checking out " + monorepoBranch + " on the monorepo." );
}

log( "Pulling the latest monorepo changes." );
try {
	execMonorepoNoOutput( "git pull 2>/dev/null" );
} catch ( error ) {
	// No remote is specified.
	warning( "git could not pull changes from the remote repo.\nIf you are working on a local version of the javascript branch, this is expected behaviour.\nContinuing..." )
}

log( "Unlinking previously linked Yoast packages from Yarn." );
unlinkAllYoastPackages();

log( "Running 'yarn install' in the monorepo, this may take a while." );
execMonorepoNoOutput( "yarn install" );

log( "Linking all monorepo packages." );
execMonorepoNoOutput( "yarn link-all" );

const packages = execMonorepo( "ls packages" ).toString().split( "\n" ).filter( value => value !== "" );
packages.forEach( ( yoastPackage ) => {
	try {
		execSync( `yarn link @yoast/${ yoastPackage }`, NO_OUTPUT );
	} catch ( e ) {
		if ( ! [ "eslint", "yoast-components", "yoast-social-previews", "yoastseo" ].includes( yoastPackage ) ) {
			log( `Package @yoast/${ yoastPackage } could not be linked.` );
		}
	}
} );

log( "Linking legacy Yoast packages." );
execSync( "yarn link yoastseo && yarn link yoast-components", NO_OUTPUT );

log( "Reinstall any Yoast packages that were unintentionally removed and are not linked after the linking process." +
	" This could take a while..." );
execSync( "yarn install --check-files" );
