import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { PluginArea } from "@wordpress/plugins";
import { RemoteDataProvider } from "@yoast/dashboard-frontend";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { GenericAlert } from "../ai-generator/components/errors";
import { getVisibleContentLength } from "../ai-generator/helpers/get-visible-content-length";
import { fixWordPressMenuScrolling, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR } from "../shared-admin/helpers";
import { getMyyoastConnectionState, LINK_PARAMS_NAME, MYYOAST_CONNECTION_NAME } from "../shared-admin/store";
import App from "./app";
import { UpsellModal } from "./components/upsell-modal";
import { PLUGIN_SCOPE, ROOT_ID, STORE_NAME } from "./constants";
import { useAiUpsell } from "./hooks/use-ai-upsell";
import { DataProvider } from "./services";
import { preparePromptContent } from "./services/prompt-content";
import registerStore from "./store";

// Expose the pieces Premium reuses instead of duplicating: the bulk AI upsell modal, the error alert its consent
// flow shows when granting consent fails, the prompt-content service its bulk AI generation collects each post's
// prompt content with, and the visible-length helper it measures "limited content" with — the same helper the
// in-editor AI tip uses, so both surfaces judge content length identically. The token budgets travel along too,
// so those numbers are defined once here rather than mirrored in Premium. Premium's bulk-editor bundle depends on
// this script, so the globals are set before Premium reads them. This is an unversioned cross-plugin surface:
// Free and Premium ship in lockstep.
window.yoast = window.yoast || {};
window.yoast.bulkEditor = window.yoast.bulkEditor || {};
window.yoast.bulkEditor.components = { ...window.yoast.bulkEditor.components, UpsellModal, GenericAlert };
window.yoast.bulkEditor.hooks = { ...window.yoast.bulkEditor.hooks, useAiUpsell };
window.yoast.bulkEditor.helpers = { ...window.yoast.bulkEditor.helpers, preparePromptContent, getVisibleContentLength };
window.yoast.bulkEditor.constants = { ...window.yoast.bulkEditor.constants, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR };

domReady( () => {
	const root = document.getElementById( ROOT_ID );
	if ( ! root ) {
		return;
	}
	// Null when the MyYoast connection feature is unavailable (flag off / not provisioned).
	const myyoastConnection = get( window, "wpseoBulkEditorData.myyoastConnection", null );

	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoBulkEditorData.linkParams", {} ),
			[ MYYOAST_CONNECTION_NAME ]: getMyyoastConnectionState( myyoastConnection ),
		},
	} );
	fixWordPressMenuScrolling();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );
	const nonce = get( window, "wpseoBulkEditorData.nonce", "" );

	const dataProvider = new DataProvider( {
		contentTypes: get( window, "wpseoBulkEditorData.contentTypes", [] ),
		endpoints: get( window, "wpseoBulkEditorData.endpoints", {} ),
		links: get( window, "wpseoBulkEditorData.links", {} ),
	} );
	const remoteDataProvider = new RemoteDataProvider( { headers: { "X-WP-Nonce": nonce } } );

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> } />
		)
	);

	// RTL is handled via the dir attribute instead of the Root context.
	createRoot( root ).render(
		<div dir={ isRtl ? "rtl" : "ltr" } className="yst-root">
			<SlotFillProvider>
				<RouterProvider router={ router } />
				<PluginArea scope={ PLUGIN_SCOPE } />
			</SlotFillProvider>
		</div>
	);
} );
