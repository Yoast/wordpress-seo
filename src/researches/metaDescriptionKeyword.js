import matchTextWithArray from "../stringProcessing/matchTextWithArray";
import getSentences from "../stringProcessing/getSentences";

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher
 * @returns { { fullDescription: Number[], perSentence: Number[][] } } The number of matches per keyword, for the entire description and for each individual sentence.
 */
export default function( paper, researcher ) {
	if ( paper.getDescription() === "" ) {
		return {
			fullDescription: null,
			perSentence: null
		};
	}
	const description = paper.getDescription();
	const locale = paper.getLocale();

	const keyPhraseForms = researcher.getResearch( "morphology" ).keyphraseForms;

	const sentences = getSentences( description );

	let matchResults = { };

	matchResults.fullDescription = keyPhraseForms.map(
		keywordForms => matchTextWithArray( description, keywordForms, locale ).count
	);

	matchResults.perSentence = sentences.map( sentence =>
		keyPhraseForms.map( keywordForms => matchTextWithArray( sentence, keywordForms, locale ).count )
	);

	return matchResults;
}

