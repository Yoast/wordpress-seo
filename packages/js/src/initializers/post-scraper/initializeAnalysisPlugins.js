/* global wpseoScriptData */

import YoastReplaceVarPlugin from "../../analysis/plugins/replacevar-plugin";
import YoastReusableBlocksPlugin from "../../analysis/plugins/reusable-blocks-plugin";
import { initShortcodePlugin } from "../../analysis/plugins/shortcode-plugin";
import YoastMarkdownPlugin from "../../analysis/plugins/markdown-plugin";
import * as tinyMCEHelper from "../../lib/tinymce";
import isBlockEditor from "../../helpers/isBlockEditor";
import AnalysisFields from "../../helpers/fields/AnalysisFields";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "../../analysis/isContentAnalysisActive";
import isInclusiveLanguageAnalysisActive from "../../analysis/isInclusiveLanguageAnalysisActive";
import * as publishBox from "../../ui/publishBox";
import { update as updateTrafficLight } from "../../ui/trafficLight";
import { update as updateAdminBar } from "../../ui/adminBar";

/**
 * Initializes keyword analysis.
 *
 * @param {Object} activePublishBox The publish box object.
 *
 * @returns {void}
 */
function initializeKeywordAnalysis( activePublishBox ) {
	const savedKeywordScore = AnalysisFields.seoScore;

	const indicator = getIndicatorForScore( savedKeywordScore );

	updateTrafficLight( indicator );
	updateAdminBar( indicator );

	activePublishBox.updateScore( "keyword", indicator.className );
}

/**
 * Initializes content analysis.
 *
 * @param {Object} activePublishBox The publish box object.
 *
 * @returns {void}
 */
function initializeContentAnalysis( activePublishBox ) {
	const savedContentScore = AnalysisFields.readabilityScore;

	const indicator = getIndicatorForScore( savedContentScore );

	updateAdminBar( indicator );

	activePublishBox.updateScore( "content", indicator.className );
}

/**
 * Initializes the inclusive language analysis.
 *
 * @param {Object} activePublishBox The publish box object.
 *
 * @returns {void}
 */
function initializeInclusiveLanguageAnalysis( activePublishBox ) {
	const savedContentScore = AnalysisFields.inclusiveLanguageScore;

	const indicator = getIndicatorForScore( savedContentScore );

	updateAdminBar( indicator );

	activePublishBox.updateScore( "inclusive-language", indicator.className );
}

/**
 * Activates the correct analysis and tab based on which analyses are enabled.
 *
 * @returns {void}
 */
function activateEnabledAnalysis() {
	if ( isKeywordAnalysisActive() ) {
		initializeKeywordAnalysis( publishBox );
	}

	if ( isContentAnalysisActive() ) {
		initializeContentAnalysis( publishBox );
	}

	if ( isInclusiveLanguageAnalysisActive() ) {
		initializeInclusiveLanguageAnalysis( publishBox );
	}
}

/**
 * Registers all analysis plugins (replace vars, shortcode, reusable blocks, markdown)
 * and sets the tinyMCE helper reference on window.YoastSEO.wp.
 *
 * @param {Object} app   The YoastSEO app instance.
 * @param {Object} store The Yoast SEO Redux store.
 *
 * @returns {void}
 */
export function initializeAnalysisPlugins( app, store ) {
	window.YoastSEO.wp = {};
	window.YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app, store );
	initShortcodePlugin( app, store );

	if ( isBlockEditor() ) {
		const reusableBlocksPlugin = new YoastReusableBlocksPlugin( app.registerPlugin, app.registerModification, window.YoastSEO.app.refresh );
		reusableBlocksPlugin.register();
	}
	if ( wpseoScriptData.metabox.markdownEnabled ) {
		const markdownPlugin = new YoastMarkdownPlugin( app.registerPlugin, app.registerModification );
		markdownPlugin.register();
	}

	window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;
	activateEnabledAnalysis();
}
