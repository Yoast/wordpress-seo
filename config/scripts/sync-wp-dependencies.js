/* eslint-disable no-console */
/**
 * This script is used to sync the WordPress dependencies in our package.json files with the versions in their package.json.
 *
 * Usage:
 * $ node config/scripts/sync-wp-dependencies.js [--mod=modifier] [packageFolder1] [packageFolder2] ...
 * If no packageFolders are specified, all packages will be updated.
 * If --mod is specified, it will be used as the version modifier for the dependencies.
 * The modifier can be ^, ~, or nothing. The default is ^.
 * - "" matches exact, e.g. "1.2.3"
 * - "^" matches minor releases, e.g. "1.0" or "1.0.x" or "~1.0.4"
 * - "~" matches patch releases, e.g. "1" or "1.x" or "^1.0.4"
 *
 * What does it do?
 * Steps:
 * 1. Get the lowest supported WordPress version from the PHP file.
 * 2. Get the package.json from the WordPress repository, using the WP version found in step 1 as tag.
 * 3. Extract the versions of the dependencies (that we care about) from the package.json from the WordPress repository.
 * 4. Update our packages with the versions from the WordPress package.json.
 * 5. Optionally, we could try and fix some obvious dependency errors we know about.
 */
const { existsSync, readFileSync, readdirSync } = require( "fs" );
const { get } = require( "https" );
const { execSync } = require( "child_process" );

/**
 * These are the dependencies we want to sync with the WordPress package.json.
 * When using @wordpress/dependency-extraction-webpack-plugin in our Webpack config, these dependencies are extracted.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/README.md#behavior-with-scripts
 */
const WP_PACKAGES_ALLOW_LIST = [
	"@babel/runtime/regenerator",
	"@wordpress/a11y",
	"@wordpress/annotations",
	"@wordpress/api-fetch",
	"@wordpress/autop",
	"@wordpress/blob",
	"@wordpress/block-directory",
	"@wordpress/block-editor",
	"@wordpress/block-library",
	"@wordpress/block-serialization-default-parser",
	"@wordpress/blocks",
	"@wordpress/commands",
	"@wordpress/components",
	"@wordpress/compose",
	"@wordpress/core-commands",
	"@wordpress/core-data",
	"@wordpress/customize-widgets",
	"@wordpress/data",
	"@wordpress/data-controls",
	"@wordpress/date",
	"@wordpress/deprecated",
	"@wordpress/dom",
	"@wordpress/dom-ready",
	"@wordpress/edit-post",
	"@wordpress/edit-site",
	"@wordpress/edit-widgets",
	"@wordpress/editor",
	"@wordpress/element",
	"@wordpress/escape-html",
	"@wordpress/format-library",
	"@wordpress/hooks",
	"@wordpress/html-entities",
	"@wordpress/i18n",
	"@wordpress/icons",
	"@wordpress/interface",
	"@wordpress/is-shallow-equal",
	"@wordpress/keyboard-shortcuts",
	"@wordpress/keycodes",
	"@wordpress/list-reusable-blocks",
	"@wordpress/media-utils",
	"@wordpress/notices",
	"@wordpress/nux",
	"@wordpress/plugins",
	"@wordpress/preferences",
	"@wordpress/preferences-persistence",
	"@wordpress/primitives",
	"@wordpress/priority-queue",
	"@wordpress/private-apis",
	"@wordpress/redux-routine",
	"@wordpress/reusable-blocks",
	"@wordpress/rich-text",
	"@wordpress/router",
	"@wordpress/server-side-render",
	"@wordpress/shortcode",
	"@wordpress/style-engine",
	"@wordpress/token-list",
	"@wordpress/url",
	"@wordpress/viewport",
	"@wordpress/warning",
	"@wordpress/widgets",
	"@wordpress/wordcount",
	"jquery",
	"lodash",
	"moment",
	"react",
	"react-dom",
];

// These packages are considered tooling, and not meant to load into a WordPress environment.
const PACKAGE_FOLDER_DISALLOW_LIST = [
	"babel-preset",
	"browserslist-config",
	"e2e-tests",
	"eslint",
	"jest-preset",
	"postcss-preset",
	"tailwindcss-preset",
];

/**
 * @typedef {""|"^"|"~"} VersionModifier
 * The version modifier to use for the version.
 * - "" matches exact, e.g. "1.2.3"
 * - "^" matches minor releases, e.g. "1.0" or "1.0.x" or "~1.0.4"
 * - "~" matches patch releases, e.g. "1" or "1.x" or "^1.0.4"
 */

