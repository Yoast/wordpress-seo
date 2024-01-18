/**
 * This script is used to sync the WordPress dependencies in our package.json files with the versions in their package.json.
 *
 * Steps:
 * 1. Get the lowest supported WordPress version from the PHP file.
 * 2. Get the package.json from the WordPress repository, using the WP version found in step 1 as tag.
 * 3. Extract the versions of the dependencies (that we care about) from the package.json from the WordPress repository.
 * 4. Update our packages with the versions from the WordPress package.json.
 * 5. Optionally, we could try and fix some obvious dependency errors we know about.
 */
const fs = require( "fs" );
const https = require( "https" );

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
	const data = fs.readFileSync( "./wp-seo.php", "utf8" );

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
	https.get( url, ( res ) => {
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
	const data = fs.readFileSync( `./packages/${ packageName }/package.json`, "utf8" );
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
 * Gets the yarn update command parameter.
 * @param {string[]} wantedDependencies The dependencies we want to update.
 * @param {Object|Object<string,string>} listedVersions The versions of the dependencies we want to update.
 * @returns {string} The yarn update command parameter.
 */
const getYarnUpdateCommandParameter = ( wantedDependencies, listedVersions ) => {
	return wantedDependencies.map( ( dependency ) => ( `${ dependency }@${ listedVersions[ dependency ] }` ) ).join( " " );
};

const syncPackageDependenciesFor = async( packageFolder ) => {
	console.log( `Syncing dependencies for: packages/${ packageFolder }` );

	const lowestSupportedWordPressVersion = getLowestSupportedWordPressVersion();
	console.log( `Lowest supported WordPress version: ${ lowestSupportedWordPressVersion }` );

	const wpDependencies = getDependenciesFromPackageJson( await getWordPressPackageJson( lowestSupportedWordPressVersion ) );
	const packageJson = getPackageJsonForPackage( packageFolder );
	const dependenciesToUpdate = filterDependenciesFromPackageJson( getDependenciesFromPackageJson( packageJson ), packageAllowList );
	const yarnUpdateCommandParameter = getYarnUpdateCommandParameter( dependenciesToUpdate, wpDependencies );

	console.log( "\nRun the command:" );
	console.log( `yarn workspace ${ packageJson.name } add ${ yarnUpdateCommandParameter }` );
};

syncPackageDependenciesFor( process.argv[ 2 ] || "js" );
