#!/usr/local/bin/node
const fs = require( "fs" );
const readlineSync = require( "readline-sync" );
const execSync = require( "child_process" ).execSync;

const IS_TRAVIS = process.env.CI === "1";

let monorepoLocation;

/**
 * Gets the monorepo-location from the .yoast file or asks the user for a location if either the file does not exist or the right key is not there.
 * If a .yoast file exists but the key "monorepo-location" is not there, this function adds a new key to the file without overwriting existing values.
 *
 * @returns {string} The monorepo-location.
 */
function get_monorepo_location_from_file() {
	if ( monorepoLocation ) {
		return monorepoLocation;
	}

	const yoastConfig = get_yoast_config();

	let location = yoastConfig[ "monorepo-location" ];

	if ( is_valid_monorepo_location( location ) ) {
		return location;
	}

	while ( ! is_valid_monorepo_location( location ) ) {
		console.log( "The location you've in your .yoast file or the location you've provided is not valid. Please provide a new location for your javascript clone." );
		location = readlineSync.question( "Where is your monorepo git clone located? Please provide an absolute path or a path relative to the current directory '" + process.cwd() + "'.\n" );
	}

	const newConfig = Object.assign( {}, yoastConfig, { location } );
	try {
		save_configuration( newConfig );
	} catch ( e ) {
		// Ignore not being able to write. Just return the location.
	}

	return location;
}

const NO_OUTPUT = { stdio: [ null, null, null ] };
// Create two commands that can be used for executing commands in the monorepoLocation.
const execMonorepo = cmd => execSync( cmd, { cwd: get_monorepo_location_from_file() } );
const execMonorepoNoOutput = cmd => execSync( cmd, { cwd: get_monorepo_location_from_file(), NO_OUTPUT } );

/**
 * Get the .yoast configuration contents.
 *
 * @returns {Object} The yoast configuration object.
 */
function get_yoast_config() {
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
function save_configuration( configuration ) {
	fs.writeFileSync( ".yoast", JSON.stringify( configuration ), "utf8" );
}

/**
 * Function to check if the given location is a valid location for the monorepo.
 *
 * @param {string} location The location that is checked.
 *
 * @returns {boolean} Returns true if the location exists and has a remote.origin.url that includes Yoast/javascript.
 */
function is_valid_monorepo_location( location ) {
	if ( ! location ) {
		return false;
	}

	if ( ! fs.existsSync( location ) ) {
		return false;
	}
	return execSync( `cd ${ location }; git config --get remote.origin.url;` ).includes( "Yoast/javascript" );

}


/**
 * Unlink all the yoast packages that are linked in the ~/.config/yarn/link directory.
 * Note: We cannot use "~" in the cwd field so we have to use a little workaround.
 */
function unlink_all_yoast_packages() {
	const homeDirectory = execSync( `echo $HOME` ).toString().split( "\n" )[ 0 ];
	const yarnLinkDir = homeDirectory + "/.config/yarn/link";

	const toRemove = execSync( `ls`, { cwd: yarnLinkDir } ).toString().split( "\n" ).filter( value => value.includes( "yoast" ) );

	for ( let x in toRemove ) {
		execSync( `rm -rf ${ toRemove[ x ] }`, { cwd: yarnLinkDir } );
	}

	// Remove the symlinks from node_modules.
	execSync( `rm -rf *yoast*`, { cwd: "./node_modules/" } );

	console.log( "All previously linked yoast packages have been unlinked." );
}

/**
 * This function checks if the CI flag is set. If so, it returns either the TRAVIS_BRANCH or the TRAVIS_PULL_REQUEST_BRANCH.
 * Otherwise, this returns the currently checked out branch in the current directory.
 *
 * @returns {string} The checkoutBranch;
 */
function get_yoast_seo_branch() {
	if ( IS_TRAVIS ) {
		return get_yoast_seo_travis_branch();
	}

	return execSync( `git branch | grep \\* | cut -d " " -f2-` ).toString( "utf8" ).split( "\n" )[ 0 ];
}

function get_yoast_seo_travis_branch(){
	return process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH;
}

function prepare_monorepo_state() {
	console.log( "Fetching the latest branches in the monorepo." );
	execMonorepoNoOutput( `git fetch` );

	if ( IS_TRAVIS ) {
		const yoast_seo_branch = get_yoast_seo_travis_branch();
		checkout_monorepo_branch( yoast_seo_branch );
	}

	execMonorepoNoOutput( `git pull` );
}

function checkout_monorepo_branch( yoast_seo_branch ) {
	const monorepo_branch = yoast_seo_branch === "trunk" ? "develop" : yoast_seo_branch;
	console.log( "Checking out " + monorepo_branch + " on the monorepo." );
	execMonorepoNoOutput( `git checkout ${ monorepo_branch }` );
}


console.log( `Your monorepo is located in "${ get_monorepo_location_from_file() }". ` );

prepare_monorepo_state();

const packages = execMonorepo( `ls packages` ).toString().split( "\n" ).filter( value => value !== "" );
unlink_all_yoast_packages();

execMonorepoNoOutput( `yarn link-all` );
console.log( "Packages have been linked inside the monorepo." );

for ( let x in packages ) {
	try {
		execSync( `yarn link @yoast/${ packages[ x ] }`, NO_OUTPUT );
	} catch ( e ) {
	}
}
console.log( "Successfully linked all new packages. Linking old format packages now." );
execSync( `yarn link yoastseo; yarn link yoast-components;`, NO_OUTPUT );
console.log( "Successfully linked all packages. Done." );
