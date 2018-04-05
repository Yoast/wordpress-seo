import React from "react";
import renderer from "react-test-renderer";
import { IntlProvider } from "react-intl";

export const createComponentWithIntl = ( children, props = { locale: "en" }, renderOptions = {} ) => {
	return renderer.create(
		<IntlProvider { ...props }>
			{ children }
		</IntlProvider>,
		renderOptions
	);
};
