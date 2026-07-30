import { get } from "lodash";
import { ensureTree, Paper } from "yoastseo";
import { collectPromptContent, MAX_TOKENS_DEFAULT } from "../../shared-admin/helpers/prompt-content";
import { getResearcher } from "./researcher";

/**
 * How much raw content is parsed at most, in characters.
 *
 * Only the first few hundred tokens are ever used, which is an order of magnitude less text than this, so the cut
 * cannot affect the sentences that get collected — it just keeps a pathologically long post from costing tens of
 * milliseconds to parse. For the same reason it does not matter that a plain slice may land inside a tag: the
 * damage is far past the token budget.
 *
 * @type {number}
 */
const MAX_RAW_CHARACTERS = 20000;

/**
 * Reads the bulk editor's analysis configuration from the localized script data.
 *
 * The registered shortcode tags let the parser strip shortcode delimiters while keeping the text they enclose,
 * matching the post editor. Without them the raw brackets stay in the text and eat into the token budget.
 *
 * @returns {{contentLocale: string, shortcodes: string[]}} The analysis configuration.
 */
const getAnalysisData = () => ( {
	contentLocale: get( window, [ "wpseoBulkEditorData", "analysis", "contentLocale" ], "en_US" ),
	shortcodes: get( window, [ "wpseoBulkEditorData", "analysis", "shortcodes" ], [] ),
} );

/**
 * Collects the AI prompt's `content` from a post's raw content.
 *
 * This is the bulk editor's counterpart to the in-editor AI generator's prompt content, and deliberately the same
 * machinery: the content is parsed by the analysis engine into a tree, `getParagraphs` is run against it on the
 * main thread (no analysis worker — `ensureTree` is the supported entry point for that), and the sentences are
 * accumulated by the shared {@link collectPromptContent}. So the same post yields the same prompt content in both
 * flows, including the per-language tokenizers (TinySegmenter for Japanese, the hyphen-preserving Indonesian
 * variant) that a server-side re-implementation cannot reproduce.
 *
 * Exposed to Premium on `window.yoast.bulkEditor.helpers`, so Premium needs no `yoastseo` import of its own.
 *
 * @param {string}  content              The post's raw content.
 * @param {Object}  [options]            The options.
 * @param {number}  [options.maxTokens]  The token budget; defaults to the budget for regular content types.
 *
 * @returns {Promise<string>} The prompt content. Never empty: falls back to a single full stop.
 */
export const preparePromptContent = async( content, { maxTokens = MAX_TOKENS_DEFAULT } = {} ) => {
	const { contentLocale, shortcodes } = getAnalysisData();
	const researcher = await getResearcher( contentLocale );

	const paper = new Paper(
		String( content ?? "" ).slice( 0, MAX_RAW_CHARACTERS ),
		{ locale: contentLocale, shortcodes }
	);

	// Build the tree the paragraph research depends on, then bind the paper to the researcher. This is what the
	// analysis worker's `runResearch` does internally; doing it here keeps the work off a worker round trip.
	ensureTree( paper, researcher );
	researcher.setPaper( paper );

	return collectPromptContent( researcher.getResearch( "getParagraphs" ), maxTokens );
};
