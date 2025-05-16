import { get, noop } from "lodash";
import { Paper } from "yoastseo";
import { MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR } from "../constants";
import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * Sanitize the text by replacing new lines amd carriage returns with space.
 *
 * @param {string} text The text to sanitize.
 * @returns {string} The sanitized text.
 */
const sanitizeText = ( text ) => text.replace( /[\n\r]+/g, " " );

/**
 * Prepares the prompt content by fetching the first paragraph from the editor.
 * From this paragraph, limit the number of tokens (including whitespace and punctuation) to a supplied maximum.
 *
 * @param {function} setOnStore The reducer function that sets the prompt content on the store.
 * @returns {void}
 */
export const preparePromptContent = ( setOnStore ) => {
	const isProduct = select( STORE_NAME_EDITOR ).getIsProduct();
	const isTerm = select( STORE_NAME_EDITOR ).getIsTerm();;
	
	/**
	 * The maximum number of tokens we add to the 'content' variable in the prompt.
	 * For products and terms, we stick to the first 150 tokens, for all other post types, we consider 300 tokens.
	 * Note that we include whitespace or punctuation tokens in this count.
	 * @type {number}
	 */
	const isWooCommerceActive = select( STORE_NAME_EDITOR ).getIsWooCommerceActive();
	const maxTokens = ( isProduct && isWooCommerceActive ) || isTerm ? MAX_TOKENS_IRREGULAR : MAX_TOKENS_DEFAULT;
	const runResearch = get( window, "YoastSEO.analysis.worker.runResearch", noop );
	const collectData = get( window, "YoastSEO.analysis.collectData", false );

	// Fall back to the existing paper, inside the analysis worker, when collectData is not present.
	const paper = collectData ? Paper.parse( collectData() ) : null;

	runResearch( "getParagraphs", paper ).then( response => {
		let promptContent = "";

		if ( response.result ) {
			const paragraphs = response.result;
			if ( paragraphs ) {
				let tokenCount = 0;
				paragraphs.forEach( paragraph => {
					paragraph.sentences.forEach( sentence => {
						tokenCount += sentence.tokens.length;
						// Stop when the length of the sentences until now (in tokens) overrides the maximum allowed number.
						if ( tokenCount > maxTokens ) {
							return promptContent;
						}

						promptContent += sanitizeText( sentence.text );
					} );

					// Add a space between paragraphs.
					promptContent += " ";
					tokenCount += 1;
				} );
			}
		}
		// Set the resulting prompt content on the store. To prevent a completely empty prompt content, store a single full stop.
		setOnStore( promptContent.trimEnd() || "." );
	} );
};
