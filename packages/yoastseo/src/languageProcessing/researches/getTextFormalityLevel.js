/**
 * Gets the formality level of the text.
 *
 * @param {Object} paper        The paper to analyze.
 * @param {Object} researcher   The researcher object.
 *
 * @returns {string} The string "formal" if the text is formal, and the string "informal" if the text is informal.
 */
export default function( paper, researcher ) {
	const checkTextFormality = researcher.getHelper( "checkTextFormality" );

	return checkTextFormality( paper, researcher );
}
