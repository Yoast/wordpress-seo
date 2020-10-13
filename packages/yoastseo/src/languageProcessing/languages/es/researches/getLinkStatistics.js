import countLinkTypes from "../../../researches/base/getLinkStatistics";
import getFunctionWords from "../config/functionWords";
const functionWords = getFunctionWords().all;

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	return countLinkTypes( paper, researcher, functionWords );
};
