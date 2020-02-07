import { get } from "lodash-es";
import getStemForLanguageFactory from "../helpers/getStemForLanguage";
const stemFunctions = getStemForLanguageFactory();


/**
 * Retrieves a stemmer function from the factory. Returns the identity function if the language does not have a stemmer.
 *
 * @param {string} language The language to retrieve a stemmer function for.
 *
 * @returns {Function} A stemmer function for the language.
 */
export default function( language ) {
	return get( stemFunctions, language, word => word );
}
