// "use strict";
const irregularVerbs = require( "./irregularVerbs.js" );
const verbPrefixesRegex = require( "./regexVerb.js" ).verbPrefixes;
const sFormToInfinitiveRegex = require( "./regexVerb.js" ).sFormToInfinitive;
const ingFormToInfinitiveRegex = require( "./regexVerb.js" ).ingFormToInfinitive;
const edFormToInfinitiveRegex = require( "./regexVerb.js" ).edFormToInfinitive;
const infinitiveToSFormRegex = require( "./regexVerb.js" ).infinitiveToSForm;
const infinitiveToIngFormRegex = require( "./regexVerb.js" ).infinitiveToIngForm;
const infinitiveToEdFormRegex = require( "./regexVerb.js" ).infinitiveToEdForm;

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniqBy" );

const normalizePrefixed = function( word ) {
	const sixLetterPrefixes = verbPrefixesRegex.sixLetterPrefixes;
	const fiveLetterPrefixes = verbPrefixesRegex.fiveLetterPrefixes;
	const fourLetterPrefixes = verbPrefixesRegex.fourLetterPrefixes;
	const threeLetterPrefixes = verbPrefixesRegex.threeLetterPrefixes;
	const twoLetterPrefixes = verbPrefixesRegex.twoLetterPrefixes;
	const oneLetterPrefixes = verbPrefixesRegex.oneLetterPrefixes;

	if ( sixLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( sixLetterPrefixes, "" ),
			prefix: word.substring( 0, 6 ),
		};
	}
	if ( fiveLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( fiveLetterPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}
	if ( fourLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( fourLetterPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}
	if ( threeLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( threeLetterPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}
	if ( twoLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( twoLetterPrefixes, "" ),
			prefix: word.substring( 0, 2 ),
		};
	}
	if ( oneLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( oneLetterPrefixes, "" ),
			prefix: word.substring( 0, 1 ),
		};
	}
};


const checkIrregulars = function( word ) {
	let irregulars;

	irregularVerbs.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );

	const normalizedIrregular = normalizePrefixed( word );

	if ( ! isUndefined( normalizedIrregular ) ) {
		irregularVerbs.forEach( function( paradigm ) {
			paradigm.forEach( function( wordInParadigm ) {
				if ( wordInParadigm === normalizedIrregular.normalizedWord ) {
					irregulars = paradigm.map( function( verb ) {
						return normalizedIrregular.prefix.concat( verb );
					} );
				}
			} );
		} );
	}
	return irregulars;
};

const endsWithS = function( word ) {
	return word[ word.length - 1 ] === "s";
};

const endsWithIng = function( word ) {
	return word.substring( word.length - 3, word.length ) === "ing";
};

const endsWithEd = function( word ) {
	return word.substring( word.length - 2, word.length ) === "ed";
};

const buildVerbFormFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return word.replace( regex[ i ].reg, regex[ i ].repl );
		}
	}
};

const sFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, sFormToInfinitiveRegex );
};

const ingFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, ingFormToInfinitiveRegex );
};

const edFormToInfinitive = function( word ) {
	return buildVerbFormFromRegex( word, edFormToInfinitiveRegex );
};

const infinitiveToSForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToSFormRegex );
};

const infinitiveToIngForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToIngFormRegex );
};

const infinitiveToEdForm = function( word ) {
	return buildVerbFormFromRegex( word, infinitiveToEdFormRegex );
};

const getInfinitive = function( word ) {
	let infinitive = word;
	let guessedForm = "inf";

	if ( endsWithS( word ) ) {
		infinitive = sFormToInfinitive( word );
		guessedForm = "s";
	}

	if ( endsWithIng( word ) ) {
		infinitive = ingFormToInfinitive( word );
		guessedForm = "ing";
	}

	if ( endsWithEd( word ) ) {
		infinitive = edFormToInfinitive( word );
		guessedForm = "ed";
	}
	return {
		infinitive: infinitive,
		guessedForm: guessedForm,
	};
};

const getVerbForms = function( word ) {
	let forms = [];

	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		forms = forms.concat( irregular );
		return unique( forms );
	}

	const infinitive = getInfinitive( word ).infinitive;
	// const guessedForm = getInfinitive( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat( word );

	forms.push( infinitive );
	forms.push( infinitiveToSForm( infinitive ) );
	forms.push( infinitiveToIngForm( infinitive ) );
	forms.push( infinitiveToEdForm( infinitive ) );

	forms = forms.filter( Boolean );

	return unique( forms );
};

module.exports = {
	getVerbForms: getVerbForms,
};
