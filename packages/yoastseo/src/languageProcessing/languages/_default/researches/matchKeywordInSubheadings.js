import matchKeywordInSubheadings from "../../../researches/base/matchKeywordInSubheadings";

/**
 * Checks if there are any h2 or h3 subheadings in the text and if they have the keyphrase or synonyms in them.
 *
 * @inheritDoc matchKeywordInSubheadings
 */
export default function( paper, researcher ) {
	return matchKeywordInSubheadings( paper, researcher, false );
}
