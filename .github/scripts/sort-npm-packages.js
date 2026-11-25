/**
 * Sorts the packages of an npm release so every package comes after the packages it depends on.
 * Used by both pre-publish-npm-packages.yml (dry run) and publish-npm-packages.yml, so the dry run
 * always shows the order the real publish uses.
 *
 * Usage: node .github/scripts/sort-npm-packages.js <package> [<package> ...]
 * Prints the sorted package names on one line, separated by spaces.
 */

const fs = require( "fs" );
const path = require( "path" );

/**
 * Reads the workspace dependency graph from packages/<folder>/package.json.
 *
 * @param {string} packagesDir The packages directory.
 *
 * @returns {Object<string, string[]>} The runtime dependency names (`dependencies`, `peerDependencies`
 *                                      and `optionalDependencies`) per package name.
 */
function readDependencyGraph( packagesDir ) {
	const graph = {};
	for ( const folder of fs.readdirSync( packagesDir ) ) {
		let contents;
		try {
			contents = fs.readFileSync( path.join( packagesDir, folder, "package.json" ), "utf8" );
		} catch ( error ) {
			// Not a package folder; any other read error should fail the release.
			if ( error.code === "ENOENT" || error.code === "ENOTDIR" ) {
				continue;
			}
			throw error;
		}
		const manifest = JSON.parse( contents );
		graph[ manifest.name ] = Object.keys( {
			...manifest.dependencies,
			...manifest.peerDependencies,
			...manifest.optionalDependencies,
		} );
	}
	return graph;
}

/**
 * Sorts packages so dependencies come first, and otherwise keeps the given order.
 *
 * Only dependencies on other packages in the same release count. Each step takes the first remaining
 * package whose in-release dependencies are already placed, so unrelated packages keep their order.
 * When no package can be placed (a dependency cycle), the rest keep their given order.
 *
 * @param {string[]} packages The package names, in the order of the release PR body.
 * @param {Object<string, string[]>} graph The dependency names per package name.
 *
 * @returns {{sorted: string[], cycle: string[]}} The sorted names, and the names left in a cycle (empty if none).
 */
function sortPackages( packages, graph ) {
	const remaining = [ ...new Set( packages ) ];
	const sorted = [];
	while ( remaining.length > 0 ) {
		const index = remaining.findIndex( name =>
			( graph[ name ] || [] ).every( dep => dep === name || ! remaining.includes( dep ) )
		);
		if ( index === -1 ) {
			return { sorted: [ ...sorted, ...remaining ], cycle: remaining };
		}
		sorted.push( ...remaining.splice( index, 1 ) );
	}
	return { sorted, cycle: [] };
}

if ( require.main === module ) {
	const { sorted, cycle } = sortPackages( process.argv.slice( 2 ), readDependencyGraph( path.join( __dirname, "../../packages" ) ) );
	if ( cycle.length > 0 ) {
		console.error( "::warning::A dependency cycle prevents ordering " + cycle.join( ", " ) + ". These keep the order of the PR body." );
	}
	process.stdout.write( sorted.join( " " ) + "\n" );
}

module.exports = { readDependencyGraph, sortPackages };
