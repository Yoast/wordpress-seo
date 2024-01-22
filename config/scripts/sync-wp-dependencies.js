/**
 * This script is used to sync the WordPress dependencies in our package.json files with the versions in their package.json.
 *
 * Usage:
 * $ node config/scripts/sync-wp-dependencies.js [packageFolder1] [packageFolder2] ...
 * If no packageFolders are specified, all packages will be updated.
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

const packageAllowList = [
	"@wordpress/a11y",
	"@wordpress/api-fetch",
	"@wordpress/block-editor",
	"@wordpress/blocks",
	"@wordpress/components",
	"@wordpress/compose",
	"@wordpress/data",
	"@wordpress/dom-ready",
	"@wordpress/element",
	"@wordpress/hooks",
	"@wordpress/html-entities",
	"@wordpress/i18n",
	"@wordpress/is-shallow-equal",
	"@wordpress/plugins",
	"@wordpress/rich-text",
	"@wordpress/server-side-render",
	"@wordpress/url",
];

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
 * @param {Object|Object<string,string>} dependencies The dependencies to filter.
 * @param {string[]} allowList The allowList to filter with.
 * @returns {string[]} The filtered dependencies.
 */
const filterDependenciesFromPackageJson = ( dependencies, allowList ) => {
	return Object.keys( dependencies ).filter( ( dependency ) => allowList.includes( dependency ) );
};

/**
 * Gets the dependencies with the wanted versions.
 * @param {string[]} dependencies The dependencies we want to update.
 * @param {Object|Object<string,string>} listedVersions The versions of the dependencies we want to update.
 * @returns {string[]} The dependencies with the wanted versions.
 */
const getDependenciesWithWantedVersions = ( dependencies, listedVersions ) => {
	return dependencies.map( ( dependency ) => ( `${ dependency }@${ listedVersions[ dependency ] }` ) );
};

/**
 * Syncs the dependencies for the specified package.
 * @param {string} packageFolder The package to sync the dependencies for.
 * @param {Object|Object<string,string>} wpDependencies The WordPress dependencies to sync with.
 * @returns {Promise<void>} A promise that resolves when the dependencies are synced.
 */
const syncPackageDependenciesFor = async( packageFolder, wpDependencies ) => {
	const packageJson = getPackageJsonForPackage( packageFolder );
	const dependenciesToUpdate = filterDependenciesFromPackageJson( getDependenciesFromPackageJson( packageJson ), packageAllowList );
	const dependenciesWithWantedVersions = getDependenciesWithWantedVersions( dependenciesToUpdate, wpDependencies );

	if ( dependenciesWithWantedVersions.length === 0 ) {
		console.info( "No WordPress dependencies found in:", packageJson.name );
		return;
	}

	console.log( "===================================" );
	console.log( `yarn workspace ${ packageJson.name } add ${ dependenciesWithWantedVersions.join( " " ) }` );
	try {
		execSync( `yarn workspace ${ packageJson.name } add ${ dependenciesWithWantedVersions.join( " " ) }`, { stdio: "inherit" } );
	} catch ( e ) {
		console.error( "Error updating dependencies for:", packageJson.name );
	}
};

/**
 * Gets the package folders from the process arguments.
 * Defaults to all packages if no arguments are provided.
 * Filters out folders that don't have a package.json.
 * @returns {string[]} Valid package folders.
 */
const getPackageFoldersFromArguments = () => {
	let packages = process.argv.slice( 2 );
	if ( packages.length === 0 ) {
		packages = readdirSync( "./packages" );
	}
	return packages.filter( ( packageFolder ) => existsSync( `./packages/${ packageFolder }/package.json` ) );
};

const syncPackageDependencies = async() => {
	const packageFolders = getPackageFoldersFromArguments();
	if ( packageFolders.length === 0 ) {
		console.error( "No valid package folders found" );
		return;
	}

	const lowestSupportedWordPressVersion = getLowestSupportedWordPressVersion();
	console.log( "Lowest supported WordPress version:", lowestSupportedWordPressVersion );
	console.log( "===================================" );

	const wpDependencies = getDependenciesFromPackageJson( await getWordPressPackageJson( lowestSupportedWordPressVersion ) );

	packageFolders.forEach( ( packageFolder ) => {
		syncPackageDependenciesFor( packageFolder, wpDependencies );
	} );
};

syncPackageDependencies();
