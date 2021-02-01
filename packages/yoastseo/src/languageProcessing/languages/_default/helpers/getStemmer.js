import baseStemmer from "../../../helpers/morphology/baseStemmer";

/**
 * Returns the stemmer for a researcher.
 *
 * @param {Researcher} researcher The researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer() {
	return baseStemmer;
}
