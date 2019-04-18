import React from "react";
import renderer from "react-test-renderer";
import { IntlProvider } from "react-intl";

/**
 * Creates a component wrapped in an IntlProvider.
 *
 * @param {string} children      The component(s) to wrap with the intlProvider.
 * @param {object} props         The component's props.
 * @param {object} renderOptions The renderOptions.
 *
 * @returns {ReactComponent} The IntlProvider Component.
 */
const createComponentWithIntl = ( children, props = { locale: "en" }, renderOptions = {} ) => {
	return renderer.create(
		<IntlProvider { ...props }>
			{ children }
		</IntlProvider>,
		renderOptions
	);
};

export default createComponentWithIntl;
