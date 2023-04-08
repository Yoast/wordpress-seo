/**
 * Creates a registry for a collection of { key, value }.
 * @returns {{collection: Object[], register: (function(string, *): function(): void)}} The registry.
 */
const createRegistry = () => {
	const collection = [];

	/**
	 * @param {string} key The key.
	 * @param {*} value The value.
	 * @returns {function} Function to unregister.
	 */
	const register = ( key, value ) => {
		const index = collection.push( { key, value } ) - 1;
		return () => {
			collection.splice( index, 1 );
		};
	};

	return {
		collection,
		register,
	};
};

export default createRegistry;
