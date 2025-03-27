/**
 * @typedef {import(".").Node} Node
 * @typedef {import("./SourceCodeLocation").SourceCodeRange} SourceCodeRange
 * @typedef {import("./Token").default} Token
 */

/**
 * A sentence within a text.
 */
class Sentence {
	/**
	 * Creates a sentence.
	 *
	 * @param {string} text The sentence's text.
	 */
	constructor( text ) {
		/**
		 * The text in this sentence.
		 * @type {string}
		 */
		this.text = text;
		/**
		 * The tokens in this sentence.
		 * @type {Token[]}
		 */
		this.tokens = [];
		/**
		 * The start and end positions of the sentence in the source code.
		 * @type {SourceCodeRange}
		 */
		this.sourceCodeRange = {};
	}

	/**
	 * Retrieves the first non-space token in the sentence.
	 * @returns {Token|undefined} The first non-space token in the sentence.
	 */
	getFirstToken() {
		return this.tokens.find( ( { text } ) => text !== " " );
	}

	/**
	 * Retrieves the last non-space token in the sentence.
	 * @returns {Token|undefined} The last non-space token in the sentence.
	 */
	getLastToken() {
		return this.tokens.findLast( ( { text } ) => text !== " " );
	}

	/**
	 * Sets the parent attributes for this sentence.
	 * @param {Node} parentNode The parent node.
	 * @param {Node} tree The full tree.
	 */
	setParentAttributes( parentNode, tree ) {
		const node = parentNode;

		// For implicit paragraphs, base the details on the parent of this node.
		if ( parentNode.isImplicit ) {
			parentNode = parentNode.getParentNode( tree );
		}

		/**
		 * The start offset of the parent node.
		 * The parent node's start offset is the start offset of the parent node if it doesn't have a `startTag` property.
		 * @type {number}
		 */
		this.parentStartOffset = parentNode.getStartOffset();
		/**
		 * The block client ID of the parent node.
		 * @type {string}
		 */
		this.parentClientId = parentNode.clientId || "";
		/**
		 * The attribute ID of the parent node, if available, otherwise an empty string.
		 * Only used for position-based highlighting in sub-blocks of Yoast blocks.
		 * @type {string}
		 */
		this.parentAttributeId = node.attributeId || "";
		/**
		 * Whether the parent node is the first section of Yoast sub-blocks.
		 * Only used for position-based highlighting.
		 * @type {boolean}
		 */
		this.isParentFirstSectionOfBlock = node.isFirstSection || false;
	}
}

export default Sentence;
