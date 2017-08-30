import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";

import DevTools from "./utils/DevTools";
import configureStore from "./configureStore";

const store = configureStore();

const AppWrapper = ( { children } ) => (
	<AppContainer>
		<Provider store={ store }>
			<div>
				{ children }
				<DevTools />
			</div>
		</Provider>
	</AppContainer>
);

AppWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AppWrapper;

