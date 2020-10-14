import findKeyphraseInPageTitle from "../../../researches/base/findKeywordInPageTitle";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the occurrences of the keyword in the page title. Returns the result that contains information on
 * (1) whether the exact match of the keyphrase was used in the title,
 * (2) whether all (content) words from the keyphrase were found in the title,
 * (3) at which position the exact match was found in the title.
 *
 * @inheritDoc findKeyphraseInPageTitle
 */
export default function( paper, researcher ) {
	return findKeyphraseInPageTitle( paper, researcher, functionWords );
}
