import { dispatch } from "@wordpress/data";
import { doAction } from "@wordpress/hooks";
import initializeWordProofForElementorEditor from "../../../vendor_prefixed/wordproof/wordpress-sdk/resources/js/initializers/elementorEditor";
import initializeAiGenerator from "./ai-generator/initialize";
import initEditorStore from "./elementor/initializers/editor-store";
import initHighlightFocusKeyphraseForms from "./elementor/initializers/highlightFocusKeyphraseForms";
import initializeIntroduction from "./elementor/initializers/introduction";
import initializeIntroductionEditorV2 from "./elementor/initializers/introduction-editor-v2";
import { applyModifications, pluginReady, pluginReloaded, registerModification, registerPlugin } from "./initializers/pluggable";
import initializeUsedKeywords from "./elementor/initializers/used-keywords-assessment";
import initReplaceVarPlugin, { addReplacement, ReplaceVar } from "./elementor/replaceVars/elementor-replacevar-plugin";
import { isWordProofIntegrationActive } from "./helpers/wordproof";
import initAnalysis, { collectData } from "./initializers/analysis";
import initElementorEditorIntegration from "./initializers/elementor-editor-integration";
import initializeInsights from "./insights/initializer";
import initElementorWatcher from "./watchers/elementorWatcher";

/* eslint-disable complexity */
/**
 * Initializes Yoast SEO for Elementor.
 *
 * @returns {void}
 */
function initialize() {
	// Initialize the editor store and set it on the window.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO.store = initEditorStore();

	// Initialize the editor data watcher.
	initElementorWatcher();

	/*
	 * Expose pluggable.
	 *
	 * Note: this is exposed on YoastSEO directly instead of in a pluggable scope.
	 * This is so we don't have to adapt Premium or plugins.
	 */
	window.YoastSEO.pluginReady = pluginReady;
	window.YoastSEO.pluginReloaded = pluginReloaded;
	window.YoastSEO.registerModification = registerModification;
	window.YoastSEO.registerPlugin = registerPlugin;
	window.YoastSEO.applyModifications = applyModifications;

	// Initialize analysis.
	window.YoastSEO.analysis = window.YoastSEO.analysis || {};
	window.YoastSEO.analysis.run = dispatch( "yoast-seo/editor" ).runAnalysis;
	window.YoastSEO.analysis.worker = initAnalysis();
	window.YoastSEO.analysis.collectData = collectData;

	// Initialize replacement variables plugin.
	initReplaceVarPlugin();
	window.YoastSEO.wp = window.YoastSEO.wp || {};
	window.YoastSEO.wp.replaceVarsPlugin = {
		addReplacement,
		ReplaceVar,
	};

	// Initialize the Used Keywords Assessment.
	initializeUsedKeywords();

	// Initialize insights.
	initializeInsights();

	// Initialize focus keyphrase forms highlighting.
	initHighlightFocusKeyphraseForms( window.YoastSEO.analysis.worker.runResearch );

	// Initialize the introduction.
	if ( window.elementorFrontend.config.experimentalFeatures.editor_v2 ) {
		initializeIntroductionEditorV2();
	} else {
		initializeIntroduction();
	}

	// Initialize the editor integration.
	initElementorEditorIntegration();

	if ( isWordProofIntegrationActive() ) {
		initializeWordProofForElementorEditor();
	}

	const AI_IGNORED_POST_TYPES = [ "attachment", "product" ];

	if ( window.wpseoScriptData.postType && ! AI_IGNORED_POST_TYPES.includes( window.wpseoScriptData.postType ) ) {
		// Initialize the AI Generator upsell.
		initializeAiGenerator();
	}

	// Offer an action after our load.
	doAction( "yoast.elementor.loaded" );
}
/* eslint-enable complexity */

// Wait on `window.elementor`.
jQuery( window ).on( "elementor:init", () => {
	// Wait on Elementor app to have started.
	window.elementor.on( "panel:init", () => {
		setTimeout( initialize );
	} );
} );
