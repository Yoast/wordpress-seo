let firstWordExceptionsEnglish = require( "../researches/english/firstWordExceptions.js" );
let firstWordExceptionsGerman = require( "../researches/german/firstWordExceptions.js" );
let firstWordExceptionsSpanish = require( "../researches/spanish/firstWordExceptions.js" );
let firstWordExceptionsFrench = require( "../researches/french/firstWordExceptions.js" );
let firstWordExceptionsDutch = require( "../researches/dutch/firstWordExceptions.js" );
let firstWordExceptionsItalian = require( "../researches/italian/firstWordExceptions.js" );
let firstWordExceptionsRussian = require( "../researches/russian/firstWordExceptions.js" );

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
		default:
		case "en":
			return firstWordExceptionsEnglish;
	}
};
