import { select } from "@wordpress/data";
import { get, noop } from "lodash";
import { Paper } from "yoastseo";
import { collectPromptContent, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR } from "../../shared-admin/helpers/prompt-content";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * Prepares the prompt content from the paragraphs of the post currently being edited.
 *
 * The paragraphs come from the analysis worker, which already holds the parsed paper; the accumulation into a
 * token-budgeted string is {@link collectPromptContent}, shared with the bulk editor so both flows send the same
 * prompt content for a given post.
 *
 * For products (with WooCommerce active) and terms only the first 150 tokens are considered, for all other content
 * types 300. Whitespace and punctuation count towards that budget.
 *
 * @param {function} setOnStore The reducer function that sets the prompt content on the store.
 *
 * @returns {void}
 */
export const preparePromptContent = ( setOnStore ) => {
	const isProduct = select( STORE_NAME_EDITOR ).getIsProduct();
	const isTerm = select( STORE_NAME_EDITOR ).getIsTerm();
	const isWooCommerceActive = select( STORE_NAME_EDITOR ).getIsWooCommerceActive();
	const maxTokens = ( isProduct && isWooCommerceActive ) || isTerm ? MAX_TOKENS_IRREGULAR : MAX_TOKENS_DEFAULT;

	const runResearch = get( window, "YoastSEO.analysis.worker.runResearch", noop );
	const collectData = get( window, "YoastSEO.analysis.collectData", false );

	// Fall back to the existing paper, inside the analysis worker, when collectData is not present.
	const paper = collectData ? Paper.parse( collectData() ) : null;

	runResearch( "getParagraphs", paper ).then( ( response ) => {
		setOnStore( collectPromptContent( get( response, "result", [] ), maxTokens ) );
	} );
};
