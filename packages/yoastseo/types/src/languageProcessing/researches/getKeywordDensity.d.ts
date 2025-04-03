/**
 * Calculates the keyphrase density.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {number} The keyphrase density.
 */
export default function getKeyphraseDensity(paper: Paper, researcher: Researcher): number;
/**
 * Calculates the keyphrase density.
 *
 * @deprecated Use getKeyphraseDensity instead.
 *
 * @param {Paper} paper The paper containing keyphrase and text.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {number} The keyphrase density.
 */
export function getKeywordDensity(paper: Paper, researcher: Researcher): number;
