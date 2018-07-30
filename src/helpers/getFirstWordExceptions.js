const firstWordExceptionsEnglish = require( "../researches/english/firstWordExceptions.js" );
const firstWordExceptionsGerman = require( "../researches/german/firstWordExceptions.js" );
const firstWordExceptionsSpanish = require( "../researches/spanish/firstWordExceptions.js" );
const firstWordExceptionsFrench = require( "../researches/french/firstWordExceptions.js" );
const firstWordExceptionsDutch = require( "../researches/dutch/firstWordExceptions.js" );
const firstWordExceptionsItalian = require( "../researches/italian/firstWordExceptions.js" );
const firstWordExceptionsRussian = require( "../researches/russian/firstWordExceptions.js" );
const firstWordExceptionsPolish = require( "../researches/polish/firstWordExceptions.js" );

let getLanguage = require( "./getLanguage.js" );

module.exports = function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return firstWordExceptionsGerman;
		case "fr":
			return firstWordExceptionsFrench;
		case "es":
			return firstWordExceptionsSpanish;
		case "nl":
			return firstWordExceptionsDutch;
		case "it":
			return firstWordExceptionsItalian;
		case "ru":
		    return firstWordExceptionsRussian;
		case "pl":
			return firstWordExceptionsPolish;
		default:
		case "en":
			return firstWordExceptionsEnglish;
	}
};
