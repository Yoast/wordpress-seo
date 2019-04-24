/* eslint-disable no-console */
const execSync = require( "child_process" ).execSync;

// Remove the symlinks from node_modules.
execSync( "rm -rf *yoast*", { cwd: "./node_modules/" } );
console.log( "All previously linked yoast packages have been unlinked." );

console.log( "Reinstalling unlinked packages." );
// Reinstall the removed yoast packages with Yarn.
execSync( "yarn install --check-files" );
/* eslint-enable no-console */
