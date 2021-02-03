import baseStemmer from "../../../helpers/morphology/baseStemmer";

/**
 * Returns the stemmer for a researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer() {
	return baseStemmer;
}
