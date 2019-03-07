import firstWordExceptionsEnglish from "../researches/english/firstWordExceptions.js";
import firstWordExceptionsGerman from "../researches/german/firstWordExceptions.js";
import firstWordExceptionsSpanish from "../researches/spanish/firstWordExceptions.js";
import firstWordExceptionsFrench from "../researches/french/firstWordExceptions.js";
import firstWordExceptionsDutch from "../researches/dutch/firstWordExceptions.js";
import firstWordExceptionsItalian from "../researches/italian/firstWordExceptions.js";
import firstWordExceptionsRussian from "../researches/russian/firstWordExceptions.js";
import firstWordExceptionsPolish from "../researches/polish/firstWordExceptions.js";
import firstWordExceptionsSwedish from "../researches/swedish/firstWordExceptions.js";
import getLanguage from "./getLanguage.js";

/**
 * Returns the first word exceptions function for a locale.
 *
 * @param {string} locale The locale to return word exceptions for.
 *
 * @returns {Function} A function that will return the first word exceptions.
 */
export default function( locale ) {
	switch ( getLanguage( locale ) ) {
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
		case "sv":
			return firstWordExceptionsSwedish;
		default:
		case "en":
			return firstWordExceptionsEnglish;
	}
}
