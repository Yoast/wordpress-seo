/**
 * Determines the length in words of the keyphrase.
 *
 * @param {Paper} paper 			The paper to research
 * @param {Researcher} researcher 	The researcher to use for analysis
 *
 * @returns {Object} The length of the keyphrase and the function words list.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const functionWords = researcher.getConfig( "functionWords" );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		functionWords: functionWords,
	};
}
