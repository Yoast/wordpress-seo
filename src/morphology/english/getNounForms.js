// "use strict";
const irregularNouns = require( "./irregularNouns.js" );
const singularizeRegex = require( "./regexNoun.js" ).singularizeRegex;
const pluralizeRegex = require( "./regexNoun.js" ).pluralizeRegex;
const hispanicRegex = require( "./regexNoun.js" ).hispanicRegex;

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniqBy" );

const checkIrregulars = function( word ) {
	let irregulars;

	irregularNouns.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );
	return irregulars;
};

const checkHispanic = function( word ) {
	for ( let i = 0; i < hispanicRegex.length; i++ ) {
		if ( hispanicRegex[ i ].reg.test( word ) === true ) {
			return [
				word.replace( hispanicRegex[ i ].reg, hispanicRegex[ i ].repl1 ),
				word.replace( hispanicRegex[ i ].reg, hispanicRegex[ i ].repl2 ),
			];
		}
	}
};

const singularize = function( word ) {
	for ( let i = 0; i < singularizeRegex.length; i++ ) {
		if ( singularizeRegex[ i ].reg.test( word ) === true ) {
			return word.replace( singularizeRegex[ i ].reg, singularizeRegex[ i ].repl );
		}
	}
};

const pluralize = function( word ) {
	for ( let i = 0; i < pluralizeRegex.length; i++ ) {
		if ( pluralizeRegex[ i ].reg.test( word ) === true ) {
			return word.replace( pluralizeRegex[ i ].reg, pluralizeRegex[ i ].repl );
		}
	}
};


const getNounForms = function( word ) {
	let forms = [];
	let isIrregular = false;

	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		forms = forms.concat( irregular );
		isIrregular = true;
	}

	if ( isIrregular ) {
		return unique( forms );
	}

	forms = forms.concat( word );

	const hispanic = checkHispanic( word );
	if ( ! isUndefined( hispanic ) ) {
		forms.push( hispanic[ 0 ], hispanic[ 1 ] );
	}

	const singular = singularize( word );
	if ( ! isUndefined( singular ) ) {
		forms.push( singular );
	}

	const plural = pluralize( word );
	if ( ! isUndefined( plural ) ) {
		forms.push( plural );
	}

	return unique( forms );
};

module.exports = {
	getNounForms: getNounForms,
};

