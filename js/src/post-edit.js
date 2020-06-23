import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initPostScraper from "./initializers/post-scraper";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import BlockEditor from "./initializers/block-editor";
import initEditorStore from "./initializers/editor-store";
import ClassicEditor from "./initializers/classic-editor";
import { registerReactComponent } from "./helpers/classicEditor";
import { isGutenbergDataAvailable } from "./helpers/isGutenbergAvailable";

// Backwards compatibility globals.
window.wpseoPostScraperL10n = window.wpseoScriptData.metabox;

// Initialize the tab behavior of the metabox.
initTabs( jQuery );

// Initialize the primary category integration.
if ( typeof wpseoPrimaryCategoryL10n !== "undefined" ) {
	initPrimaryCategory( jQuery );
}

// Initialize the editor store.
const store = initEditorStore();

// Set YoastSEO global.
window.YoastSEO = {};
window.YoastSEO.store = store;

// Initialize either the classic editor integration or the block editor integration.
let editor;
if ( typeof window.wp.blockLibrary === "undefined" ) {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO._registerReactComponent = registerReactComponent;
	editor = new ClassicEditor(
		{
			store,
			onRefreshRequest: () => {},
			replaceVars: window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars,
		}
	);
} else {
	editor = new BlockEditor(
		{
			store,
			onRefreshRequest: () => {},
			replaceVars: window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars,
		}
	);
}

// Initialize the post scraper.
initPostScraper( jQuery, editor, store );

// Initialize the featured image integration.
if ( window.wpseoScriptData && typeof window.wpseoScriptData.featuredImage !== "undefined" ) {
	initFeaturedImageIntegration( jQuery );
}

// Initialize the media library for our social settings.
initAdminMedia( jQuery );

// Initialize global admin scripts.
initAdmin( jQuery );
