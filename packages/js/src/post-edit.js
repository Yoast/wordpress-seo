
import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";
import { noop } from "lodash";
import initializeAiGenerator from "./ai-generator/initialize";
import initAdmin from "./initializers/admin";
import initEditorStore from "./initializers/editor-store";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initTabs from "./initializers/metabox-tabs";
import initPostScraper from "./initializers/post-scraper";
import initPrimaryCategory from "./initializers/primary-category";
import initializeInsights from "./insights/initializer";

// Backwards compatibility globals.
window.wpseoPostScraperL10n = window.wpseoScriptData.metabox;
window.wpseoShortcodePluginL10n = window.wpseoScriptData.analysis.plugins.shortcodes;

window.YoastSEO = window.YoastSEO || {};

domReady( () => {
	// Initialize the tab behavior of the metabox.
	initTabs( jQuery );

	// Initialize the primary category integration.
	if ( typeof wpseoPrimaryCategoryL10n !== "undefined" ) {
		initPrimaryCategory( jQuery );
	}

	// Initialize the editor store.
	const store = initEditorStore();

	// Initialize the editor integration
	window.yoast.initEditorIntegration( store );
	const editorData = new window.yoast.EditorData( noop, store );
	editorData.initialize(
		window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars,
		window.wpseoScriptData.analysis.plugins.replaceVars.hidden_replace_vars
	);

	// Initialize the post scraper.
	initPostScraper( jQuery, store, editorData );

	// Initialize the featured image integration for classic editor and block editor only.
	if ( ! window.wpseoScriptData?.isElementorEditor ) {
		initFeaturedImageIntegration( jQuery );
	}

	// Initialize global admin scripts.
	initAdmin( jQuery );

	// Initialize the insights.
	initializeInsights();


	const AI_IGNORED_POST_TYPES = [ "attachment" ];

	if ( window.wpseoScriptData.postType && ! AI_IGNORED_POST_TYPES.includes( window.wpseoScriptData.postType ) ) {
		// Initialize the AI Generator upsell.
		initializeAiGenerator();
	}
} );
