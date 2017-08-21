import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";

import DevTools from "./utils/DevTools";
import configureStore from "./configureStore";

const store = configureStore();

const TopLevelComponents = ( { children } ) => (
	<Provider store={ store }>
		<div>
			{ children }
			<DevTools />
		</div>
	</Provider>
);

TopLevelComponents.propTypes = {
	children: PropTypes.node,
};

export default TopLevelComponents;

