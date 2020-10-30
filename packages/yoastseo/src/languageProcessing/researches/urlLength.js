/** @module analyses/isUrlTooLong */

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 *
 * @deprecated since 1.48
 */
export default function urlLength( paper ) {
	const lengthOfUrl   = paper.getUrl().length;
	const keywordLength = paper.getKeyword().length;
	const maxUrlLength  = 40;
	const maxSlugLength = 20;

	if ( lengthOfUrl > maxUrlLength	&& lengthOfUrl > keywordLength + maxSlugLength ) {
		return true;
	}
	return false;
}
