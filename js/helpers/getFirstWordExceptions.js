import firstWordExceptionsEnglish from "../researches/english/firstWordExceptions.js";
import firstWordExceptionsGerman from "../researches/german/firstWordExceptions.js";
import firstWordExceptionsSpanish from "../researches/spanish/firstWordExceptions.js";
import firstWordExceptionsFrench from "../researches/french/firstWordExceptions.js";
import firstWordExceptionsDutch from "../researches/dutch/firstWordExceptions.js";

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
		default:
		case "en":
			return firstWordExceptionsEnglish;
	}
};
