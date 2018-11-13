/**
 *
 * @param {string} language The language of the text
 * @param {string} textName The name of the text
 * @returns {*} The test text from an html fle
 */
export default function( language, textName ) {
	return require( `../../spec/fullTextTests/testTexts/${language}/${textName}.html` );
}
