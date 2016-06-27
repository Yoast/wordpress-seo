var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

var createRegex = function ( strings, regexType ) {
	switch( regexType ) {
		default:
			return arrayToRegex( strings, true );
	}
};

module.exports = createRegex;
