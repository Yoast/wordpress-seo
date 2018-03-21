/**
 * Adapter for retrieving the replacevars in either the classic editor or TinyMCE.
 */
class ReplacevarData {
	/**
	 * @param {DataCollector} dataCollector The data collector.
	 */
	constructor( dataCollector ) {
		this.dataCollector = dataCollector;
	}

	/**
	 * Gets the parent title from the select box.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle() {
		return this.dataCollector.getParentTitle();
	}
}

export default ReplacevarData;
