import firstWordExceptionsEnglish from "../researches/english/firstWordExceptions.js";
import firstWordExceptionsGerman from "../researches/german/firstWordExceptions.js";
import firstWordExceptionsSpanish from "../researches/spanish/firstWordExceptions.js";
import firstWordExceptionsFrench from "../researches/french/firstWordExceptions.js";
import firstWordExceptionsDutch from "../researches/dutch/firstWordExceptions.js";
import firstWordExceptionsItalian from "../researches/italian/firstWordExceptions.js";
import firstWordExceptionsRussian from "../researches/russian/firstWordExceptions.js";
import firstWordExceptionsPolish from "../researches/polish/firstWordExceptions.js";
import firstWordExceptionsSwedish from "../researches/swedish/firstWordExceptions.js";
import firstWordExceptionsPortuguese from "../researches/portuguese/firstWordExceptions.js";
import getLanguage from "./getLanguage.js";

/**
 * Returns the first word exceptions function for a locale.
 *
 * @param {string} locale The locale to return word exceptions for.
 *
 * @returns {Function} A function that will return the first word exceptions.
 */
export default function( locale ) {
	const firstWordExceptions = {
		en: firstWordExceptionsEnglish,
		de: firstWordExceptionsGerman,
		fr: firstWordExceptionsFrench,
		es: firstWordExceptionsSpanish,
		nl: firstWordExceptionsDutch,
		it: firstWordExceptionsItalian,
		ru: firstWordExceptionsRussian,
		pl: firstWordExceptionsPolish,
		sv: firstWordExceptionsSwedish,
		pt: firstWordExceptionsPortuguese,
	};

	// If available, return the language-specific first word exceptions.
	if ( Object.keys( firstWordExceptions ).includes( getLanguage( locale ) ) ) {
		return firstWordExceptions[ getLanguage( locale ) ];
	}

	// Return the English first word exceptions as a default.
	return firstWordExceptionsEnglish;
}
