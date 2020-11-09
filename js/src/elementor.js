import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { pluginReady, pluginReloaded, registerPlugin, registerModification } from "./elementor/initializers/pluggable";
import initAnalysis from "./initializers/analysis";
import initElementorEditorIntegration from "./initializers/elementor-editor-integration";
import initEditorStore from "./elementor/initializers/editor-store";
import initElementorWatcher from "./watchers/elementorWatcher";
import initHighlightFocusKeyphraseForms from "./elementor/initializers/highlightFocusKeyphraseForms";
import initReplaceVarPlugin, { addReplacement, ReplaceVar } from "./elementor/replaceVars/elementor-replacevar-plugin";

domReady( () => {
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

	// Initialize analysis.
	window.YoastSEO.analysis = window.YoastSEO.analysis || {};
	window.YoastSEO.analysis.run = dispatch( "yoast-seo/editor" ).refreshAnalysisDataTimestamp;
	window.YoastSEO.analysis.worker = initAnalysis();

	// Initialize replacement variables plugin.
	initReplaceVarPlugin();
	window.YoastSEO.wp = window.YoastSEO.wp || {};
	window.YoastSEO.wp.replaceVarsPlugin = {
		addReplacement,
		ReplaceVar,
	};

	initHighlightFocusKeyphraseForms( window.YoastSEO.analysis.worker.runResearch );
} );

// Initialize the editor integration.
initElementorEditorIntegration();
