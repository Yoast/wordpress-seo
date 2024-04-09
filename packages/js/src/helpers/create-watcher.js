import { clone, isEqual, reduce } from "lodash";

/**
 * Creates a getter for an array of getters.
 *
 * Use this if you want to combine getData functions.
 *
 * @param {function} getters The getters.
 * @returns {function} The combined getter.
 */
export const createCollector = ( ...getters ) => () => getters.map( getData => getData() );

/**
 * Creates a watcher.
 *
 * Useful for redux store subscribes.
 *
 * @param {function} getData Called to get the data.
 * @param {function} onChange Called to notify of change.
 *
 * @returns {function} The watcher.
 */
export const createWatcher = ( getData, onChange ) => {
	// Save the current data for comparison.
	let previous = getData();

	/**
	 * Checks for data changes and runs callback if detected.
	 * @returns {void}
	 */
	return () => {
		const data = getData();

		if ( isEqual( data, previous ) ) {
			return;
		}

		previous = data;
		onChange( clone( data ) );
	};
};

/**
 * Creates a getter for an object of getters.
 *
 * Use this if you want to combine getData functions.
 *
 * @param {Object<string, function>} getters The getters.
 * @returns {function} The combined getter.
 */
export const createCollectorFromObject = ( getters ) => () => reduce(
	getters,
	( result, getData, key ) => {
		result[ key ] = getData();
		return result;
	},
	{}
);


