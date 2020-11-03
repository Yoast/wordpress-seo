/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper 			The paper to research
 * @param {Researcher} researcher 	The researcher to use for analysis
 *
 * @returns {Object} The length of the keyphrase.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const hasFunctionWords = researcher.getConfig( "functionWords" );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		hasFunctionWords: hasFunctionWords,
	};
}
