/* eslint-disable no-console */
/**
 * Downloads pre-built packages from NPM instead of building from source.
 *
 * For each workspace package that has a "build" script and is not private,
 * this script checks if the exact version exists on NPM and downloads the
 * tarball to extract pre-built directories (build/, vendor/, images/, etc.).
 * Packages not found on NPM fall back to building from source via lerna.
 *
 * Usage:
 * $ node config/scripts/install-npm-builds.js [--dry-run]
 *
 * Options:
 * --dry-run  Show what would happen without downloading or building anything.
 */
const { existsSync, readFileSync, readdirSync, rmSync } = require( "fs" );
const { execSync } = require( "child_process" );
const path = require( "path" );
const fetch = require( "node-fetch" );
// eslint-disable-next-line import/no-extraneous-dependencies -- Transitive dependency, always available in node_modules.
const tar = require( "tar" );

const DRY_RUN = process.argv.includes( "--dry-run" );
const NPM_CONCURRENCY = 5;
const ROOT_DIR = path.resolve( __dirname, "../.." );
const PACKAGES_DIR = path.join( ROOT_DIR, "packages" );

/**
 * Discovers workspace packages that have a "build" script and are not private.
 *
 * @returns {Array<{name: string, version: string, dir: string, extractDirs: string[]}>} The buildable packages.
 */
const discoverBuildablePackages = () => {
	const folders = readdirSync( PACKAGES_DIR, { withFileTypes: true } )
		.filter( ( dirent ) => dirent.isDirectory() )
		.map( ( dirent ) => dirent.name );

	const packages = [];
	for ( const folder of folders ) {
		const pkgPath = path.join( PACKAGES_DIR, folder, "package.json" );
		if ( ! existsSync( pkgPath ) ) {
			continue;
		}

		const pkg = JSON.parse( readFileSync( pkgPath, "utf8" ) );
		if ( pkg.private ) {
			continue;
		}
		if ( ! pkg.scripts || ! pkg.scripts.build ) {
			continue;
		}

		// Determine which directories to extract from the tarball based on the "files" field.
		const extractDirs = ( pkg.files || [] )
			.filter( ( f ) => ! f.startsWith( "!" ) )
			.map( ( f ) => f.split( "/" )[ 0 ] )
			.filter( ( dir, i, arr ) => arr.indexOf( dir ) === i && ! dir.includes( "." ) );

		packages.push( {
			name: pkg.name,
			version: pkg.version,
			dir: path.join( PACKAGES_DIR, folder ),
			extractDirs,
		} );
	}

	return packages;
};

/**
 * Gets the tarball URL for a package version from the NPM registry.
 *
 * @param {string} name The package name.
 * @param {string} version The exact version to look up.
 * @returns {Promise<string|null>} The tarball URL, or null if not found.
 */
const getTarballUrl = async( name, version ) => {
	const encodedName = name.replace( "/", "%2f" );
	const url = `https://registry.npmjs.org/${ encodedName }/${ version }`;

	try {
		const response = await fetch( url );
		if ( ! response.ok ) {
			return null;
		}

		const data = await response.json();
		return data.dist && data.dist.tarball ? data.dist.tarball : null;
	} catch ( error ) {
		console.warn( `  Warning: failed to check NPM for ${ name }@${ version }: ${ error.message }` );
		return null;
	}
};

/**
 * Downloads and extracts specific directories from an NPM tarball.
 *
 * @param {string} tarballUrl The URL of the tarball to download.
 * @param {string} targetDir The package directory to extract into.
 * @param {string[]} dirs The directory names to extract from the tarball.
 * @returns {Promise<boolean>} Whether the extraction succeeded.
 */
const downloadAndExtract = async( tarballUrl, targetDir, dirs ) => {
	try {
		const response = await fetch( tarballUrl );
		if ( ! response.ok ) {
			console.warn( `  Warning: failed to download tarball (HTTP ${ response.status }).` );
			return false;
		}

		// Remove existing directories before extracting fresh copies.
		for ( const dir of dirs ) {
			const fullPath = path.join( targetDir, dir );
			if ( existsSync( fullPath ) ) {
				rmSync( fullPath, { recursive: true } );
			}
		}

		// Extract only the specified directories from the tarball.
		// NPM tarballs have a "package/" prefix that we strip.
		await new Promise( ( resolve, reject ) => {
			const extractor = tar.extract( {
				cwd: targetDir,
				strip: 1,
				filter: ( entryPath ) => {
					return dirs.some( ( dir ) => entryPath.startsWith( `package/${ dir }/` ) );
				},
			} );
			extractor.on( "end", resolve );
			extractor.on( "error", reject );
			response.body.pipe( extractor );
		} );

		return true;
	} catch ( error ) {
		console.warn( `  Warning: failed to extract tarball: ${ error.message }` );
		return false;
	}
};

