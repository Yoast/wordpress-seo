import get from "lodash/get";

import { addReplacevar } from "../redux/actions";

/**
 * Adapter for retrieving the replacevars in either the classic editor or TinyMCE.
 */
class ReplacevarData {
	/**
	 * @param {function}      refresh       Refresh function for YoastSEO.
	 * @param {DataCollector} dataCollector The data collector.
	 * @param {Object}        store         The redux store.
	 */
	constructor( refresh, dataCollector, store ) {
		this.refresh = refresh;
		this.dataCollector = dataCollector;
		this.store = store;
	}

	/**
	 * Gets the parent title from the select box.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle() {
		const parentId = this.dataCollector.getParentId();
		if( ! parentId || parentId === 0 ) {
			return "";
		}
		const parentTitle = get( this.store.getState().replacevars, `parentTitle.${ parentId }` );
		if( parentTitle ) {
			return parentTitle;
		}

		this.dataCollector.getParentTitle( parentId, ( parentTitle ) => {
			this.store.dispatch(
				addReplacevar(
					"parentTitle",
					parentId,
					parentTitle,
				)
			);
			this.refresh();
		} );
		return "";
	}


}

export default ReplacevarData;
