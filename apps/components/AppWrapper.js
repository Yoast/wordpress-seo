import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";

import DevTools from "./utils/DevTools";
import configureStore from "./configureStore";

const store = configureStore();

/**
 * The AppWrapper container component.
 *
 * @param {object} children The component's children.
 *
 * @returns {ReactElement} The AppContainer component.
 */
const AppWrapper = ( { children } ) => (
	<Provider store={ store }>
		<div>
			{ children }
			<DevTools />
		</div>
	</Provider>
);

AppWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppWrapper;

