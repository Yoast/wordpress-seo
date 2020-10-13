import countLinkTypes from "../../../researches/base/getLinkStatistics";

/**
 * Counts the links found in the text.
 *
 * @inheritDoc countLinkTypes
 */
export default function( paper, researcher ) {
	return countLinkTypes( paper, researcher, [] );
};
