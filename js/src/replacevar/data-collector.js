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
	 * @param {string} parentId The parent's id.
	 *
	 * @returns {Promise} A Promise containing the Parent Title.
	 */
	/* eslint-disable */
	getParentTitle( parentId ) {
		return new Promise( () => "(not available)" );
	}
	/* eslint-enable */
}

export default DataCollector;
