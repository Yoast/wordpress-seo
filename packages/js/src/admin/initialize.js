import { SlotFillProvider } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Root } from "@yoast/ui-library";
import { HashRouter } from "react-router-dom";
import App from "./app";
import { STORE_NAME } from "./constants";
import {
	createRouteRegistry,
	createStyledComponentsVoidStylesheetProvider,
	ensureElement,
	fixWordPressFocusLinkCompatibility,
	fixWordPressMenuScrolling,
	registerGlobalApis,
} from "./helpers";
import { registerStore } from "./store";

domReady( () => {
	const StyledComponentsVoidStylesheetProvider = createStyledComponentsVoidStylesheetProvider();
	fixWordPressFocusLinkCompatibility();
	fixWordPressMenuScrolling();

	registerStore();
	dispatch( STORE_NAME ).addRoutes( [
		{ id: "insights", priority: 0, path: "/insights", text: __( "Insights", "wordpress-seo" ) },
		{ id: "workouts", priority: 2, path: "/workouts", text: __( "Workouts", "wordpress-seo" ) },
		{ id: "features", priority: 4, path: "/features", text: __( "Features", "wordpress-seo" ) },
		{ id: "tools", priority: 8, path: "/tools", text: __( "Tools", "wordpress-seo" ) },
		{ id: "support", priority: 10, path: "/support", text: __( "Support", "wordpress-seo" ) },
	] );

	const routeRegistry = createRouteRegistry();
	const isRtl = select( STORE_NAME ).selectFromShared( "isRtl", false );

	render(
		(
			<Root context={ { isRtl } }>
				<StyledComponentsVoidStylesheetProvider>
					<SlotFillProvider>
						<HashRouter>
							<App routeElements={ routeRegistry.elements } />
						</HashRouter>
					</SlotFillProvider>
				</StyledComponentsVoidStylesheetProvider>
			</Root>
		),
		ensureElement( "yoast-seo-admin" )
	);

	registerGlobalApis( "YoastSEO", { admin: { registerRoute: routeRegistry.register } } );
} );
