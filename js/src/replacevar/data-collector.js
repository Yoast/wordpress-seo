/**
 * Prototype class for replacevar data collectors.
 */
class DataCollector {
	constructor( store ) {
		this.store = store;
	}

	getParentTitle( parentId, callback ) {
		callback( "" );
	}

	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		return "";
	}
}

export default DataCollector;
