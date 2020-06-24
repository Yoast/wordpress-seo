import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initPostScraper from "./initializers/post-scraper";
import initFeaturedImageIntegration from "./initializers/featured-image";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initEditorStore from "./initializers/editor-store";
import isBlockEditor from "./helpers/isBlockEditor";
import ClassicEditorData from "./analysis/classicEditorData";
import initClassicEditorIntegration from "./initializers/classic-editor-integration";
import BlockEditorData from "./analysis/blockEditorData";
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import { tmceId } from "./lib/tinymce";

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

// Initialize either the classic editor integration or the block editor integration.
let editorData;
if ( isBlockEditor() ) {
	initBlockEditorIntegration( store );
	editorData = new BlockEditorData( () => {}, store );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );
} else {
	initClassicEditorIntegration( store );
	editorData = new ClassicEditorData( () => {}, store, tmceId );
	editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );
}

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
