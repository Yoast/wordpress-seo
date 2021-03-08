import initTabs from "./initializers/metabox-tabs";
import initTermScraper from "./initializers/term-scraper";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initEditorStore from "./initializers/editor-store";
import { termsTmceId } from "./lib/tinymce";
import domReady from "@wordpress/dom-ready";

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
	const editorData = new window.yoast.EditorData( () => {
	}, store, termsTmceId );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );

	// Initialize the post scraper.
	initTermScraper( jQuery, store, editorData );

	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );
} );
