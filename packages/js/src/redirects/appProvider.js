import { StyleSheetManager } from "styled-components";
import App from "./app";
import { SlotFillProvider } from "@wordpress/components";
import { HashRouter } from "react-router-dom";

/**
 * Provider component for the redirects application.
 * @param {Object} [redirectsProps={}] - Props to pass to the redirects page.
 * @param {Object} [regexProps={}] - Props to pass to the regex redirects page.
 * @param {Object} [redirectMethodProps={}] - Props to pass to the redirect method page.
 * @returns {JSX.Element} The wrapped redirects application with providers.
 */
export const AppProvider = ( {
	redirectsProps = {},
	regexProps = {},
	redirectMethodProps = {},
} ) => {
	// Prevent Styled Components' styles by adding the stylesheet to a div that is in the shadow DOM.
	const shadowHost = document.createElement( "div" );
	const shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	document.body.appendChild( shadowHost );

	return (
		<StyleSheetManager target={ shadowRoot }>
			<SlotFillProvider>
				<HashRouter>
					<App
						redirectsProps={ redirectsProps }
						regexProps={ regexProps }
						redirectMethodProps={ redirectMethodProps }
					/>
				</HashRouter>
			</SlotFillProvider>
		</StyleSheetManager>
	);
};
