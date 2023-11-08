import { escapeRegExp } from "lodash-es";
import getAltAttribute from "../image/getAltAttribute";
import { normalizeSingle } from "../sanitize/quotes";
import parseSlug from "../url/parseSlug";
import getWords from "../word/getWords";
import getImagesInTree from "../image/getImagesInTree";

/**
 * Gets all words found in the text, title, slug and meta description of a given paper.
 *
 * @param {Paper} 	paper     					The paper for which to get the words.
 * @param {boolean}	areHyphensWordBoundaries	Whether hyphens should be treated as word boundaries.
 *
 * @returns {string[]} All words found.
 */
export default function( paper, areHyphensWordBoundaries ) {
	const paperText = paper.getText();
	const altTagsInText = getImagesInTree( paper ).map( image => getAltAttribute( image ) );

	const paperContent = [
		paperText,
		paper.getTitle(),
		paper.getSlug(),
		parseSlug( paper.getSlug() ),
		paper.getDescription(),
		altTagsInText.join( " " ),
	].join( " " );

	/*
     * If hyphens should be treated as word boundaries, pass a custom word boundary regex string that includes hyphens
 	 * (u002d) and en-dashes (u2013). Otherwise, pass a regex that includes only en-dashes.
 	 */
	const words = areHyphensWordBoundaries ? getWords( paperContent, "[\\s\\u2013\\u002d]" )
		: getWords( paperContent, "[\\s\\u2013]" );

	return words.map(
		word => normalizeSingle( escapeRegExp( word ) ) );
}
