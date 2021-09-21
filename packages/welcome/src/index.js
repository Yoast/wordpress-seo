import { render } from "@wordpress/element";
import registerGlobalAPIs from "@yoast/admin-ui-toolkit/global-apis";
import { setLocaleData } from "@yoast/admin-ui-toolkit/helpers";
import App from "./app";

/**
 * Initializes the welcome app.
 *
 * @returns {Object} Object with the render function.
 */
export default function initialize( { options = {} } = {} ) {
	options.translations?.forEach( ( { global, domain } ) => setLocaleData( global, domain ) );

	return {
		/**
		 * Renders the app.
		 *
		 * @param {HTMLElement} rootElement The element to render the app in.
		 *
		 * @returns {void}
		 */
		render: ( rootElement ) => {
			render(
				<App navigateWhenDone={ options.navigateWhenDone } options={ options } />,
				rootElement,
			);
		},
	};
}

registerGlobalAPIs( [ { welcomeApp: initialize } ] );
