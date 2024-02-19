import { stemBasicPrefixes } from "./createBasicWordForms";

/**
 * Finds the exact match of the keyphrase in the SEO title.
 * @param {object} matchesObject The matches object containing the array of matched words and the position of the match.
 * @param {string} keyword The keyword to find in the SEO title.
 * @param {object} result The result object to store the results in.
 * @returns {object} The new result object containing the results of the analysis.
 */
export default function( matchesObject, keyword, result ) {
	const matchedKeywordStems = [];
	const matchedKeywordPrefixes = [];
	matchesObject.matches.forEach( match => {
		const { stem, prefix } = stemBasicPrefixes( match );
		matchedKeywordStems.push( stem );
		matchedKeywordPrefixes.push( prefix );
	} );
	/*
	 We consider a match an exact match if:
	 1. The matched stems are equal to the keyword.
		 This is to make sure for example that the keyword "جدول" is not matched with "الجدولين" in the title "الجدولين".
	 2. All the matched prefixes are the same.
		 For multi-word keyphrases where each word receives "function word" prefix,
		 we consider an exact match only if the prefix attached to the all words are the same.
		 For example, we recognize an exact match between the keyphrase "منزل كبير" and the title "المنزل الكبير"
		 because In Arabic, when the adjective directly follows the definite noun, both the noun and the adjective take the definite article.
	 */
	if ( matchedKeywordStems.join( " " ) === keyword ) {
		for ( const prefix of matchedKeywordPrefixes ) {
			// eslint-disable-next-line max-depth
			if ( prefix !== matchedKeywordPrefixes[ 0 ] && prefix !== "" ) {
				result.exactMatchFound = false;
				break;
			} else {
				result.exactMatchFound = true;
			}
		}
		if ( matchesObject.position === 0 ) {
			result.position = 0;
		}
	}
	return result;
}
