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

const wpPackagesToSync = [
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

const getLowestSupportedWordPressVersion = () => {
	const data = fs.readFileSync( "./wp-seo.php", "utf8" );

	// Get the latest version number from the PHP file.
	const match = data.match( /Requires at least: (\d+\.\d+)/ );
	if ( match ) {
		return match[ 1 ];
	}

	console.log( "No match found" );
	return null;
};

const getWordPressPackageJsonDependencies = ( wpVersion ) => {
	const url = `https://raw.githubusercontent.com/WordPress/wordpress-develop/${ wpVersion }/package.json`;

	const processData = ( data ) => {
		try {
			const json = JSON.parse( data );
			return json.dependencies;
		} catch ( e ) {
			console.error( "Error parsing JSON", data, e );
			return null;
		}
	};

	return new Promise( ( resolve ) => {
		// Get the package.json from the WordPress repository.
		https.get( url, ( res ) => {
			let data = "";

			res.on( "data", ( chunk ) => {
				data += chunk;
			} );
			res.on( "end", () => resolve( processData( data ) ) );
		} ).on( "error", ( err ) => {
			console.error( `Error: ${ err.message }` );
			resolve( null );
		} );
	} );
};

const getYarnUpdateCommandParameter = ( wantedDependencies, listedVersions ) => {
	return wantedDependencies.map( ( dependency ) => ( `${ dependency }@${ listedVersions[ dependency ] }` ) );
};

const syncPackageDependencies = async() => {
	const lowestSupportedWordPressVersion = getLowestSupportedWordPressVersion();
	console.log( `WP version: ${ lowestSupportedWordPressVersion }` );
	const wpDependencies = await getWordPressPackageJsonDependencies( lowestSupportedWordPressVersion );
	const yarnUpdateCommandParameter = getYarnUpdateCommandParameter( wpPackagesToSync, wpDependencies );

	console.log( `yarn add ${ yarnUpdateCommandParameter.join( " " ) }` );
};

syncPackageDependencies();
