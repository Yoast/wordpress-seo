import { createStore, combineReducers } from "redux";

import reducer from "./reducer";
import configureEnhancers from "../redux/utils/configureEnhancers";

export default () => {
	return createStore(
		combineReducers( {
			pluginInstallation: reducer,
		} ),
		{},
		configureEnhancers()
	);
};
