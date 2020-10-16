import getProminentWordsForInsights from "../../../researches/base/getProminentWordsForInsights";

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	return getProminentWordsForInsights( paper, researcher,  word => word, [], null );
}
