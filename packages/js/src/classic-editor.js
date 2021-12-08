/* global wpseoPrimaryCategoryL10n */
import domReady from "@wordpress/dom-ready";
import createSeoIntegration, { SEO_STORE_NAME } from "@yoast/seo-integration";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initClassicEditorIntegration from "./initializers/classic-editor-integration";
import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import createClassicEditorWatcher from "./watchers/classicEditorWatcher";
import { getInitialState } from "./classic-editor/initial-state";
import { getAnalysisConfiguration } from "./classic-editor/analysis";

domReady( async() => {
	// Initialize the tab behavior of the metabox.
	initTabs( jQuery );

	// Initialize global admin scripts.
	initAdmin( jQuery );

	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );

	// Initialize the primary category integration.
	if ( typeof wpseoPrimaryCategoryL10n !== "undefined" ) {
		initPrimaryCategory( jQuery );
	}


	const watcher = createClassicEditorWatcher( { storeName: SEO_STORE_NAME } );

	const {} = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
		initialState: getInitialState(),
	} );


	// TODO:
	// - expose global API (pluggable/see scrapers).
	// - create a SEO data watcher that updates our hidden fields so that the changed data is saved along with the WP save.
	// - traffic light & admin bar: update analysis scores?

	// Start watching the editor data.
	watcher.watch();

	// We have to do this differently: all the components are coupled to the store, which we are changing :)
	// Responsibility:
	// - render metabox
	// - provide slot/fill mechanism
	initClassicEditorIntegration( {} );
} );
