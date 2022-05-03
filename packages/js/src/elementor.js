import { dispatch } from "@wordpress/data";
import { doAction } from "@wordpress/hooks";
import { applyModifications, pluginReady, pluginReloaded, registerPlugin, registerModification } from "./elementor/initializers/pluggable";
import initAnalysis, { collectData } from "./initializers/analysis";
import initElementorEditorIntegration from "./initializers/elementor-editor-integration";
import initializeEstimatedReadingTime from "./initializers/estimated-reading-time";
import initEditorStore from "./elementor/initializers/editor-store";
import initializeUsedKeywords from "./elementor/initializers/used-keywords-assessment";
import initElementorWatcher from "./watchers/elementorWatcher";
import initHighlightFocusKeyphraseForms from "./elementor/initializers/highlightFocusKeyphraseForms";
import initReplaceVarPlugin, { addReplacement, ReplaceVar } from "./elementor/replaceVars/elementor-replacevar-plugin";
import initializeIntroduction from "./elementor/initializers/introduction";

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

	// Initialize Estimated Reading Time.
	initializeEstimatedReadingTime();

	// Initialize focus keyphrase forms highlighting.
	initHighlightFocusKeyphraseForms( window.YoastSEO.analysis.worker.runResearch );

	// Initialize the introduction.
	initializeIntroduction();

	// Initialize the editor integration.
	initElementorEditorIntegration();

	// Offer an action after our load.
	doAction( "yoast.elementor.loaded" );
}

// Wait on `window.elementor`.
jQuery( window ).on( "elementor:init", () => {
	// Wait on Elementor app to have started.
	window.elementor.on( "panel:init", () => {
		setTimeout( initialize );
	} );
} );
