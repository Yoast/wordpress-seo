/* global wpseoScriptData wpseoPrimaryCategoryL10n */

import domReady from "@wordpress/dom-ready";
import createSeoIntegration from "@yoast/seo-integration";
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

	const watcher = createClassicEditorWatcher();

	const { SeoProvider } = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
		initialState: getInitialState(),
	} );

	// Until ALL the components are carried over, the `@yoast-seo/editor` store is still needed.
	initEditorStore();

	// - expose global API (pluggable/see scrapers).
	registerShortcodes();

	// - create a SEO data watcher that updates our hidden fields so that the changed data is saved along with the WP save.
	// - traffic light & admin bar: update analysis scores?

	// Start watching the editor data.
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
