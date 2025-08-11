import { StyleSheetManager } from "styled-components";
import App from "./app";
import { SlotFillProvider } from "@wordpress/components";
import { HashRouter } from "react-router-dom";

/**
 * Provider component for the redirects application.
 * @returns {JSX.Element} The wrapped redirects application with providers.
 */
export const AppProvider = () => {
	// Prevent Styled Components' styles by adding the stylesheet to a div that is in the shadow DOM.
	const shadowHost = document.createElement( "div" );
	const shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	document.body.appendChild( shadowHost );

	return (
		<StyleSheetManager target={ shadowRoot }>
			<SlotFillProvider>
				<HashRouter>
					<App />
				</HashRouter>
			</SlotFillProvider>
		</StyleSheetManager>
	);
};
