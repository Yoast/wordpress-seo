import { escapeRegExp } from "lodash";
import getAltAttribute from "../image/getAltAttribute";
import { normalizeSingle } from "../sanitize/quotes";
import parseSlug from "../url/parseSlug";
import getWords from "../word/getWords";
import getImagesInScope from "../image/getImagesInScope";
import { WORD_BOUNDARY_WITH_HYPHEN, WORD_BOUNDARY_WITHOUT_HYPHEN } from "../../../config/wordBoundariesWithoutPunctuation";

/**
 * Gets all words found in the text, title, slug, meta description and image alts in scope of a given paper.
 *
 * @param {Paper} 	paper     					The paper for which to get the words.
 * @param {boolean}	areHyphensWordBoundaries	Whether hyphens should be treated as word boundaries.
 *
 * @returns {string[]} All words found.
 */
export default function( paper, areHyphensWordBoundaries ) {
	const paperText = paper.getText();
	// Use the same image scope as the image researches, so word forms are also collected from provided image alts.
	const altTagsInText = getImagesInScope( paper ).map( image => getAltAttribute( image ) );

	const paperContent = [
		paperText,
		paper.getTitle(),
		paper.getSlug(),
		parseSlug( paper.getSlug() ),
		paper.getDescription(),
		altTagsInText.join( " " ),
	].join( " " );

	/*
     * If hyphens should be treated as word boundaries, pass a custom word boundary regex string that includes whitespaces,
     * hyphens (u002d), and en-dashes (u2013). Otherwise, pass a regex that includes only whitespaces and en-dashes.
 	 */
	const words = areHyphensWordBoundaries ? getWords( paperContent, WORD_BOUNDARY_WITH_HYPHEN )
		: getWords( paperContent, WORD_BOUNDARY_WITHOUT_HYPHEN );

	return words.map(
		word => normalizeSingle( escapeRegExp( word ) ) );
}