/**
 * Processes items in parallel with limited concurrency.
 *
 * @param {Array} items The items to process.
 * @param {number} concurrency The maximum number of concurrent operations.
 * @param {Function} fn The async function to apply to each item.
 * @returns {Promise<Array>} The results in the same order as items.
 */
const parallelMap = async( items, concurrency, fn ) => {
	const results = [];
	let index = 0;

	const worker = async() => {
		while ( index < items.length ) {
			const i = index++;
			results[ i ] = await fn( items[ i ] );
		}
	};

	const workers = Array.from(
		{ length: Math.min( concurrency, items.length ) },
		() => worker()
	);
	await Promise.all( workers );
	return results;
};

/**
 * Builds packages from source using lerna.
 *
 * @param {Array<{name: string}>} packages The packages to build from source.
 * @returns {void}
 */
const buildFromSource = ( packages ) => {
	if ( packages.length === 0 ) {
		return;
	}

	const scopes = packages.map( ( pkg ) => `--scope=${ pkg.name }` ).join( " " );
	const command = `cross-env NODE_ENV=production lerna run build ${ scopes }`;

	console.log( `\nBuilding ${ packages.length } package(s) from source...` );
	console.log( `  $ ${ command }` );

	execSync( command, { stdio: "inherit", cwd: ROOT_DIR } );
};

/**
 * Main entry point. Discovers packages, downloads pre-built tarballs from NPM,
 * and falls back to building from source for any that are unavailable.
 *
 * @returns {Promise<void>}
 */
const main = async() => {
	if ( DRY_RUN ) {
		console.log( "=== DRY RUN MODE ===" );
	}

	console.log( "Discovering buildable packages..." );
	const packages = discoverBuildablePackages();
	console.log( `Found ${ packages.length } package(s) with build scripts.\n` );

	const fromNpm = [];
	const fromSource = [];

	await parallelMap( packages, NPM_CONCURRENCY, async( pkg ) => {
		console.log( `Checking ${ pkg.name }@${ pkg.version }...` );

		const tarballUrl = await getTarballUrl( pkg.name, pkg.version );
		if ( ! tarballUrl ) {
			console.log( "  Not found on NPM, will build from source." );
			fromSource.push( pkg );
			return;
		}

		if ( pkg.extractDirs.length === 0 ) {
			console.log( "  No directories to extract, will build from source." );
			fromSource.push( pkg );
			return;
		}

		if ( DRY_RUN ) {
			console.log( `  Found on NPM: ${ tarballUrl }` );
			console.log( `  Would extract: ${ pkg.extractDirs.join( ", " ) }` );
			fromNpm.push( pkg );
			return;
		}

		console.log( "  Downloading from NPM..." );
		const success = await downloadAndExtract( tarballUrl, pkg.dir, pkg.extractDirs );
		if ( success ) {
			console.log( `  Extracted: ${ pkg.extractDirs.join( ", " ) }` );
			fromNpm.push( pkg );
		} else {
			console.log( "  Extraction failed, will build from source." );
			fromSource.push( pkg );
		}
	} );

	// Build remaining packages from source.
	if ( ! DRY_RUN ) {
		buildFromSource( fromSource );
	}

	// Print summary.
	console.log( "\n=============================================" );
	console.log( "Summary:" );
	console.log( `  From NPM:    ${ fromNpm.length } package(s)` );
	if ( fromNpm.length > 0 ) {
		console.log( `    ${ fromNpm.map( ( p ) => p.name ).join( ", " ) }` );
	}
	console.log( `  From source: ${ fromSource.length } package(s)` );
	if ( fromSource.length > 0 ) {
		console.log( `    ${ fromSource.map( ( p ) => p.name ).join( ", " ) }` );
	}
};

main().catch( ( error ) => {
	console.error( "Fatal error:", error.message );
	process.exit( 1 );
} );
