import getSentences from "../stringProcessing/getSentences";
import escapeRegExp from "lodash-es/escapeRegExp";
import { findTopicFormsInString } from "./findKeywordFormsInString";

/**
 * Matches the keyword in the description if a description and keyword are available.
 * Returns null if no description is specified in the given paper.
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher the researcher object to gather researchers from.
 * @returns { Object | null } The number of matches per keyword term, for the entire description and for each individual sentence.
 */
export default function( paper, researcher ) {
	if ( paper.getDescription() === "" ) {
		return null;
	}
	const description = paper.getDescription();
	const locale = paper.getLocale();

	const topicForms = researcher.getResearch( "morphology" );
	topicForms.keyphraseForms = topicForms.keyphraseForms.map( keyWordForms => keyWordForms.map( form => escapeRegExp( form ) )  );

	const sentences = getSentences( description );

	const matchResults = { };

	// Percentage of keyword matches in entire description, including synonyms.
	matchResults.fullDescription = findTopicFormsInString( topicForms, description, true, locale ).percentWordMatches;

	// The same as for the entire description, but per sentence.
	matchResults.perSentence = sentences.map( sentence =>
		findTopicFormsInString( topicForms, sentence, true, locale ).percentWordMatches
	);

	return matchResults;
}

