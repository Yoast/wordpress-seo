import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { RemoteDataProvider } from "@yoast/dashboard-frontend";
import { get } from "lodash";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import App from "./app";
import { ROOT_ID, STORE_NAME } from "./constants";
import { DataProvider } from "./services";
import registerStore from "./store";

domReady( () => {
	const root = document.getElementById( ROOT_ID );
	if ( ! root ) {
		return;
	}

	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoBulkEditorData.linkParams", {} ),
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
	const remoteDataProvider = new RemoteDataProvider( { headers: { "X-Wp-Nonce": nonce } } );

	const router = createHashRouter(
		createRoutesFromElements(
			<Route path="/" element={ <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> } />
		)
	);

	// Mounted without the ui-library Root wrapper (RFC: Root-independent rendering).
	// RTL is handled via the dir attribute instead of the Root context.
	// The yst-root class (NOT the Root component) is temporarily needed for the ui-library component styles
	// to apply: they are still scoped under .yst-root until Yoast/engineering#16 lands. Remove it then.
	createRoot( root ).render(
		<div dir={ isRtl ? "rtl" : "ltr" } className="yst-root">
			<SlotFillProvider>
				<RouterProvider router={ router } />
			</SlotFillProvider>
		</div>
	);
} );
