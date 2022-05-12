import { register, createReduxStore, registerStore } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

import * as actions from "./frontend/redux/actions";
import * as selectors from "./frontend/redux/selectors";
import frontendReducer from "./frontend/redux/reducer";
import { renderReactRoot } from "./helpers/reactRoot";
import FrontendModal from "./frontend/redux/container";

domReady( () => {
	if ( window.wp.data.createReduxStore ) {
		const store = createReduxStore( "yoast-seo/frontend", {
			reducer: frontendReducer,
			actions,
			selectors,
		} );

		register( store );
	} else {
		/*
		* Compatibility fix for WP 5.6.
		* Remove this and the related import when WP 5.6 is no longer supported.
		*/
		registerStore( "yoast-seo/frontend", {
			reducer: frontendReducer,
			actions,
			selectors,
		} );
	}

	renderReactRoot( "wpseo-inspect-root", <FrontendModal /> );
} )
