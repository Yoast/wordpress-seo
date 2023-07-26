/**
 * Creates a regex to filter shortcodes from HTML.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {RegExp} The regex to recognize the shortcodes.
 */
const createShortcodeTagsRegex = shortcodeTags => {
	const sortcodeTagsRegexString = `\\[(${ shortcodeTags.join( "|" ) })[^\\]]*\\]`;
	return new RegExp( sortcodeTagsRegexString, "g" );
};

/**
 * Filters shortcodes from HTML string.
 * @param {string} html The HTML to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {string} The filtered HTML.
 */
export const filterShortcodesFromHTML = ( html, shortcodeTags ) => {
	const shortcodeTagsRegex = createShortcodeTagsRegex( shortcodeTags );
	return html.replace( shortcodeTagsRegex, "" );
};

/**
 * Filters shortcodes from a sentence.
 * @param {Sentence} sentence The sentence to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @param {RegExp} shortcodeTagsRegex The regex to filter the shortcodes.
 * @returns {void}
 *
 */
const filterShortcodesFromSentence = ( sentence, shortcodeTags, shortcodeTagsRegex ) => {
	const tokens = sentence.tokens;
	// traverse through tokens backwards
	for ( let i = tokens.length - 1; i >= 0; i-- ) {
		if ( shortcodeTags.includes( tokens[ i ].text ) && tokens[ i - 1 ] && tokens[ i - 1 ].text === "[" ) {
			while ( tokens[ i ].text !== "]" ) {
				tokens.splice( i, 1 );
			}
			tokens.splice( i, 1 );
			tokens.splice( i - 1, 1 );
		}
	}
	sentence.tokens = tokens;

	sentence.text = sentence.text.replace( shortcodeTagsRegex, "" );
};

/**
 * A recursive function that filters shortcodes from sentences.
 * @param {Node} tree The tree to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @param {RegExp} shortcodeTagsRegex The regex to filter the shortcodes.
 * @returns {void}
 */
const filterShortcodesFromSentences = ( tree, shortcodeTags, shortcodeTagsRegex ) => {
	if ( tree.sentences ) {
		tree.sentences.forEach( sentence => {
			filterShortcodesFromSentence( sentence, shortcodeTags, shortcodeTagsRegex );
		} );
	}

	if ( tree.childNodes ) {
		tree.childNodes.forEach( childNode => {
			filterShortcodesFromSentences( childNode, shortcodeTags, shortcodeTagsRegex );
		} );
	}
};

/**
 * Filters shortcodes from the tree.
 * @param {Node} tree The tree to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {void}
 */
const filterShortcodesFromTree = ( tree, shortcodeTags ) => {
	if ( shortcodeTags ) {
		const sortcodeTagsRegexString = createShortcodeTagsRegex( shortcodeTags );
		const shortcodeTagsRegex = new RegExp( sortcodeTagsRegexString, "g" );

		filterShortcodesFromSentences( tree, shortcodeTags, shortcodeTagsRegex );
	}
};

export default filterShortcodesFromTree;
