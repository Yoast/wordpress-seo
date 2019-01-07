import React from "react";
import renderer from "react-test-renderer";
import { IntlProvider } from "react-intl";

/**
 * Creates an IntlProvider.
 *
 * @param {string} children      The inner text of the component.
 * @param {object} props         The component's props.
 * @param {object} renderOptions The renderOptions.
 *
 * @returns {ReactComponent} The IntlProvider Component.
 */
export const createComponentWithIntl = ( children, props = { locale: "en" }, renderOptions = {} ) => {
	return renderer.create(
		<IntlProvider { ...props }>
			{ children }
		</IntlProvider>,
		renderOptions
	);
};
