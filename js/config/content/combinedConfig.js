let merge = require( "lodash/merge" );
let getLanguage = require( "./../../helpers/getLanguage" );
let defaultConfig = require( "./default" );
let it = require( "./it" );

let configurations = {
	it: it,
};

module.exports = function( locale ) {
	console.log( locale );
	let language = getLanguage( locale );
	if( configurations.hasOwnProperty( language ) ) {
		return merge( defaultConfig, configurations[ language ] );
	}

	return defaultConfig;
};
