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
	if ( verbPrefixesRegex.sevenLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.sevenLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 8 ),
		};
	}

	if ( verbPrefixesRegex.sevenLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.sevenLetterPrefixes, "" ),
			prefix: word.substring( 0, 7 ),
		};
	}

	if ( verbPrefixesRegex.fiveLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fiveLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 6 ),
		};
	}

	if ( verbPrefixesRegex.fiveLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fiveLetterPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixesRegex.fourLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fourLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 5 ),
		};
	}

	if ( verbPrefixesRegex.fourLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.fourLetterPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixesRegex.threeLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.threeLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 4 ),
		};
	}

	if ( verbPrefixesRegex.threeLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.threeLetterPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixesRegex.twoLetterHyphenPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.twoLetterHyphenPrefixes, "" ),
			prefix: word.substring( 0, 3 ),
		};
	}

	if ( verbPrefixesRegex.twoLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.twoLetterPrefixes, "" ),
			prefix: word.substring( 0, 2 ),
		};
	}

	if ( verbPrefixesRegex.oneLetterPrefixes.test( word ) === true ) {
		return {
			normalizedWord: word.replace( verbPrefixesRegex.oneLetterPrefixes, "" ),
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

	if ( isUndefined( irregulars ) ) {
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
