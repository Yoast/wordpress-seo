/**
 * The maximum number of tokens to consider for default content types.
 *
 * Note that whitespace and punctuation tokens count towards this budget.
 *
 * @type {number}
 */
export const MAX_TOKENS_DEFAULT = 300;

/**
 * The maximum number of tokens to consider for irregular content types (e.g. products or terms).
 *
 * @type {number}
 */
export const MAX_TOKENS_IRREGULAR = 150;

/**
 * Sanitizes the text by replacing new lines and carriage returns with a space.
 *
 * @param {string} text The text to sanitize.
 *
 * @returns {string} The sanitized text.
 */
const sanitizeText = ( text ) => text.replace( /[\n\r]+/g, " " );

/**
 * Accumulates the sentences of one paragraph that still fit the token budget.
 *
 * @param {Array<{text: string, tokens: Array}>} sentences  The paragraph's sentences.
 * @param {number}                              tokenCount The running token count.
 * @param {number}                              maxTokens  The token budget.
 *
 * @returns {{text: string, tokenCount: number, exceeded: boolean}} The text to append, the new running count, and
 *                                                                  whether the budget was passed inside this paragraph.
 */
const collectParagraph = ( sentences, tokenCount, maxTokens ) => {
	let text = "";
	let count = tokenCount;

	for ( const sentence of sentences ) {
		count += sentence.tokens.length;
		// Only whole sentences are added, so a sentence that does not fit ends the collection rather than being cut.
		if ( count > maxTokens ) {
			return { text, tokenCount: count, exceeded: true };
		}

		text += sanitizeText( sentence.text );
	}

	return { text, tokenCount: count, exceeded: false };
};

/**
 * Accumulates the AI prompt's `content` from parsed paragraphs, up to a token budget.
 *
 * Shared by the in-editor AI generator and the bulk editor so both send the same prompt content for a given post.
 * The paragraphs are the result of the analysis engine's `getParagraphs` research, so the tokens counted here are
 * parse-tree tokens produced by the language's own tokenizer (including TinySegmenter for Japanese and the
 * hyphen-preserving variant for Indonesian).
 *
 * Collection stops at the first sentence that does not fit, so the result never ends mid-sentence and no work is
 * done on the paragraphs beyond it.
 *
 * @param {Array<{sentences: Array<{text: string, tokens: Array}>}>} paragraphs The parsed paragraphs.
 * @param {number} maxTokens The token budget, including whitespace and punctuation tokens.
 *
 * @returns {string} The prompt content. Never empty: falls back to a single full stop, which the AI service requires.
 */
export const collectPromptContent = ( paragraphs, maxTokens ) => {
	let promptContent = "";
	let tokenCount = 0;

	for ( const paragraph of Array.isArray( paragraphs ) ? paragraphs : [] ) {
		const collected = collectParagraph( paragraph.sentences ?? [], tokenCount, maxTokens );
		promptContent += collected.text;
		tokenCount = collected.tokenCount;

		if ( collected.exceeded ) {
			break;
		}

		// Add a space between paragraphs, which counts as a token itself.
		promptContent += " ";
		tokenCount += 1;
	}

	// To prevent a completely empty prompt content, fall back to a single full stop.
	return promptContent.trimEnd() || ".";
};