/**
 * Gets the lowest supported WordPress version.
 * @returns {null|string} The lowest supported WordPress version or null.
 */
const getLowestSupportedWordPressVersion = () => {
	const data = readFileSync( "./wp-seo.php", "utf8" );

	// Get the latest version number from the PHP file.
	const match = data.match( /Requires at least: (\d+\.\d+)/ );
	if ( match && match.length > 0 ) {
		return match[ 1 ];
	}

	console.error( "Lowest supported WordPress version not found" );
	return null;
};

/**
 * Fetches the data from the specified URL.
 * @param {string} url The URL to fetch the data from.
 * @returns {Promise<any|e>} A promise of the data or a reject with the error.
 */
const fetchData = ( url ) => new Promise( ( resolve, reject ) => {
	// Get the package.json from the WordPress repository.
	get( url, ( res ) => {
		let data = "";

		res.on( "data", ( chunk ) => {
			data += chunk;
		} );
		res.on( "end", () => resolve( data ) );
	} ).on( "error", ( e ) => reject( e ) );
} );

/**
 * Tries to parse the JSON string.
 * @param {string} json The JSON string to parse.
 * @returns {any|null} The parse result or null.
 */
const tryJsonParse = ( json ) => {
	try {
		return JSON.parse( json );
	} catch ( e ) {
		return null;
	}
};

/**
 * Gets the parsed WordPress package.json.
 * @param {string} wpVersion The WordPress version to get the dependencies for.
 * @returns {Promise<Object<string, string>|null>} A promise of the dependencies or null.
 */
const getWordPressPackageJson = ( wpVersion ) => {
	const url = `https://raw.githubusercontent.com/WordPress/wordpress-develop/${ wpVersion }/package.json`;

	// Perform the request and process the data.
	return new Promise( ( resolve ) => {
		fetchData( url )
			.then( ( data ) => resolve( tryJsonParse( data ) ) )
			.catch( ( e ) => {
				console.error( "Error fetching URL", url, e );
				resolve( null );
			} );
	} );
};

/**
 * Gets the dependencies from the package.json of the specified package.
 * @param {string} packageName The package to get the dependencies for.
 * @returns {Object<string,string>|null} The dependencies or null.
 */
const getPackageJsonForPackage = ( packageName ) => {
	const data = readFileSync( `./packages/${ packageName }/package.json`, "utf8" );
	return tryJsonParse( data );
};

/**
 * Gets the dependencies from the specified package.json.
 * Doing this instead of optional chaining, because ESLint doesn't seem to like it.
 * @param {Object} packageJson The package.json to get the dependencies from.
 * @returns {{}|Object<string,string>} The dependencies or an empty object.
 */
const getDependenciesFromPackageJson = ( packageJson ) => {
	if ( ! packageJson || ! packageJson.dependencies ) {
		return {};
	}
	return packageJson.dependencies;
};

/**
 * Filters the dependencies, based on the allowList.
 * @param {string[]} dependencies The dependencies to filter.
 * @param {string[]} allowList The allowList to filter with.
 * @returns {string[]} The filtered dependencies.
 */
const filterDependencies = ( dependencies, allowList ) => {
	return dependencies.filter( ( dependency ) => allowList.includes( dependency ) );
};

/**
 * Gets the dependencies with the wanted versions for the specified package.
 * @param {Object<string,string>|null} packageJson The packageJson to sync the dependencies for.
 * @param {Object|Object<string,string>} wpDependencies The WordPress dependencies to sync with.
 * @returns {string[]} The dependencies to update for the package.
 */
const getDependenciesToUpdateForPackage = ( packageJson, wpDependencies ) => {
	let dependenciesToUpdate = Object.keys( getDependenciesFromPackageJson( packageJson ) );
	// Filter out the dependencies we don't care about.
	dependenciesToUpdate = filterDependencies( dependenciesToUpdate, WP_PACKAGES_ALLOW_LIST );
	// Filter out the dependencies that are unknown to WordPress.
	return filterDependencies( dependenciesToUpdate, Object.keys( wpDependencies ) );
};

/**
 * Syncs the dependencies for the specified package.
 * @param {string} packageFolder The package to sync the dependencies for.
 * @param {Object|Object<string,string>} wpDependencies The WordPress dependencies to sync with.
 * @param {VersionModifier} modifier The modifier to use for the version.
 * @returns {Promise<boolean>} A promise that resolves when the dependencies are synced.
 */
