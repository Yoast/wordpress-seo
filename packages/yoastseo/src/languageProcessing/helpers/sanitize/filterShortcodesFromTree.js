
/**
 * Creates a regex to filter shortcodes from HTML.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {RegExp} The regex to recognize the shortcodes.
 */
export const createShortcodeTagsRegex = shortcodeTags => {
	const shortcodeTagsRegexString = `\\[\\/?(${ shortcodeTags.join( "|" ) })[^\\]]*\\]`;
	return new RegExp( shortcodeTagsRegexString, "g" );
};

/**
 * Filters shortcodes from HTML string.
 * @param {string} html The HTML to filter.
 * @param {string[]} shortcodeTags The tags of the shortcodes to filter.
 * @returns {string} The filtered HTML.
 */
export const filterShortcodesFromHTML = ( html, shortcodeTags ) => {
	if ( ! shortcodeTags || shortcodeTags.length === 0 ) {
		return html;
	}
	const shortcodeTagsRegex = createShortcodeTagsRegex( shortcodeTags );
	return html.replace( shortcodeTagsRegex, "" );
};

/**
 * Checks if a token is part of an opening shortcode.
 * @param {Token[]} tokens The tokens to check.
 * @param {number} index The index of the current token.
 * @returns {boolean} Whether the token is part of an opening shortcode.
 */
const tokenIsPartOfOpeningShortcode = ( tokens, index ) => {
	return tokens[ index - 1 ] && tokens[ index - 1 ].text === "[";
};

/**
 * Checks if a token is part of a closing shortcode.
 * @param {Token[]} tokens The tokens to check.
 * @param {number} index The index of the current token.
 * @returns {boolean} Whether the token is part of a closing shortcode.
 */
const tokenIsPartOfClosingShortcode = ( tokens, index ) => {
	return  tokens[ index - 1 ] && tokens[ index - 1 ].text === "/"  && tokens[ index - 2 ]  && tokens[ index - 2 ].text === "[";
};

/**
 * Checks if a token is part of a shortcode.
 * @param {Token[]} tokens The tokens to check.
 * @param {number} index The index of the current token.
 * @param {string[]} shortcodeTags An array of active shortcode tags.
 * @param {boolean} encounteredClosingBracket Whether a closing bracket has been encountered (while looping backwards through the tokens).
 * @returns {boolean} Whether the token is part of a shortcode.
 */
const tokenIsShortcode = ( tokens, index, shortcodeTags, encounteredClosingBracket ) => {
	return encounteredClosingBracket && shortcodeTags.includes( tokens[ index ].text ) &&
		( tokenIsPartOfOpeningShortcode( tokens, index ) || tokenIsPartOfClosingShortcode( tokens, index )  );
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

	let encounteredClosingBracket = false;
	// traverse through tokens backwards
	for ( let i = tokens.length - 1; i >= 0; i-- ) {
		if ( tokens[ i ].text === "]" ) {
			encounteredClosingBracket = true;
		}

		if ( tokenIsShortcode( tokens, i, shortcodeTags, encounteredClosingBracket ) ) {
			while ( tokens[ i ].text !== "]" ) {
				tokens.splice( i, 1 );
			}
			tokens.splice( i, 1 );
			encounteredClosingBracket = false;

			while ( tokens[ i - 1 ] && "[/".includes( tokens[ i - 1 ].text ) ) {
				tokens.splice( i - 1, 1 );
				i--;
			}
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
	if ( ! shortcodeTags || shortcodeTags.length === 0 ) {
		return;
	}
	const shortcodeTagsRegex = createShortcodeTagsRegex( shortcodeTags );

	filterShortcodesFromSentences( tree, shortcodeTags, shortcodeTagsRegex );
};

export default filterShortcodesFromTree;
