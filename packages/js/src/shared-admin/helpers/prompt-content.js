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
 * Accumulates the AI prompt's `content` from parsed paragraphs, up to a token budget.
 *
 * Shared by the in-editor AI generator and the bulk editor so both send the same prompt content for a given post.
 * The paragraphs are the result of the analysis engine's `getParagraphs` research, so the tokens counted here are
 * parse-tree tokens produced by the language's own tokenizer (including TinySegmenter for Japanese and the
 * hyphen-preserving variant for Indonesian).
 *
 * Only whole sentences are ever added, so the result never ends mid-sentence: once the running token count passes
 * the budget the remaining sentences are skipped. Counts only grow, so this is effectively a stop, and any trailing
 * paragraph separators it leaves behind are trimmed off.
 *
 * @param {Array<{sentences: Array<{text: string, tokens: Array}>}>} paragraphs The parsed paragraphs.
 * @param {number} maxTokens The token budget, including whitespace and punctuation tokens.
 *
 * @returns {string} The prompt content. Never empty: falls back to a single full stop, which the AI service requires.
 */
export const collectPromptContent = ( paragraphs, maxTokens ) => {
	let promptContent = "";
	let tokenCount = 0;

	( paragraphs || [] ).forEach( ( paragraph ) => {
		( paragraph.sentences || [] ).forEach( ( sentence ) => {
			tokenCount += sentence.tokens.length;
			// Stop when the sentences so far exceed the maximum allowed number of tokens.
			if ( tokenCount > maxTokens ) {
				return;
			}

			promptContent += sanitizeText( sentence.text );
		} );

		// Add a space between paragraphs, which counts as a token itself.
		promptContent += " ";
		tokenCount += 1;
	} );

	// To prevent a completely empty prompt content, fall back to a single full stop.
	return promptContent.trimEnd() || ".";
};
