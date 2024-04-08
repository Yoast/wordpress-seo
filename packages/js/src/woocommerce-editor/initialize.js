import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { registerPlugin } from "@wordpress/plugins";
import { debounce, get, noop } from "lodash";
import { Paper } from "yoastseo";
import { refreshDelay } from "../analysis/constants";
import CustomAnalysisData from "../analysis/CustomAnalysisData";
import getApplyMarks from "../analysis/getApplyMarks";
import handleWorkerError from "../analysis/handleWorkerError";
import YoastMarkdownPlugin from "../analysis/plugins/markdown-plugin";
import YoastReplaceVarPlugin from "../analysis/plugins/replacevar-plugin";
import YoastReusableBlocksPlugin from "../analysis/plugins/reusable-blocks-plugin";
import { initShortcodePlugin } from "../analysis/plugins/shortcode-plugin";
import refreshAnalysis, { initializationDone } from "../analysis/refreshAnalysis";
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import { collectData } from "../initializers/analysis";
import initEditorStore from "../initializers/editor-store";
import { pluginReady, pluginReloaded, registerModification, registerPlugin as registerPluggablePlugin } from "../initializers/pluggable";
import initializeUsedKeywords from "../initializers/used-keywords-assessment";

const PLUGIN_NAME = "yoast-seo-for-woocommerce-products";
const STORE_NAME = "yoast-seo/editor";

const customAnalysisData = new CustomAnalysisData();

domReady( () => {
	// Initialize the global YoastSEO object.
	window.YoastSEO = window.YoastSEO || {};

	// Initialize the editor store.
	window.YoastSEO.store = initEditorStore();

	// Initialize the analysis.
	window.YoastSEO.app = window.YoastSEO.app || {};
	window.YoastSEO.analysis = window.YoastSEO.analysis || {};
	window.YoastSEO.analysis.worker = createAnalysisWorker();
	window.YoastSEO.analysis.collectData = () => Paper.parse( collectData() );
	window.YoastSEO.analysis.applyMarks = getApplyMarks();
	window.YoastSEO.app.refresh = debounce( () => refreshAnalysis(
		window.YoastSEO.analysis.worker,
		() => window.YoastSEO.analysis.collectData,
		window.YoastSEO.analysis.applyMarks,
		window.YoastSEO.store,
		/**
		 * Ignore these scores.
		 * For posts, the PostDataCollector' saveScores and more is used. Which updates the publish box, traffic light, admin bar and the hidden
		 * field to save the score.
		 * In the Woo editor, we currently do not have any of these. The save itself should be arranged by syncing our store with the post metadata.
		 */
		{
			saveScores: noop,
			saveContentScore: noop,
			saveInclusiveLanguageScore: noop,
		}
	), refreshDelay );
	window.YoastSEO.app.analyzeTimer = window.YoastSEO.app.refresh;
	window.YoastSEO.app.registerCustomDataCallback = customAnalysisData.register;
	// Initialize the pluggable system.
	window.YoastSEO.app.registerPlugin = registerPluggablePlugin;
	window.YoastSEO.app.registerModification = registerModification;
	window.YoastSEO.app.pluginReady = pluginReady;
	window.YoastSEO.app.pluginReloaded = pluginReloaded;

	// Initialize analysis plugins.
	window.YoastSEO.wp = window.YoastSEO.wp || {};
	window.YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( window.YoastSEO.app, window.YoastSEO.store );
	initShortcodePlugin( window.YoastSEO.app, window.YoastSEO.store );
	initializeUsedKeywords( window.YoastSEO.app.refresh, "get_focus_keyword_usage_and_post_types", window.YoastSEO.store );
	( new YoastReusableBlocksPlugin(
		window.YoastSEO.app.registerPlugin,
		window.YoastSEO.app.registerModification,
		window.YoastSEO.app.refresh
	) ).register();
	if ( get( window, "wpseoScriptData.metabox.markdownEnabled", false ) ) {
		( new YoastMarkdownPlugin( window.YoastSEO.app.registerPlugin, window.YoastSEO.app.registerModification ) ).register();
	}

	// Start the analysis worker.
	window.YoastSEO.analysis.worker.initialize( getAnalysisConfiguration( {
		useCornerstone: select( STORE_NAME ).isCornerstoneContent(),
	} ) )
		.then( () => {
			jQuery( window ).trigger( "YoastSEO:ready" );
			initializationDone();
			window.YoastSEO.app.refresh();
		} )
		.catch( handleWorkerError );

	// Initialize the Yoast SEO app.
	registerPlugin( PLUGIN_NAME, {
		name: PLUGIN_NAME,
		scope: "woocommerce-product-block-editor",
		render: () => null,
	} );
} );
