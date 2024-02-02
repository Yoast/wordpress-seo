import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";
import { noop } from "lodash";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initEditorStore from "./initializers/editor-store";
import initTabs from "./initializers/metabox-tabs";
import initTermScraper from "./initializers/term-scraper";
import initializeInsights from "./insights/initializer";
import { termsTmceId } from "./lib/tinymce";

domReady( () => {
	// Backwards compatibility globals.
	window.wpseoTermScraperL10n = window.wpseoScriptData.metabox;

	// Initialize global admin scripts.
	initAdmin( jQuery );

	// Initialize the tab behavior of the metabox.
	initTabs( jQuery );

	// Initialize the editor store.
	const store = initEditorStore();

	// Initialize the editor integration
	window.yoast.initEditorIntegration( store );
	const editorData = new window.yoast.EditorData( noop, store, termsTmceId );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );

	// Initialize the post scraper.
	initTermScraper( jQuery, store, editorData );

	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );

	// Initialize the insights.
	initializeInsights();
} );
