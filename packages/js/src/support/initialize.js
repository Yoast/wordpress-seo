import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { App } from "./app";
import { STORE_NAME } from "./constants";
import { registerStore } from "./store";

domReady( () => {
	const root = document.getElementById( "yoast-seo-support" );
	if ( ! root ) {
		return;
	}
	registerStore();
	fixWordPressMenuScrolling();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<App />
			</SlotFillProvider>
		</Root>,
		root
	);
} );
