/* eslint-disable no-console */
const execSync = require( "child_process" ).execSync;
const isPremium = require( "fs" ).existsSync( "premium" );

// Remove the symlinks from node_modules.
execSync( "rm -rf *yoast*", { cwd: "./node_modules/" } );
if ( isPremium ) {
	execSync( "rm -rf *yoast*", { cwd: "./premium/node_modules/" } );
}
console.log( "All previously linked yoast packages have been unlinked." );

console.log( "Reinstalling unlinked packages." );
// Reinstall the removed yoast packages with Yarn.
execSync( "yarn install --check-files" );
if ( isPremium ) {
	console.log( "Reinstalling unlinked packages in premium." );
	execSync( "yarn install --check-files", { cwd: "./premium/node_modules/" } );
}
/* eslint-enable no-console */
