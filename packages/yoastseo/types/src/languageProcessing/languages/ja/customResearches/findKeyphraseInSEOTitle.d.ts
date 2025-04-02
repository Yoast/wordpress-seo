/**
 * Checks the occurrences of the keyphrase in the SEO title. Returns a result that contains information on
 * (1) whether all the keyphrase forms are found,
 * (2) the lowest number of the positions of the matches, and
 * (3) whether the exact match keyphrase is requested.
 *
 * @param {Object} paper 			The paper containing SEO title and keyword.
 * @param {Researcher} researcher 	The researcher to use for analysis.
 *
 * @returns {Object} An object containing these info: (1) whether all the keyphrase forms are found,
 * (2) the lowest number of the positions of the matches, and (3) whether the exact match keyphrase is requested.
 */
export default function _default(paper: Object, researcher: Researcher): Object;
