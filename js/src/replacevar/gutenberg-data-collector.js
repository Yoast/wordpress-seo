/* global wp */

/**
 * Internal dependencies
 */
import DataCollector from "./data-collector";
import { getParentTitle } from "../redux/actions";

class GutenbergDataCollector extends DataCollector {
	constructor( store ) {
		super( store );
	}

	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		return wp.data.select( "core/editor" ).getEditedPostAttribute( "parent" );
	}
}


export default GutenbergDataCollector;
