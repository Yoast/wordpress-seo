import { render } from "@wordpress/element";
import { ImagePickerContext } from "@yoast/admin-ui-toolkit/contexts";
import { HashRouter } from "react-router-dom";

import App from "../app";

/**
 * Renders the app on an HTML element.
 *
 * @param {HTMLElement} rootElement The HTML element to render in.
 * @param {Object} options Extra options to init the app with.
 * @param {Object} options.initialNavigation Initial navigation state.
 * @param {string} options.initialRoute Initial navigation route.
 * @param {Function} options.imagePicker Image picker implementation.
 *
 * @returns {void}
 */
export default function initializeApp( rootElement, { initialNavigation, initialRoute, imagePicker } ) {
	render(
		<ImagePickerContext.Provider value={ imagePicker }>
			<HashRouter>
				<App initialNavigation={ initialNavigation } initialRoute={ initialRoute } />
			</HashRouter>
		</ImagePickerContext.Provider>,
		rootElement,
	);
}
