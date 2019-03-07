/* global module */
import { createStore, compose } from "redux";

import rootReducer from "./reducers";
import DevTools from "./utils/DevTools";

const enhancer = compose(
	DevTools.instrument()
);

export default ( initialState ) => {
	const store = createStore( rootReducer, initialState, enhancer );

	if ( module.hot ) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept( "./reducers", () => {
			const nextRootReducer = require( "./reducers" ); // eslint-disable-line global-require
			store.replaceReducer( nextRootReducer );
		} );
	}

	return store;
};
