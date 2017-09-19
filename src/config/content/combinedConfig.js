let defaultsDeep = require( "lodash/defaultsDeep" );
let getLanguage = require( "./../../helpers/getLanguage" );
let defaultConfig = require( "./default" );
let it = require( "./it" );

let configurations = {
	it: it,
};

module.exports = function( locale ) {
	let language = getLanguage( locale );
	if( configurations.hasOwnProperty( language ) ) {
		return defaultsDeep( configurations[ language ], defaultConfig );
	}

	return defaultConfig;
};
