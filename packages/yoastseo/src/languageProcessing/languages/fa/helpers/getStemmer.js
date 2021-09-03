import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

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
