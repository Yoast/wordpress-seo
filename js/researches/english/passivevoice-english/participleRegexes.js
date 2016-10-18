var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );

var irregulars = require( "./irregulars" )();
var regularParticiplesRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

var regularParticiples = function( word ) {
	return word.match( regularParticiplesRegex ) || [];
};
var irregularParticiples = function( word ) {
	var irregularRegex =  arrayToRegex( irregulars );
	return word.match( irregularRegex ) || [];
};

module.exports = function() {
	return {
		regularParticiples: regularParticiples,
		irregularParticiples: irregularParticiples,
	};
};
