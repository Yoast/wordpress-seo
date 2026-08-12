import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { PluginArea } from "@wordpress/plugins";
import { RemoteDataProvider } from "@yoast/dashboard-frontend";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { GenericAlert } from "../ai-generator/components/errors";
import { fixWordPressMenuScrolling, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR } from "../shared-admin/helpers";
import {
	getMyyoastConnectionState,
	LINK_PARAMS_NAME,
	MYYOAST_CONNECTION_NAME,
	OPT_IN_NOTIFICATION_NAME,
	REPLACEMENT_VARIABLES_NAME,
	getReplacementVariablesInitialState } from "../shared-admin/store";
// Imported directly rather than through the barrel: it pulls in `yoastseo`, which must not become a
// dependency of the other pages that import that barrel.
import { getVisibleContentLength } from "../shared-admin/helpers/get-visible-content-length";
import App from "./app";
import { UpsellModal } from "./components/upsell-modal";
import { BULK_UPDATE_BATCH_SIZE, PLUGIN_SCOPE, ROOT_ID, STORE_NAME } from "./constants";
import { useAiUpsell } from "./hooks/use-ai-upsell";
import { DataProvider } from "./services";
import { preparePromptContent } from "./services/prompt-content";
import registerStore from "./store";

/*
 * Cross-plugin surface consumed by Premium's bulk-editor bundle.
 *
 * Premium depends on this script, so the globals below are guaranteed to exist
 * before Premium reads them. Free and Premium ship in lockstep (unversioned).
 *
 * Exposed pieces:
 *  - UpsellModal        – Bulk AI upsell dialog.
 *  - GenericAlert       – Error alert shown when the consent flow fails.
 *  - preparePromptContent – Collects each post's prompt content for bulk AI generation.
 *  - getVisibleContentLength – Measures "limited content" length; shared with the
 *                              in-editor AI tip so both surfaces judge length identically.
 *  - MAX_TOKENS_DEFAULT / MAX_TOKENS_IRREGULAR – Token budgets, defined once here
 *                              rather than mirrored in Premium.
 *  - useAiUpsell        – Hook driving the upsell flow.
 */
window.yoast = window.yoast || {};
window.yoast.bulkEditor = window.yoast.bulkEditor || {};
window.yoast.bulkEditor.components = { ...window.yoast.bulkEditor.components, UpsellModal, GenericAlert };
window.yoast.bulkEditor.hooks = { ...window.yoast.bulkEditor.hooks, useAiUpsell };
window.yoast.bulkEditor.helpers = { ...window.yoast.bulkEditor.helpers, preparePromptContent, getVisibleContentLength };
window.yoast.bulkEditor.constants = { ...window.yoast.bulkEditor.constants, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR };

/**
 * Builds the store state for a selection carried over from a WP admin overview bulk action.
 *
 * @param {Object} [initialSelection] The carried-over selection ({ contentType, postIds, selectedCount }), if any.
 *
 * @returns {Object} The seeded state: the active content type, the selection and the overview filter.
 */
export const getPreselectionState = ( initialSelection = {} ) => {
	const selectedIds = ( Array.isArray( initialSelection.postIds ) ? initialSelection.postIds : [] )
		.map( Number )
		.filter( ( id ) => Number.isInteger( id ) && id > 0 )
		.slice( 0, BULK_UPDATE_BATCH_SIZE );

	return {
		// An empty or unknown name resolves to the first available content type in the app.
		activeContentType: typeof initialSelection.contentType === "string" ? initialSelection.contentType : "",
		selection: {
			selectedIds,
			preselectedTotal: selectedIds.length > 0 ? Math.max( Number( initialSelection.selectedCount ) || 0, selectedIds.length ) : 0,
		},
		query: {
			overviewIds: selectedIds,
			isOverviewFilterActive: selectedIds.length > 0,
		},
	};
};

domReady( () => {
	const root = document.getElementById( ROOT_ID );
	if ( ! root ) {
		return;
	}
	// Null when the MyYoast connection feature is unavailable (flag off / not provisioned).
	const myyoastConnection = get( window, "wpseoBulkEditorData.myyoastConnection", null );
	const replacementVariables = get( window, "wpseoBulkEditorData.replacementVariables", {} );
	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoBulkEditorData.linkParams", {} ),
			[ MYYOAST_CONNECTION_NAME ]: getMyyoastConnectionState( myyoastConnection ),
			[ REPLACEMENT_VARIABLES_NAME ]: getReplacementVariablesInitialState( replacementVariables ),
			...getPreselectionState( get( window, "wpseoBulkEditorData.initialSelection", {} ) ),
			[ OPT_IN_NOTIFICATION_NAME ]: {
				seen: get( window, "wpseoBulkEditorData.optInNotificationSeen", {} ),
			},
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
