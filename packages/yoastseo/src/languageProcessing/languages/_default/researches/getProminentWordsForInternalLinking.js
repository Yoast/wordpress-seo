import getProminentWordsForInternalLinking from "../../../researches/base/getProminentWordsForInternalLinking";

/**
 * Retrieves the prominent words from the given paper.
 *
 * @inheritDoc getProminentWordsForInternalLinking
 */
export default function( paper, researcher ) {
	return getProminentWordsForInternalLinking( paper, researcher,  word => word, [], null );
}
