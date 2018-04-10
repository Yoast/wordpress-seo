/**
 * Prototype class for replacevar data collectors.
 */
class DataCollector {
	constructor( store ) {
		this.store = store;
	}

	/**
	 * Get the id of the post's parent.
	 *
	 * @returns {string} The parent's id.
	 */
	getParentId() {
		return "";
	}

	/**
	 * Get the title of the post's parent.
	 *
	 * @param {string}   id       The parent's id.
	 * @param {function} callback Function to be called if the value has to be retrieved asynchronously.
	 *
	 * @returns {string} The parent's title.
	 */
	/* eslint-disable */
	getParentTitle( id, callback ) {
		return "(not available)";
	}
	/* eslint-enable */
}


export default DataCollector;
