import TurkishStemmer from "./turkishStemmer.js";

/**
 * Stems Turkish words.
 *
 * @param {string} word            The word to stem.
 * @param {Object} morphologyData  The Turkish morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	word = word.toLowerCase();
	word =  word.replace( "'", "" );

	const stemmer = new TurkishStemmer( morphologyData );
	stemmer.setCurrent( word );
	stemmer.stem();

	return stemmer.getCurrent();
}
