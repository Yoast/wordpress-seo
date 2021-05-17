import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";

import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initPostScraper from "./initializers/post-scraper";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initEditorStore from "./initializers/editor-store";
import initializeEstimatedReadingTime from "./initializers/estimated-reading-time";

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
	const editorData = new window.yoast.EditorData( () => {}, store );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );

	// Initialize the post scraper.
	initPostScraper( jQuery, store, editorData );

	// Initialize the featured image integration.
	if ( window.wpseoScriptData && typeof window.wpseoScriptData.featuredImage !== "undefined" ) {
		initFeaturedImageIntegration( jQuery );
	}

	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );

	// Initialize global admin scripts.
	initAdmin( jQuery );

	// Initialize the Estimated Reading Time
	initializeEstimatedReadingTime();
} );
