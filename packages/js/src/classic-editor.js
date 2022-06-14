import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import createSeoIntegration, { SEO_STORE_NAME } from "@yoast/seo-integration";
import { debounce, get } from "lodash";
import { refreshDelay } from "./analysis/constants";
import { getAnalysisConfiguration } from "./classic-editor/getAnalysisConfiguration";
import Metabox from "./classic-editor/components/metabox";
import { MetaboxFill, MetaboxSlot } from "./classic-editor/components/metabox/slot-fill";
import initEditorStore from "./classic-editor/editor-store";
import { getInitialPostState, getInitialTermState } from "./classic-editor/initial-state";
import { initPostWatcher, initTermWatcher } from "./classic-editor/watcher";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";
import registerGlobalApis from "./helpers/register-global-apis";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initTabs from "./initializers/metabox-tabs";
import initPrimaryCategory from "./initializers/primary-category";
import { initTermDescriptionTinyMce } from "./initializers/tiny-mce";
import { initialize as initPublishBox } from "./ui/publishBox";
import { registerFeaturedImagePlugin, registerMarkdownPlugin, registerSeoTitleWidthPlugin, registerShortcodePlugin } from "./classic-editor/plugins";
import { getContentTypeReplacements } from "./classic-editor/content-types";
import initializeUsedKeyphrasesAssessment from "./classic-editor/plugins/used-keyphrases-assessment";

// These are either "1" or undefined.
const isPost = Boolean( get( window, "wpseoScriptData.isPost" ) );
const isTerm = Boolean( get( window, "wpseoScriptData.isTerm" ) );

/**
 * Renders the metabox React components.
 *
 * @param {Object} options Options object.
 * @param {JSX.Element} options.SeoProvider SeoProvider component.
 * @returns {void}
 */
const renderMetabox = ( { SeoProvider } ) => renderReactRoot( {
	target: "wpseo-metabox-root",
	children: (
		<SeoProvider>
			<MetaboxSlot />
			<MetaboxFill>
				<Metabox />
			</MetaboxFill>
		</SeoProvider>
	),
	theme: { isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ) },
	location: "metabox",
} );

/**
 * Registers Yoast APIs on the global for backwards compatibility.
 *
 * @param {Object} options Options object.
 * @param {Object} options.analysisWorker The analysis worker interface.
 * @returns {function} Function to register YoastSEO APIs.
 */
const registerYoastApis = ( { analysisWorker } ) => registerGlobalApis(
	"YoastSEO",
	[
		// YoastSEO._registerReactComponent: Render new components inside the React tree.
		{ _registerReactComponent: registerReactComponent },
		// YoastSEO.analysis.worker: access the analysis worker directly.
		{ analysis: { worker: analysisWorker } },
		// YoastSEO.app.refresh: refresh the analysis by dispatching the analyze action.
		{ app: { refresh: debounce( dispatch( SEO_STORE_NAME ).analyze, refreshDelay ) } },
	]
);

/**
 * Initialize the post specific logic.
 *
 * @returns {void}
 */
const initPost = async() => {
	// Initialize featured image plugin.
	registerFeaturedImagePlugin();
	// Register shortcodes to work on paper data.
	registerShortcodePlugin();
	// Register markdown plugin if enabled.
	if ( get( window, "wpseoScriptData.metabox.markdownEnabled", false ) ) {
		registerMarkdownPlugin();
	}
	// Initialize the publish box.
	initPublishBox();
	// Create SEO integration with post state.
	const { SeoProvider, analysisWorker } = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
		initialState: getInitialPostState(),
		contentTypes: getContentTypeReplacements(),
	} );
	// Register global Yoast APIs.
	registerYoastApis( { analysisWorker } );
	initializeUsedKeyphrasesAssessment(
		"get_focus_keyword_usage",
		window.YoastSEO.app.refresh
	);
	// Start watching for DOM/store changes.
	initPostWatcher();
	// Render metabox with provider.
	renderMetabox( { SeoProvider } );
};

/**
 * Initialize the term specific logic.
 *
 * @returns {void}
 */
const initTerm = async() => {
	// Initialize TinyMCE description editor for terms.
	initTermDescriptionTinyMce( jQuery );
	// Create SEO integration with term state.
	const { SeoProvider, analysisWorker } = await createSeoIntegration( {
		analysis: getAnalysisConfiguration(),
		initialState: getInitialTermState(),
		contentTypes: getContentTypeReplacements(),
	} );
	// Register global Yoast APIs.
	registerYoastApis( { analysisWorker } );
	initializeUsedKeyphrasesAssessment(
		"get_term_keyword_usage",
		window.YoastSEO.app.refresh
	);
	// Start watching for DOM/store changes.
	initTermWatcher();
	// Render metabox with provider.
	renderMetabox( { SeoProvider } );
};

domReady( async() => {
	// Initialize the tab behavior of the metabox.
	initTabs( jQuery );
	// Initialize global admin scripts.
	initAdmin( jQuery );
	// Initialize the media library for our social settings.
	initAdminMedia( jQuery );
	// Until ALL the components are carried over, the `@yoast-seo/editor` store is still needed.
	initEditorStore();
	// Register SEO title width plugin.
	registerSeoTitleWidthPlugin();
	// Register markdown plugin.
	registerMarkdownPlugin();
	// Initialize the primary category integration.
	if ( get( window, "wpseoPrimaryCategoryL10n", false ) ) {
		initPrimaryCategory( jQuery );
	}
	// Initialize post logic if post page.
	if ( isPost ) {
		await initPost();
	}
	// Initialize term logic if term page.
	if ( isTerm ) {
		await initTerm();
	}
	// All systems go!
	jQuery( window ).trigger( "YoastSEO:ready" );
} );
