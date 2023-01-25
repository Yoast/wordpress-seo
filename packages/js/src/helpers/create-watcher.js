import { clone, isEqual } from "lodash";

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
const createWatcher = ( getData, onChange ) => {
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

export default createWatcher;
