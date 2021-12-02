/* global wpseoScriptData */

import domReady from "@wordpress/dom-ready";
import createSeoIntegration, { createDefaultReplacementVariableConfigurations, SEO_STORE_NAME } from "@yoast/seo-integration";
import { mapValues, pick } from "lodash";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import registerGlobalApis from "./helpers/register-global-apis";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import initEditorStore from "./metabox/editor-store";
import Metabox from "./metabox/metabox";
import { MetaboxFill, MetaboxSlot } from "./metabox/slot-fill";
import createClassicEditorWatcher, { getEditorData } from "./watchers/classicEditorWatcher";
import { getAnalysisConfiguration } from "./classic-editor/analysis";

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


	const watcher = createClassicEditorWatcher( { storeName: SEO_STORE_NAME } );

<<<<<<< HEAD
	const {} = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
=======
	const { SeoProvider } = await createSeoIntegration( {
		analysisWorkerUrl: wpseoScriptData.analysis.worker.url,
		analysisDependencies: pick( wpseoScriptData.analysis.worker.dependencies, [
			"lodash",
			"regenerator-runtime",
			"wp-autop",
			"wp-polyfill",
			"yoast-seo-jed-package",
			"yoast-seo-feature-flag-package",
			"yoast-seo-analysis-package",
			"yoast-seo-en-language",
		] ),
		analysisTypes: {
			post: {
				name: "post",
				replacementVariableConfigurations: mapValues( createDefaultReplacementVariableConfigurations() ),
			},
			term: {
				name: "term",
				replacementVariableConfigurations: mapValues( createDefaultReplacementVariableConfigurations() ),
			},
		},
>>>>>>> 522fc90221 (Swap out the metabox for a copy)
		initialState: {
			editor: getEditorData(),
		},
	} );

	// Until ALL the components are carried over, the `@yoast/editor` store is still needed.
	initEditorStore();


	const registerApis = registerGlobalApis( "YoastSEO" );

	// - expose global API (pluggable/see scrapers).
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
} );
