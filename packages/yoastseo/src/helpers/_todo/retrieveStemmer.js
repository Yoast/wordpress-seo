import getStemForLanguageFactory from "./getStemForLanguage";
const stemFunctions = getStemForLanguageFactory();


/**
 * Retrieves a stemmer function from the factory.
 * Returns the identity function if the language does not have a stemmer or if morphology data isn't available.
 *
 * @param {string} language         The language to retrieve a stemmer function for.
 * @param {Object} morphologyData   The morphology data.
 *
 * @returns {Function} A stemmer function for the language.
 */
export default function( language, morphologyData ) {
	const stemFunction = stemFunctions[ language ];

	// Return the stem function if there is one for the given language and if morphology data is available.
	if ( morphologyData && stemFunction ) {
		return stemFunction;
	}

	// Return an identity function if the stem function and/or morphology data aren't available.
	return word => word;
}
