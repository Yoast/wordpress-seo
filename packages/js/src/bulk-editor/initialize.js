import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { PluginArea } from "@wordpress/plugins";
import { RemoteDataProvider } from "@yoast/dashboard-frontend";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { GenericAlert } from "../ai-generator/components/errors";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { getMyyoastConnectionState, LINK_PARAMS_NAME, MYYOAST_CONNECTION_NAME, REPLACEMENT_VARIABLES_NAME, getReplacementVariablesInitialState, OPT_IN_NOTIFICATION_NAME } from "../shared-admin/store";
import App from "./app";
import { UpsellModal } from "./components/upsell-modal";
import { BULK_UPDATE_BATCH_SIZE, PLUGIN_SCOPE, ROOT_ID, STORE_NAME } from "./constants";
import { useAiUpsell } from "./hooks/use-ai-upsell";
import { DataProvider } from "./services";
import registerStore from "./store";

// Expose the bulk AI upsell and the generic error alert so Premium can reuse them instead of duplicating: the
// upsell modal, and the error alert its consent flow shows when granting consent fails. Premium's bulk-editor
// bundle depends on this script, so the globals are set before Premium reads them.
window.yoast = window.yoast || {};
window.yoast.bulkEditor = window.yoast.bulkEditor || {};
window.yoast.bulkEditor.components = { ...window.yoast.bulkEditor.components, UpsellModal, GenericAlert };
window.yoast.bulkEditor.hooks = { ...window.yoast.bulkEditor.hooks, useAiUpsell };

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
