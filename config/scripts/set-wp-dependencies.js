const fetch = require( "node-fetch" );
const { existsSync, readdirSync, readFileSync, writeFileSync } = require( "fs" );
const path = require( "path" );


/**
 * Updates versions.
 *
 * @returns {void}
 */
async function updateVersions() {
	const response  = await fetch( "https://raw.githubusercontent.com/WordPress/wordpress-develop/master/package.json" );
	const gbpackage = await response.json();

	const directories = readdirSync( path.join( __dirname, "/../../packages" ), { withFileTypes: true } )
		.filter( dir => dir.isDirectory() )
		.map( dir => dir.name );

	for ( const directory of directories ) {
		let changed = false;
		const filename = path.join( __dirname, "/../../packages/", directory, "/package.json" );
		if ( ! existsSync( filename ) ) {
			continue;
		}
		const packageJson = JSON.parse( readFileSync( filename ) );
		for ( const dependency in packageJson.dependencies ) {
			if ( ! gbpackage.dependencies[ dependency ] ) {
				continue;
			}
			changed = true;
			packageJson.dependencies[ dependency ] = gbpackage.dependencies[ dependency ];
		}
		if ( changed ) {
			writeFileSync( filename, JSON.stringify( packageJson, null, 2 ) );
		}
	}
}

updateVersions();
