import { SlotFillProvider } from "@wordpress/components";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { HashRouter } from "react-router-dom";
import App from "./app";
import registerStore from "./store";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import { get } from "lodash";
import { select } from "@wordpress/data";
import { STORE_NAME } from "./constants";
import { StyleSheetManager } from "styled-components";

domReady( () => {
	const root = document.getElementById( "yoast-seo-redirects" );
	if ( ! root ) {
		return;
	}

	// Prevent Styled Components' styles by adding the stylesheet to a div that is in the shadow DOM.
	const shadowHost = document.createElement( "div" );
	const shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	document.body.appendChild( shadowHost );

	registerStore( {
		initialState: {
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			currentPromotions: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
		},
	} );

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );


	render(
		<Root context={ { isRtl } }>
			<StyleSheetManager target={ shadowRoot }>
				<SlotFillProvider>
					<HashRouter>
						<App />
					</HashRouter>
				</SlotFillProvider>
			</StyleSheetManager>
		</Root>,
		root
	);
} );
