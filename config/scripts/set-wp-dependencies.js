const fetch = require( "node-fetch" );
const { existsSync, readdirSync, readFileSync, writeFileSync } = require( "fs" );
const path = require( "path" );


/**
 * Updates package.json versions to the latest released WordPress versions.
 *
 * @returns {void}
 */
async function updateVersions() {
	const response  = await fetch( "https://raw.githubusercontent.com/WordPress/wordpress-develop/master/package.json" );
	const gbpackage = await response.json();
	const gbdependencies = Object.assign( {}, gbpackage.devDependencies, gbpackage.dependencies );

	const directories = readdirSync( path.join( __dirname, "/../../packages" ), { withFileTypes: true } )
		.filter( dir => dir.isDirectory() )
		.map( dir => dir.name );

	// Add the root package.json.
	directories.push( ".." );

	for ( const directory of directories ) {
		const filename = path.join( __dirname, "/../../packages/", directory, "/package.json" );
		if ( ! existsSync( filename ) ) {
			continue;
		}
		const packageJson = JSON.parse( readFileSync( filename ) );
		for ( const dependency in packageJson.dependencies ) {
			if ( ! gbdependencies[ dependency ] ) {
				continue;
			}
			packageJson.dependencies[ dependency ] = gbdependencies[ dependency ];
		}
		for ( const dependency in packageJson.devDependencies ) {
			if ( ! gbdependencies[ dependency ] ) {
				continue;
			}
			packageJson.devDependencies[ dependency ] = gbdependencies[ dependency ];
		}
		if ( directory === ".." ) {
			Object.assign( packageJson.resolutions, gbpackage.dependencies );
		}
		writeFileSync( filename, JSON.stringify( packageJson, null, 2 ) + "\n" );
	}
}

updateVersions();
