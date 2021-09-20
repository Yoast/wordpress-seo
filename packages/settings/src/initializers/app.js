import { SlotFillProvider } from "@wordpress/components";
import { render } from "@wordpress/element";
import { ImagePickerContext } from "@yoast/admin-ui-toolkit/contexts";
import { HashRouter } from "react-router-dom";

import App from "../app";

/**
 * Renders the app on an HTML element.
 *
 * @param {HTMLElement} rootElement The HTML element to render in.
 * @param {Object} options Extra options to init the app with.
 * @param {Function} options.imagePicker A function that will be called by the image selects.
 * @param {Object} options.initialNavigation The navigation at the time of initialisation.
 * @param {string} options.initialRoute Initial navigation route.
 *
 * @returns {void}
 */
export default function initializeApp( rootElement, { imagePicker, initialNavigation, initialRoute } ) {
	render(
		<SlotFillProvider>
			<ImagePickerContext.Provider value={ imagePicker }>
				<HashRouter>
					<App initialNavigation={ initialNavigation } initialRoute={ initialRoute } />
				</HashRouter>
			</ImagePickerContext.Provider>
		</SlotFillProvider>,
		rootElement,
	);
}
