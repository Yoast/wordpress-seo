import matchTextWithArray from "../stringProcessing/matchTextWithArray";
import getSentences from "../stringProcessing/getSentences";

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

	const keyPhraseForms = researcher.getResearch( "morphology" ).keyphraseForms;

	const sentences = getSentences( description );

	let matchResults = { };

	/*
		Compute the number of matches for each keyword in the key phrase (morphology included).
	   	Result is an array of match counts, e.g. [0,4,1] means keywords 2 and 3 and their
	   	morphological forms have been matched 4 and 1 time(s) respectively.
	 */
	matchResults.fullDescription = keyPhraseForms.map(
		keywordForms => matchTextWithArray( description, keywordForms, locale ).count
	);

	// The same as for the entire description, but per sentence.
	matchResults.perSentence = sentences.map( sentence =>
		keyPhraseForms.map( keywordForms => matchTextWithArray( sentence, keywordForms, locale ).count )
	);

	return matchResults;
}