const syncPackageDependenciesFor = async( packageFolder, wpDependencies, modifier ) => {
	const packageJson = getPackageJsonForPackage( packageFolder );
	const dependenciesToUpdate = getDependenciesToUpdateForPackage( packageJson, wpDependencies );
	console.log( "=============================================" );
	console.log( packageJson.name );
	const isUpToDate = [];
	const dependenciesWithWantedVersions = dependenciesToUpdate.map( ( dependency ) => {
		const version = [ modifier, wpDependencies[ dependency ] ].join( "" );
		if ( packageJson.dependencies[ dependency ] === version ) {
			isUpToDate.push( [ dependency, version ].join( "@" ) );
			// If the version is already the same, we don't need to update it.
			return null;
		}
		return [ dependency, version ].join( "@" );
	} ).filter( Boolean );
	if ( isUpToDate.length > 0 ) {
		console.log( "Already up to date:", isUpToDate.join( ", " ) );
	}

	if ( dependenciesWithWantedVersions.length === 0 ) {
		console.log( "No WordPress dependencies to sync." );
		return true;
	}

	const command = `yarn workspace ${ packageJson.name } add ${ dependenciesWithWantedVersions.join( " " ) }`;
	console.log( "=============================================" );
	console.log( command );
	try {
		execSync( command, { stdio: "inherit" } );
		return true;
	} catch ( e ) {
		console.error( "Error updating dependencies for:", packageJson.name );
		return false;
	}
};

/**
 * Create the options from the process arguments.
 *
 * Modifier:
 * Defaults to "^" if no modifier is provided.
 *
 * PackageFolders:
 * Defaults to every possible folder in "./packages" if no arguments are provided.
 * Filters out disallowed folders, or that don't have a package.json.
 *
 * @returns {{modifier: VersionModifier, packageFolders: string[]}} The options.
 */
const getOptionsFromArguments = () => {
	const args = process.argv.slice( 2 );
	const options = {
		modifier: "^",
		packageFolders: [],
	};

	// Handle modifier.
	const modifierIndex = args.findIndex( ( arg ) => arg.startsWith( "--mod=" ) );
	if ( modifierIndex !== -1 ) {
		const modifier = args[ modifierIndex ].split( "=" )[ 1 ];
		if ( [ "", "^", "~" ].includes( modifier ) ) {
			options.modifier = modifier;
		}

		// Remove the modifier argument from the args array.
		args.splice( modifierIndex, 1 );
	}

	// Handle package folders.
	// If no package folders are specified, we default to all packages.
	options.packageFolders = args.length === 0 ? readdirSync( "./packages" ) : args;
	options.packageFolders = options.packageFolders.filter( ( packageFolder ) => (
		// Ignore folders that are not packages that run inside a WordPress environment.
		! PACKAGE_FOLDER_DISALLOW_LIST.includes( packageFolder ) &&
		// Ignore folders that don't have a package.json.
		existsSync( `./packages/${ packageFolder }/package.json` )
	) );

	return options;
};

/**
 * Syncs the WordPress dependencies for the specified packages (in command).
 * @returns {Promise<void>} A promise that resolves when the dependencies are synced.
 */
const syncPackageDependencies = async() => {
	const { modifier, packageFolders } = getOptionsFromArguments();
	if ( packageFolders.length === 0 ) {
		console.error( "No valid package folders found" );
		return;
	}

	const lowestSupportedWordPressVersion = getLowestSupportedWordPressVersion();
	console.log( "Lowest supported WordPress version:", lowestSupportedWordPressVersion );

	const wpDependencies = getDependenciesFromPackageJson( await getWordPressPackageJson( lowestSupportedWordPressVersion ) );

	const result = {};
	for ( const packageFolder of packageFolders ) {
		result[ packageFolder ] = await syncPackageDependenciesFor( packageFolder, wpDependencies, modifier );
	}

	console.log( "=============================================" );
	console.log( "Result:" );
	const successful = Object.keys( result ).filter( ( packageFolder ) => result[ packageFolder ] );
	if ( successful.length > 0 ) {
		console.log( "Successfully synced:", Object.values( successful ).join( ", " ) );
	}
	const failure = Object.keys( result ).filter( ( packageFolder ) => ! result[ packageFolder ] );
	if ( failure.length > 0 ) {
		console.log( "Errors occurred in:", Object.values( failure ).join( ", " ) );
	}
};

syncPackageDependencies();
