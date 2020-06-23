import initTabs from "./initializers/metabox-tabs";
import initTermScraper from "./initializers/term-scraper";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import { registerReactComponent } from "./helpers/classicEditor";
import ClassicEditor from "./initializers/classic-editor";
import initEditorStore from "./initializers/editor-store";
import { termsTmceId } from "./lib/tinymce";

// Backwards compatibility globals.
window.wpseoTermScraperL10n = window.wpseoScriptData.metabox;

// Initialize global admin scripts.
initAdmin( jQuery );

// Initialize the tab behavior of the metabox.
initTabs( jQuery );

// Initialize the editor store.
const store = initEditorStore();

// Set YoastSEO global.
window.YoastSEO = {};
window.YoastSEO.store = store;

// Expose registerReactComponent as an alternative to registerPlugin.
window.YoastSEO._registerReactComponent = registerReactComponent;
const editor = new ClassicEditor(
	{
		store: store,
		onRefreshRequest: () => {},
		replaceVars: window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars,
		classicEditorDataSettings: {
			tinyMceId: termsTmceId,
		},
	}
);

// Initialize the post scraper.
initTermScraper( jQuery, editor, store );

// Initialize the media library for our social settings.
initAdminMedia( jQuery );
