import getProminentWordsForInternalLinking from "../../../researches/base/getProminentWordsForInternalLinking";

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	return getProminentWordsForInternalLinking( paper, researcher,  word => word, [], null );
}
