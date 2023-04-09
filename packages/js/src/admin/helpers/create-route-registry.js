import { dispatch } from "@wordpress/data";
import { createRegistry } from "./index";
import { STORE_NAME } from "../constants";

/**
 * Creates a route registry.
 *
 * By storing the elements locally and the route info in the store.
 *
 * @returns {{elements: Object[], register: function}} The elements and register function.
 */
const createRouteRegistry = () => {
	const registry = createRegistry();

	/**
	 * Registers a route.
	 * @param {{id: string, priority: Number, path: string, text: string}} route The route.
	 * @param {JSX.Element} element The route content.
	 * @returns {function} The unregister method.
	 */
	const register = ( route, element ) => {
		const unregister = registry.register( route.id, element );
		dispatch( STORE_NAME ).addRoute( route );

		return () => {
			dispatch( STORE_NAME ).removeRoute( route.id );
			unregister();
		};
	};

	return {
		elements: registry.collection,
		register,
	};
};

export default createRouteRegistry;
