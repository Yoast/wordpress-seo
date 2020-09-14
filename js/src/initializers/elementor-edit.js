import initAdminMedia from "../initializers/admin-media";
import initEditorStore from "../initializers/editor-store";
import initScraper from "../initializers/elementor-scraper";

export default function initElementorEdit() {
	// Initialize the editor store.
	const store = initEditorStore();

	// Initialize the editor integration.
	window.yoast.initEditorIntegration( store );
	const editorData = new window.yoast.EditorData( () => {}, store );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );
	window.editorData = editorData;

	// Initialize the scraper.
	initScraper( jQuery, store, editorData );

	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );
};
