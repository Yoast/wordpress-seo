import getWords from "../helpers/getWords";
import wordsCharacterCount from "../helpers/wordsCharacterCount";

/**
 * Calculates the keyword density.
 *
 * @param {Object} paper        The paper containing keyword and text.
 * @param {Object} researcher   The researcher.
 *
 * @returns {Object} The keyword density and the stemmer.
 */
export default function( paper, researcher ) {
	const textCharsCount = wordsCharacterCount( getWords( paper.getText() ) );

	if ( textCharsCount === 0 ) {
		return 0;
	}

	const keywordCountObject = researcher.getResearch( "keywordCount" );
	const stemmer = researcher.getHelper( "getStemmer" );

	return {
		keywordDensity: ( keywordCountObject.charactersCount / textCharsCount ) * 100,
		stemmer: stemmer,
	};
}
