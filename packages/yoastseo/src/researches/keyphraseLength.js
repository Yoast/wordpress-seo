/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @param {Researcher} researcher The researcher to use for analysis
 *
 * @returns {number} The length of the keyphrase
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	return topicForms.keyphraseForms.length;
}
