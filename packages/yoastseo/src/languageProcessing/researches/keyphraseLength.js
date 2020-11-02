/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper 			The paper to research
 * @param {Researcher} researcher 	The researcher to use for analysis
 * @param {boolean} hasFunctionWords Whether the language has a list of function words available.
 *
 * @returns {Object} The length of the keyphrase and whether the language has function words or not.
 */
export default function( paper, researcher, hasFunctionWords ) {
	const topicForms = researcher.getResearch( "morphology" );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		hasFunctionWords: hasFunctionWords,
	};
}
