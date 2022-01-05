/* global wpseoScriptData wpseoPrimaryCategoryL10n */

import domReady from "@wordpress/dom-ready";
import { dispatch } from "@wordpress/data";
import createSeoIntegration, { SEO_STORE_NAME } from "@yoast/seo-integration";
import registerShortcodes from "./classic-editor/shortcodes";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import registerGlobalApis from "./helpers/register-global-apis";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initEditorStore from "./classic-editor/editor-store";
import Metabox from "./classic-editor/components/metabox";
import { MetaboxFill, MetaboxSlot } from "./classic-editor/components/metabox/slot-fill";
import createClassicEditorWatcher from "./classic-editor/watcher";
import { getInitialState } from "./classic-editor/initial-state";
import { getAnalysisConfiguration } from "./classic-editor/analysis";
import { refreshDelay } from "./analysis/constants";
import { debounce } from "lodash";

const registerApis = registerGlobalApis( "YoastSEO" );

domReady( async () => {
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

	const { SeoProvider, analysisWorker } = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
		initialState: getInitialState(),
	} );

	/*
	 * Register the analysis worker on `window.YoastSEO.analysis.worker`
	 * and refreshing the analysis on `window.YoastSEO.app.refresh`
	 * for backwards compatibility with the add-ons.
	 */
	registerApis( [
		{ analysis: { worker: analysisWorker } },
		{
			app: {
				refresh: debounce( dispatch( SEO_STORE_NAME ).analyze, refreshDelay ),
			},
		},
	] );

	// Until ALL the components are carried over, the `@yoast-seo/editor` store is still needed.
	initEditorStore();

	// - expose global API (pluggable/see scrapers).
	registerShortcodes();

	// - create a SEO data watcher that updates our hidden fields so that the changed data is saved along with the WP save.
	// - traffic light & admin bar: update analysis scores?

	// Start watching and syncing between store and editor data.
	const watcher = createClassicEditorWatcher();
	watcher.watch();

	// We have to do this differently: all the components are coupled to the store, which we are changing :)
	// Responsibility:
	// - render metabox
	// - provide slot/fill mechanism
	// Expose registerReactComponent as an alternative to registerPlugin.
	registerApis( [ { _registerReactComponent: registerReactComponent } ] );

	renderReactRoot( {
		target: "wpseo-metabox-root",
		children: (
			<SeoProvider>
				<MetaboxSlot />
				<MetaboxFill>
					<Metabox />
				</MetaboxFill>
			</SeoProvider>
		),
		theme: { isRtl: Boolean( wpseoScriptData.metabox.isRtl ) },
		location: "metabox",
	} );

	jQuery( window ).trigger( "YoastSEO:ready" );
} );
