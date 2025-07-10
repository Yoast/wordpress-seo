import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import registerStore from "./store";
import { select } from "@wordpress/data";
import { STORE_NAME } from "./constants";
import { AppProvider } from "./appProvider";

domReady( () => {
	const root = document.getElementById( "yoast-seo-redirects" );
	if ( ! root ) {
		return;
	}

	registerStore();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<AppProvider />
		</Root>,
		root
	);
} );
