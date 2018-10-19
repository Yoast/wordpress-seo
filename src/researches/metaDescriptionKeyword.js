import matchWords from "../stringProcessing/matchTextWithArray";
import getSentences from "../stringProcessing/getSentences";

/**
 * Replaces found keyword forms in the given description.
 *
 * @param {string} description the description to remove the matched keyword forms from.
 * @param {Object[]} matchedKeywordForms the matched keyword forms to remove from the description.
 * @returns {string} the description with the keywords removed.
 */
const replaceFoundKeywordForms = function( description, matchedKeywordForms ) {
	// Replace matches so we do not match them for synonyms.
	matchedKeywordForms.forEach( keywordForm =>
		keywordForm.matches.forEach(
			match => {
				description = description.replace( match, "" );
			}
		)
	);
	return description;
};

/**
 * Counts the number of full keyphrase matches in the given sentence. Takes synonyms into account.
 *
 * A full keyphrase is when all keywords in the keyphrase match.
 *
 * @param {string} sentence the sentence that needs to be analyzed.
 * @param {Object} topicForms the keyphrase (and its optional synonyms') word forms.
 * @param {string} locale the current locale
 * @returns {Number} the number of matched keyphrases in the sentence.
 */
const matchPerSentence = function( sentence, topicForms, locale ) {
	// Focus keyphrase matches.
	let matchesKeyphrase = topicForms.keyphraseForms.map( keywordForms => matchWords( sentence, keywordForms, locale ) );

	// Replace matches so we do not match them for synonyms.
	sentence = replaceFoundKeywordForms( sentence, matchesKeyphrase );

	// Keyphrase synonyms matches.
	let matchesSynonyms = [];
	if ( topicForms.synonymsForms ) {
		matchesSynonyms = topicForms.synonymsForms.map(
			synonymForms => {
				let matches = synonymForms.map( keywordForms => matchWords( sentence, keywordForms, locale ) );
				// Replace matches so we do not match them for other synonyms.
				sentence = replaceFoundKeywordForms( sentence, matchesKeyphrase );
				return matches;
			}
		);
	}

	// Count the number of matches that contain every word in the entire keyphrase.
	const fullKeyphraseMatches = Math.min( ...matchesKeyphrase.map( match => match.count ) );
	const fullSynonymsMatches = matchesSynonyms.map(
		matchesSynonym => Math.min( ...matchesSynonym.map( match => match.count ) )
	);

	return [ fullKeyphraseMatches, ...fullSynonymsMatches ].reduce( ( sum, count ) => sum + count, 0 );
};

/**
 * Counts the number of full keyphrase matches in the description.
 * Returns -1 if no description is specified in the given paper.
 *
 * @param {Paper} paper The paper object containing the description.
 * @param {Researcher} researcher the researcher object to gather researchers from.
 * @returns {Number} The number of keyphrase matches for the entire description.
 */
export default function( paper, researcher ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	let description = paper.getDescription();
	const locale = paper.getLocale();

	const topicForms = researcher.getResearch( "morphology" );

	const sentences = getSentences( description );

	const sentenceMatches = sentences.map(
		sentence => matchPerSentence( sentence, topicForms, locale )
	);

	return sentenceMatches.reduce( ( sum, count ) => sum + count, 0 );
}

