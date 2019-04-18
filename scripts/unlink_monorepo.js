#!/usr/local/bin/node
const execSync = require( "child_process" ).execSync;

const homeDirectory = execSync( `echo $HOME` ).toString().split( "\n" )[ 0 ];
const yarnLinkDir = homeDirectory + "/.config/yarn/link";

const toRemove = execSync( `ls`, { cwd: yarnLinkDir } ).toString().split( "\n" ).filter( value => value.includes( "yoast" ) );

// Remove the symlinks from the yarn link directory.
var x;
for ( x in toRemove ) {
	execSync( `rm -rf ${ toRemove[ x ] }`, { cwd: yarnLinkDir } );
}

// Remove the symlinks from node_modules.
execSync( `rm -rf *yoast*`, { cwd: "./node_modules/" } );

console.log( "All previously linked yoast packages have been unlinked." );
