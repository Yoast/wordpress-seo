import domReady from "@wordpress/dom-ready";
// import initAnalysis from "./initializers/analysis";
// import initElementorEditorIntegration from "./initializers/elementor-editor-integration";
import initEditorStore from "./initializers/editor-store";
import initElementorWatcher from "./watchers/elementorWatcher";

domReady( () => {
	// Initialize the editor store and set it on the window.
	const store = initEditorStore();

	// Initialize the editor data watcher.
	initElementorWatcher();

	// Initialize analysis.
	// initAnalysis();
} );

// Initialize the editor integration.
// initElementorEditorIntegration();

// STORE INIT
// Register our store to WP data.
// Added:
// - editorData (title, description, slug)
//		Is slug really an editor data thing? Also, do we need the extra draft slug checks?
// - searchMetadata (seo title, seo description, focus keyphrase)

// WATCHER INIT
// Only for non-component data flow into the store.
// Added: editorData for Elementor

// PAGE INIT
// - Render React root.
// > PER COMPONENT INIT
//   Example: analysis: subscribe to store and refresh when data changed

// Create replacement variable initalization that replaces the `fillReplacementVariables` in the analysis data.
// Use the new searchMetadata.keyphrase in the KeywordInput component.
