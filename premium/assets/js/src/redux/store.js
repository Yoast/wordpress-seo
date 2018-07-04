import { createStore } from "redux";
import configureEnhancers from "./utils/configureEnhancers";
import rootReducer from "./reducers/rootReducer";

/**
 * Creates a redux store.
 *
 * @returns {Object} The store.
 */
function configureStore() {
	const enhancers = configureEnhancers();

	return createStore( rootReducer, {}, enhancers );
}

export default configureStore;
