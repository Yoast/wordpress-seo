const getNounForms = require( "./getNounForms.js" ).getNounForms;
const getVerbForms = require( "./getVerbForms.js" ).getVerbForms;
const unique = require( "lodash/uniq" );

const getForms = function( word ) {
	let forms = [].concat( getNounForms( word ), getVerbForms( word ) );

	return unique( forms );
};

module.exports = getForms;
